import RegistryGamesAssetsContract from Project.RegistryGamesAssetsContract

transaction(gameId: String) {

    let gamesCollectionRef: &RegistryGamesAssetsContract.GamesCollection?

  prepare(acct: AuthAccount) {
      self.gamesCollectionRef = acct.borrow<&RegistryGamesAssetsContract.GamesCollection>(from: /storage/GamesCollection)?? panic("Can not borrow games collection reference")
    }

  execute {
    self.gamesCollectionRef!.initGameCollection(gameId: gameId)
  }
}

