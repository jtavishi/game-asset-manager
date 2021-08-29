// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappTransactions {

	static registry_receive_auth_nft() {
		return fcl.transaction`
				import RegistryService from 0x01cf0e2f2f715450
				
				// Allows a Tenant to register with the RegistryService. It will
				// save an AuthNFT to account storage. Once an account
				// has an AuthNFT, they can then get Tenant Resources from any contract
				// in the Registry.
				//
				// Note that this only ever needs to be called once per Tenant
				
				transaction() {
				
				    prepare(signer: AuthAccount) {
				        // if this account doesn't already have an AuthNFT...
				        if signer.borrow<&RegistryService.AuthNFT>(from: RegistryService.AuthStoragePath) == nil {
				            // save a new AuthNFT to account storage
				            signer.save(<-RegistryService.register(), to: RegistryService.AuthStoragePath)
				
				            // we only expose the IAuthNFT interface so all this does is allow us to read
				            // the authID inside the AuthNFT reference
				            signer.link<&RegistryService.AuthNFT{RegistryService.IAuthNFT}>(RegistryService.AuthPublicPath, target: RegistryService.AuthStoragePath)
				        }
				    }
				
				    execute {
				
				    }
				}
		`;
	}

	static registry_receive_tenant() {
		return fcl.transaction`
				import RegistryGamesAssetsContract from 0x01cf0e2f2f715450
				import RegistryService from 0x01cf0e2f2f715450
				
				// This transaction allows any Tenant to receive a Tenant Resource from
				// RegistrySampleContract. It saves the resource to account storage.
				//
				// Note that this can only be called by someone who has already registered
				// with the RegistryService and received an AuthNFT.
				
				transaction() {
				
				  prepare(signer: AuthAccount) {
				    // save the Tenant resource to the account if it doesn't already exist
				    if signer.borrow<&RegistryGamesAssetsContract.Tenant>(from: RegistryGamesAssetsContract.TenantStoragePath) == nil {
				      // borrow a reference to the AuthNFT in account storage
				      let authNFTRef = signer.borrow<&RegistryService.AuthNFT>(from: RegistryService.AuthStoragePath)
				                        ?? panic("Could not borrow the AuthNFT")
				      
				      // save the new Tenant resource from RegistrySampleContract to account storage
				      signer.save(<-RegistryGamesAssetsContract.instance(authNFT: authNFTRef), to: RegistryGamesAssetsContract.TenantStoragePath)
				
				      signer.link<&RegistryGamesAssetsContract.Tenant{RegistryGamesAssetsContract.ITenantMinter}>(RegistryGamesAssetsContract.TenantPublicPath, target: RegistryGamesAssetsContract.TenantStoragePath)
				    }
				  }
				
				  execute {
				    log("Registered a new Tenant for RegistryGamesAssetsContract.")
				  }
				}
				
		`;
	}

	static game_assets_add_game() {
		return fcl.transaction`
				import RegistryGamesAssetsContract from 0x01cf0e2f2f715450
				
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
				
		`;
	}

	static game_assets_init_game_collection() {
		return fcl.transaction`
				import RegistryGamesAssetsContract from 0x01cf0e2f2f715450
				
				transaction(gameId: String) {
				
				    let gamesCollectionRef: &RegistryGamesAssetsContract.GamesCollection?
				
				  prepare(acct: AuthAccount) {
				      self.gamesCollectionRef = acct.borrow<&RegistryGamesAssetsContract.GamesCollection>(from: /storage/GamesCollection)?? panic("Can not borrow games collection reference")
				    }
				
				  execute {
				    self.gamesCollectionRef!.initGameCollection(gameId: gameId)
				  }
				}
				
				
		`;
	}

	static game_assets_setup_games_collection() {
		return fcl.transaction`
				import RegistryGamesAssetsContract from 0x01cf0e2f2f715450
				
				transaction {
				
				  prepare(acct: AuthAccount) {
				
				    if acct.borrow<&RegistryGamesAssetsContract.GamesCollection>(from: /storage/GamesCollection) == nil {
				
				      let gamesCollection <- RegistryGamesAssetsContract.createEmptyGamesCollection()
				
				      acct.save(<-gamesCollection, to: /storage/GamesCollection)
				
				      acct.link<&RegistryGamesAssetsContract.GamesCollection>(/public/GamesCollection, target: /storage/GamesCollection)
				    
				      log("Gave account a games Collection")
				    }
				  }
				
				  execute {
				    
				  }
				}
				
		`;
	}

	static game_assets_transfer_assets() {
		return fcl.transaction`
				import RegistryGamesAssetsContract from 0x01cf0e2f2f715450
				import GameDeveloperComposedContract from 0x01cf0e2f2f715450
				
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
				
		`;
	}

	static game_assets_mint_asset() {
		return fcl.transaction`
				import NonFungibleToken from 0x01cf0e2f2f715450
				import RegistryGamesAssetsContract from 0x01cf0e2f2f715450
				
				
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
		`;
	}

}
