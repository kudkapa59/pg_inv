//import { DefaultAzureCredential } from "@azure/identity";
const {
  ClientSecretCredential,
  ChainedTokenCredential
} = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
//import 'dotenv/config'
//import { SecretClient } from "@azure/keyvault-secrets";

async function fetchSecrets() {
  // const credential = new DefaultAzureCredential();
  const credential = new EnvironmentCredential();
  const url = process.env.AZURE_KEY_VAULT_URL;
  console.log(`url = ${url}`)
  console.log("Check")
  const client = new SecretClient(url, credential);

  try {
    // console.log(`${}`)
    for await (const secretProperties of client.listPropertiesOfSecrets()) {
      // const secretName = secretProperties.name;
      // const secret = await client.getSecret(secretName);
      // console.log(`${secretName}=${secret.value}`);
    }
  } catch (error) {
    console.error("Error fetching secrets:", error);
    process.exit(1);
  }
  
}

fetchSecrets();
