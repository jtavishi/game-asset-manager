import RegistryGamesAssetsContract from Project.RegistryGamesAssetsContract

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
