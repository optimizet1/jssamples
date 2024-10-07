import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { CertificateClient } from "@azure/keyvault-certificates";
import { config } from "./config";

// Instantiate SecretClient and CertificateClient using the configuration from config.ts
const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(config.keyVaultUrl, credential);
const certificateClient = new CertificateClient(config.keyVaultUrl, credential);

// Function to retrieve a secret value
export async function getSecretValue(secretName: string): Promise<string> {
    try {
        const secret = await secretClient.getSecret(secretName);
        return secret.value || ""; // Return the value, or empty string if not found
    } catch (err) {
        console.error(`Error retrieving secret ${secretName}:`, err);
        throw err;
    }
}

// Function to retrieve a certificate in Base64 format
export async function getCertificateBase64(certName: string): Promise<string> {
    try {
        const cert = await certificateClient.getCertificate(certName);
        const base64Cert = cert.cer?.toString("base64");
        if (!base64Cert) {
            throw new Error(`Certificate ${certName} not found or empty.`);
        }
        return base64Cert;
    } catch (err) {
        console.error(`Error retrieving certificate ${certName}:`, err);
        throw err;
    }
}
