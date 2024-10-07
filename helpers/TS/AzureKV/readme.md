// npm install @azure/keyvault-secrets @azure/identity @azure/keyvault-certificates


The configuration values like keyVaultUrl, tenantId, clientId, and clientSecret are now placed in the config.ts file, removing the need for environment variables.
The rest of the helpers remain the same, and you can import the constants directly from the config.ts file, which can be easily modified per environment by changing the constants in that file.