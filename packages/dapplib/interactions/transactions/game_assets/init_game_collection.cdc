import RegistryGamesAssetsContract from Project.RegistryGamesAssetsContract

transaction(recipient: Address, gameId: String) {

    let tenant: &RegistryGamesAssetsContract.Tenant{RegistryGamesAssetsContract.ITenantMinter}
    let receiver: &RegistryGamesAssetsContract.GamesCollection?

  prepare(acct: AuthAccount) {
      self.tenant = acct.borrow<&RegistryGamesAssetsContract.Tenant{RegistryGamesAssetsContract.ITenantMinter}>(from: RegistryGamesAssetsContract.TenantStoragePath)
                        ?? panic("Could not borrow the Tenant")
      self.receiver = getAccount(recipient).getCapability(/public/GamesCollection)
            .borrow<&RegistryGamesAssetsContract.GamesCollection>()
            ?? panic("Could not get receiver reference to the Games Collection")
    }

  execute {
    self.receiver!.initGameCollection(tenant: self.tenant, gameId: gameId)
  }
}

