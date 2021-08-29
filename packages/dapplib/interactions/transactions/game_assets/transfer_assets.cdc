import RegistryGamesAssetsContract from Project.RegistryGamesAssetsContract
import GameDeveloperComposedContract from Project.GameDeveloperComposedContract

transaction(fromGameId: String, assetId: UInt64, toGameId: String, recipient: Address) {

  let tenant: &RegistryGamesAssetsContract.Tenant
  let recipient: &RegistryGamesAssetsContract.GamesCollection

  prepare(acct: AuthAccount) {

    self.tenant = acct.borrow<&RegistryGamesAssetsContract.Tenant>(from: RegistryGamesAssetsContract.TenantStoragePath)
                        ?? panic("Could not borrow the Tenant")
    self.recipient = getAccount(recipient).getCapability(/public/GamesCollection)
            .borrow<&RegistryGamesAssetsContract.GamesCollection>()
            ?? panic("Could not get receiver reference to the Games Collection")
    
  }

  execute {
    GameDeveloperComposedContract.transferAsset(
        tenant: self.tenant,
        fromGameId: fromGameId,
        assetId: assetId,
        toGameId: toGameId,
        recipient: self.recipient
    )
  }
}
