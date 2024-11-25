//import { DefaultAzureCredential } from "@azure/identity";
const {
  ClientSecretCredential,
  ChainedTokenCredential,
  EnvironmentCredential,
  ManagedIdentityCredential
} = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
//import 'dotenv/config'
//import { SecretClient } from "@azure/keyvault-secrets";


function withSystemAssignedManagedIdentityCredential() {
  const credential = new ManagedIdentityCredential();
  const url = process.env.AZURE_KEY_VAULT_URL;
  const client = new SecretClient(url, credential);
}


async function fetchSecrets() {
  // const credential = new DefaultAzureCredential();

  const credential = new ManagedIdentityCredential();
  const url = process.env.AZURE_KEY_VAULT_URL;
  const client = new SecretClient(url, credential);

  
  // const credential = new EnvironmentCredential();
  // const url = process.env.AZURE_KEY_VAULT_URL;
  // console.log(`url = ${url}`)
  // console.log("Check")
  // const client = new SecretClient(url, credential);
  // List the secrets we have, by page
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
  console.log("Listing secrets all at once");
  for await (const secretProperties of client.listPropertiesOfSecrets()) {
    if (secretProperties.enabled) {
      const secret = await client.getSecret(secretProperties.name);
      console.log("secret: ", secret);
    }
  }
  
}

fetchSecrets().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});

