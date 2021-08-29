import RegistryGamesAssetsContract from Project.RegistryGamesAssetsContract

transaction(gameId: String, gameName: String) {

  let tenant: &RegistryGamesAssetsContract.Tenant

  prepare(acct: AuthAccount) {

    self.tenant = acct.borrow<&RegistryGamesAssetsContract.Tenant>(from: RegistryGamesAssetsContract.TenantStoragePath)
                        ?? panic("Could not borrow the Tenant")
  }

  execute {
    self.tenant.addGame(gameId: gameId, gameName: gameName)
  }
}
