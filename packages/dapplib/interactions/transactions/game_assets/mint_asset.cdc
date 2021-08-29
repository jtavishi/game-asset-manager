import NonFungibleToken from Flow.NonFungibleToken
import RegistryGamesAssetsContract from Project.RegistryGamesAssetsContract


transaction(gameId: String, recipient: Address, metadata: {String: String}) {

    let tenant: &RegistryGamesAssetsContract.Tenant
    let receiver: &RegistryGamesAssetsContract.GamesCollection

    prepare(acct: AuthAccount) {

        self.tenant = acct.borrow<&RegistryGamesAssetsContract.Tenant>(from: RegistryGamesAssetsContract.TenantStoragePath)
                        ?? panic("Could not borrow the Tenant")
  
        self.receiver = getAccount(recipient).getCapability(/public/GamesCollection)
            .borrow<&RegistryGamesAssetsContract.GamesCollection>()
            ?? panic("Could not get receiver reference to the Games Collection")
        
    }

    execute {
        let minter = self.tenant.minterRef()

        minter.mintAsset(tenant: self.tenant, recipient: self.receiver, gameId: gameId, metadata: metadata)
    }
}