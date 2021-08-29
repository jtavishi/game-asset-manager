import RegistryGamesAssetsContract from Project.RegistryGamesAssetsContract

pub fun main(acct: Address): {String: String} {
  let tenant = getAccount(acct).getCapability(RegistryGamesAssetsContract.TenantPublicPath).borrow<&RegistryGamesAssetsContract.Tenant{RegistryGamesAssetsContract.ITenantMinter}>()
                        ?? panic("Could not borrow the Tenant")
  return tenant.getGames()
}