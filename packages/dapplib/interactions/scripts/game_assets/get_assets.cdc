import RegistryGamesAssetsContract from Project.RegistryGamesAssetsContract

pub fun main(acct: Address): {String: [UInt64]} {
  let ref = getAccount(acct).getCapability(/public/GamesCollection)
            .borrow<&RegistryGamesAssetsContract.GamesCollection>()
            ?? panic("Could not borrow the public capability for the recipient's account")

  return ref.getOwnedGamesAssets()
}