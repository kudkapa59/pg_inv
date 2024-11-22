//const {React} = require("@react");
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

async function fetchSecrets() {
  const credential = new DefaultAzureCredential();
  //const vaultName = process.env.AZURE_KEYVAULT_NAME;
  const url = `https://kv-013448-gwc-dev-01ef17.vault.azure.net`;

  const client = new SecretClient(url, credential);

  try {
    for await (const secretProperties of client.listPropertiesOfSecrets()) {
      const secretName = secretProperties.name;
      const secret = await client.getSecret(secretName);
      console.log(`${secretName}=${secret.value}`);
    }
  } catch (error) {
    console.error("Error fetching secrets:", error);
    process.exit(1);
  }
}

fetchSecrets();
