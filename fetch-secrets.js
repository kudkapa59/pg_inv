// //import { DefaultAzureCredential } from "@azure/identity";
// const {
//   ClientSecretCredential,
//   ChainedTokenCredential
// } = require("@azure/identity");
// const { SecretClient } = require("@azure/keyvault-secrets");
// import 'dotenv/config'
// //import { SecretClient } from "@azure/keyvault-secrets";

// async function fetchSecrets() {
//   const credential = new DefaultAzureCredential();
//   const url = process.env.AZURE_KEY_VAULT_URL;
//   console.log(`url = ${url}`)
//   console.log("Check")
//   const client = new SecretClient(url, credential);

//   try {
//     // console.log(`${}`)
//     for await (const secretProperties of client.listPropertiesOfSecrets()) {
//       // const secretName = secretProperties.name;
//       // const secret = await client.getSecret(secretName);
//       // console.log(`${secretName}=${secret.value}`);
//     }
//   } catch (error) {
//     console.error("Error fetching secrets:", error);
//     process.exit(1);
//   }
  
// }

// fetchSecrets();

import { ClientSecretCredential, ChainedTokenCredential } from "@azure/identity";
import { KeyClient } from "@azure/keyvault-keys";

// Configure variables
const vaultUrl = "https://<your-unique-keyvault-name>.vault.azure.net";
const tenantId = "<tenant-id>";
const clientId = "<client-id>";
const clientSecret = "<client-secret>";
const anotherClientId = "<another-client-id>";
const anotherSecret = "<another-client-secret>";
// When an access token is requested, the chain will try each
// credential in order, stopping when one provides a token
const firstCredential = new ClientSecretCredential(tenantId, clientId, clientSecret);
const secondCredential = new ClientSecretCredential(tenantId, anotherClientId, anotherSecret);
const credentialChain = new ChainedTokenCredential(firstCredential, secondCredential);
// The chain can be used anywhere a credential is required
const client = new KeyClient(vaultUrl, credentialChain);
