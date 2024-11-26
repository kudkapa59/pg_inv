//import { DefaultAzureCredential } from "@azure/identity";
const {
  DefaultAzureCredential,
  ClientSecretCredential,
  ChainedTokenCredential,
  EnvironmentCredential
  // ,
  // ManagedIdentityCredential
} = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
//import 'dotenv/config'
//import { SecretClient } from "@azure/keyvault-secrets";


// function withSystemAssignedManagedIdentityCredential() {
//   const credential = new ManagedIdentityCredential('2babc7aa-8f50-4072-a8ed-f73857875e61');
//   const url = process.env.AZURE_KEY_VAULT_URL;
//   const client = new SecretClient(url, credential);
// }


async function fetchSecrets() {
    // const userAssignedClientId = process.env.AZURE_CLIENT_ID;
  
    // // Initialize DefaultAzureCredential with options if using a user-assigned managed identity
    // const credential = new DefaultAzureCredential({
    //   managedIdentityClientId: userAssignedClientId
    // });
  
  // When an access token is requested, the chain will try each
  // credential in order, stopping when one provides a token
  const firstCredential = new DefaultAzureCredential({
    managedIdentityClientId: '2babc7aa-8f50-4072-a8ed-f73857875e61',
  });
  const secondCredential = new EnvironmentCredential();
  const credentialChain = new ChainedTokenCredential(firstCredential, secondCredential);
  const url = 'https://kv-013448-gwc-dev-01ef17.vault.azure.net/';
  // const client = new KeyClient(url, credentialChain);
  // const credential = new ManagedIdentityCredential('2babc7aa-8f50-4072-a8ed-f73857875e61');
 
  const client = new SecretClient(url, credentialChain);

  // Get secret
  // const secret = await client.getSecret("client-id");
  // console.log(secret)

  // // List the secrets we have, by page
  console.log("Listing secrets by page");
  for await (const page of client.listPropertiesOfSecrets().byPage({ maxPageSize: 2 })) {
    for (const secretProperties of page) {
      if (secretProperties.enabled) {
        const secret = await client.getSecret(secretProperties.name);
        console.log("secret: ", secret);
      }
    }
    console.log("--page--");
  }

    // List the secrets we have, all at once
  // console.log("Listing secrets all at once");
  // for await (const secretProperties of client.listPropertiesOfSecrets()) {
  //   if (secretProperties.enabled) {
  //     const secret = await client.getSecret(secretProperties.name);
  //     console.log("secret: ", secret);
  //   }
  // }
  
}

fetchSecrets().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});

