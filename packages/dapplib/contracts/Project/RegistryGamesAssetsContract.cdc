import RegistryInterface from Project.RegistryInterface
import RegistryService from Project.RegistryService

pub contract RegistryGamesAssetsContract: RegistryInterface {

    access(contract) var clientTenants: {Address: UInt64}

    pub resource interface ITenantMinter {
        pub var totalSupplyOfAssets: UInt64
        pub var gamesList: {String: String}
        access(contract) fun updateTotalSupply()
        pub fun addGame(gameId: String, gameName: String)
        pub fun getGames ():{String:String}
    }

    pub resource Tenant: ITenantMinter {

        pub var totalSupplyOfAssets: UInt64
        pub var gamesList: {String: String}

        access(contract) fun updateTotalSupply() {
            self.totalSupplyOfAssets = self.totalSupplyOfAssets + (1 as UInt64)
        }

        access(self) let minter: @AssetMinter

        pub fun minterRef(): &AssetMinter {
            return &self.minter as &AssetMinter
        }

        pub fun addGame(gameId: String, gameName: String){
            self.gamesList[gameId] = gameName
        }

        pub fun getGames ():{String:String}{
            return self.gamesList
        }

        init() {
            self.totalSupplyOfAssets = 0
            self.gamesList = {}
            self.minter <- create AssetMinter()
        }

        destroy() {
            destroy self.minter
        }
    }

    pub fun instance(authNFT: &RegistryService.AuthNFT): @Tenant {
        let clientTenant = authNFT.owner!.address
        if let count = self.clientTenants[clientTenant] {
            self.clientTenants[clientTenant] = self.clientTenants[clientTenant]! + (1 as UInt64)
        } else {
            self.clientTenants[clientTenant] = (1 as UInt64)
        }

        return <-create Tenant()
    }

    pub fun getTenants(): {Address: UInt64} {
        return self.clientTenants
    }


    pub let TenantStoragePath: StoragePath
    pub let TenantPublicPath: PublicPath

    pub var totalSupply: UInt64

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub resource Asset {
        pub let id: UInt64

        pub var metadata: {String: String}

        init(_tenant: &Tenant{ITenantMinter}, _metadata: {String: String}) {

            self.id = _tenant.totalSupplyOfAssets
            self.metadata = _metadata
            _tenant.updateTotalSupply()
            RegistryGamesAssetsContract.totalSupply = RegistryGamesAssetsContract.totalSupply + (1 as UInt64)
        }
    }

    pub resource interface INFTCollectionPublic {
        pub fun deposit(token: @Asset)
        pub fun getIDs(): [UInt64]
        pub fun borrowAsset(id: UInt64): &Asset? {
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow Asset reference: The ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: INFTCollectionPublic {

        pub var ownedAssets: @{UInt64: Asset}

        init () {
            self.ownedAssets <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @Asset {
            let token <- self.ownedAssets.remove(key: withdrawID) ?? panic("missing Asset")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        pub fun deposit(token: @Asset) {
            let token <- token as! @RegistryGamesAssetsContract.Asset

            let id: UInt64 = token.id

            let oldToken <- self.ownedAssets[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedAssets.keys
        }

        pub fun borrowAsset(id: UInt64): &Asset? {
            if self.ownedAssets[id] != nil {
                let ref = &self.ownedAssets[id] as auth &Asset
                return ref as! &Asset
            } else {
                return nil
            }
        }

        destroy() {
            destroy self.ownedAssets
        }
    }


    pub resource GamesCollection {
        pub var ownedGamesAssets: @{String: Collection}

        pub fun initGameCollection(tenant: &Tenant{ITenantMinter}, gameId: String){
            let supportedGames = tenant.getGames()
            if supportedGames[gameId] != nil{
                let oldToken <- self.ownedGamesAssets[gameId] <- create Collection()
                destroy oldToken
            } else {
                panic("game id is not supported")
            }
        }

        pub fun borrowGameCollection(gameId: String): &Collection? {
            if self.ownedGamesAssets[gameId] != nil {
                let ref = &self.ownedGamesAssets[gameId] as auth &Collection
                return ref as! &Collection
            } else {
                return nil
            }
        }
        
        pub fun getOwnedGamesIds(): [String]{
            return self.ownedGamesAssets.keys
        }

        pub fun getOwnedGamesAssets(): {String: [UInt64]}{
            let obj:{String: [UInt64]} = {}
            for id in self.ownedGamesAssets.keys {
                let ref = self.borrowGameCollection(gameId: id)
                if ref != nil{
                    obj[id] = ref!.getIDs()
                }
            }
            return obj
        }

        pub fun getAssetMetadata(gameId:String, assetId:UInt64): {String: String} {
            let colRef = self.borrowGameCollection(gameId: gameId)
            if colRef != nil {
                let nftRef = colRef!.borrowAsset(id: assetId)
                if nftRef != nil {
                    return nftRef!.metadata
                }
                else {
                    return {}
                }
            }
            else {
                return {}
            }
        }

        init(){
            self.ownedGamesAssets <- {}
        }

        destroy(){
            destroy self.ownedGamesAssets
        }
    }

    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    pub fun createEmptyGamesCollection(): @GamesCollection {
        return <- create GamesCollection()
    }

    pub resource AssetMinter {

        pub fun mintAsset(tenant: &Tenant{ITenantMinter}, recipient: &GamesCollection, gameId: String, metadata: {String: String}) {
            
            let supportedGames = tenant.getGames()
            if supportedGames[gameId] != nil{
                metadata["game_id"] = gameId
                var newAsset <- create Asset(_tenant: tenant, _metadata: metadata)

                let ref = recipient.borrowGameCollection(gameId: gameId)
                if ref != nil {
                    ref!.deposit(token: <-newAsset)
                }
                else {
                    destroy newAsset
                }
            }
            else {
                panic("Game is not supoorted")
            }
        }
    }

    init() {

        self.totalSupply = 0

        self.clientTenants = {}

        self.TenantStoragePath = /storage/RegistryGamesAssetsContractTenant
        self.TenantPublicPath = /public/RegistryGamesAssetsContractTenant

        emit ContractInitialized()
    }
}