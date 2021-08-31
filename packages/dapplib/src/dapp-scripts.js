// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappScripts {

	static registry_has_auth_nft() {
		return fcl.script`
				import RegistryService from 0x01cf0e2f2f715450
				
				// Checks to see if an account has an AuthNFT
				
				pub fun main(tenant: Address): Bool {
				    let hasAuthNFT = getAccount(tenant).getCapability(RegistryService.AuthPublicPath)
				                        .borrow<&RegistryService.AuthNFT{RegistryService.IAuthNFT}>()
				
				    if hasAuthNFT == nil {
				        return false
				    } else {
				        return true
				    }
				}
		`;
	}

	static flowtoken_get_balance() {
		return fcl.script`
				import FungibleToken from 0xee82856bf20e2aa6
				import FlowToken from 0x0ae53cb6e3f42a79
				
				pub fun main(account: Address): UFix64 {
				
				    let vaultRef = getAccount(account)
				        .getCapability(/public/flowTokenBalance)
				        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
				        ?? panic("Could not borrow Balance reference to the Vault")
				
				    return vaultRef.balance
				}  
		`;
	}

	static game_assets_get_asset_metdata() {
		return fcl.script`
				import RegistryGamesAssetsContract from 0x01cf0e2f2f715450
				
				pub fun main(acct: Address, gameId: String, assetId: UInt64): {String:String} {
				  let gamesCollectionRef = getAccount(acct).getCapability(/public/GamesCollection)
				            .borrow<&RegistryGamesAssetsContract.GamesCollection>()
				            ?? panic("Could not borrow the public capability for the recipient's account")
				  return gamesCollectionRef.getAssetMetadata(gameId: gameId, assetId: assetId)
				}
		`;
	}

	static game_assets_get_assets() {
		return fcl.script`
				import RegistryGamesAssetsContract from 0x01cf0e2f2f715450
				
				pub fun main(acct: Address): {String: [UInt64]} {
				  let ref = getAccount(acct).getCapability(/public/GamesCollection)
				            .borrow<&RegistryGamesAssetsContract.GamesCollection>()
				            ?? panic("Could not borrow the public capability for the recipient's account")
				
				  return ref.getOwnedGamesAssets()
				}
		`;
	}

	static game_assets_get_games_list() {
		return fcl.script`
				import RegistryGamesAssetsContract from 0x01cf0e2f2f715450
				
				pub fun main(acct: Address): {String: String} {
				  let tenant = getAccount(acct).getCapability(RegistryGamesAssetsContract.TenantPublicPath).borrow<&RegistryGamesAssetsContract.Tenant{RegistryGamesAssetsContract.ITenantMinter}>()
				                        ?? panic("Could not borrow the Tenant")
				  return tenant.getGames()
				}
		`;
	}

}
