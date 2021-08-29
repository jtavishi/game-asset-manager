import RegistryGamesAssetsContract from Project.RegistryGamesAssetsContract
import RegistryService from Project.RegistryService

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
