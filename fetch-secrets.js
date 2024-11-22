//import { DefaultAzureCredential } from "@azure/identity";
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
//import { SecretClient } from "@azure/keyvault-secrets";

async function fetchSecrets() {
  const credential = new DefaultAzureCredential();
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
