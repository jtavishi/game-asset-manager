import RegistryGamesAssetsContract from Project.RegistryGamesAssetsContract


pub contract GameDeveloperComposedContract {

    pub fun transferAsset(tenant:&RegistryGamesAssetsContract.Tenant{RegistryGamesAssetsContract.ITenantMinter}, fromGameId: String, assetId: UInt64, toGameId: String, recipient: &RegistryGamesAssetsContract.GamesCollection){
        let supportedGames = tenant.getGames()
        if supportedGames[fromGameId] != nil && supportedGames[toGameId] != nil{
            let frmRef = recipient.borrowGameCollection(gameId: fromGameId)
            let toRef = recipient.borrowGameCollection(gameId: toGameId)
            if frmRef != nil{
                let asset <- frmRef!.withdraw(withdrawID: assetId)
                if toRef != nil {
                    toRef!.deposit(token: <- asset)
                }
                else{
                    destroy asset
                    panic("Can not transfer asset")
                }
            }else{
                panic("Can not transfer asset")
            }
        } else {
            panic("Can not transfer asset")
        }
        
    }

    init() {
    }
}