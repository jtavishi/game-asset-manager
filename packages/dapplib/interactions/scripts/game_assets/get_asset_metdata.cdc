import RegistryGamesAssetsContract from Project.RegistryGamesAssetsContract

pub fun main(acct: Address, gameId: String, assetId: UInt64): {String:String} {
  let gamesCollectionRef = getAccount(acct).getCapability(/public/GamesCollection)
            .borrow<&RegistryGamesAssetsContract.GamesCollection>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  return gamesCollectionRef.getAssetMetadata(gameId: gameId, assetId: assetId)
}