import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { CertificateClient } from "@azure/keyvault-certificates";
import { config } from "./config";
import { CacheHelpers } from './cacheHelpers';

// Cache usage configuration
const CACHE_ENABLED = true; // Set this to false to bypass the cache

// Instantiate SecretClient and CertificateClient using the configuration from config.ts
const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(config.keyVaultUrl, credential);
const certificateClient = new CertificateClient(config.keyVaultUrl, credential);

// Initialize CacheHelpers with a default cache duration of 1 minute (60000 ms)
const cacheHelpers = new CacheHelpers(60000);

/**
 * Retrieves a secret from Key Vault. If caching is enabled, the value is fetched from cache first.
 * @param secretName - Name of the secret to retrieve
 * @returns The value of the secret
 */
export async function getSecretValue(secretName: string): Promise<string> {
    // Check if caching is enabled
    if (CACHE_ENABLED) {
        const cachedValue = cacheHelpers.getStringValue(secretName);
        if (cachedValue) {
            return cachedValue; // Return the cached value if present
        }
    }

    // If caching is disabled or the value is not cached, retrieve from Key Vault
    try {
        const secret = await secretClient.getSecret(secretName);
        const secretValue = secret.value || "";

        // If caching is enabled, store the value in cache
        if (CACHE_ENABLED) {
            cacheHelpers.setStringValue(secretName, secretValue);
        }

        return secretValue;
    } catch (err) {
        console.error(`Error retrieving secret ${secretName}:`, err);
        throw err;
    }
}

/**
 * Retrieves a certificate in Base64 format from Key Vault. If caching is enabled, the value is fetched from cache first.
 * @param certName - Name of the certificate to retrieve
 * @returns The Base64-encoded certificate
 */
export async function getCertificateBase64(certName: string): Promise<string> {
    // Check if caching is enabled
    if (CACHE_ENABLED) {
        const cachedCert = cacheHelpers.getStringValue(certName);
        if (cachedCert) {
            return cachedCert; // Return the cached value if present
        }
    }

    // If caching is disabled or the value is not cached, retrieve from Key Vault
    try {
        const cert = await certificateClient.getCertificate(certName);
        const base64Cert = cert.cer?.toString("base64");

        if (!base64Cert) {
            throw new Error(`Certificate ${certName} not found or empty.`);
        }

        // If caching is enabled, store the value in cache
        if (CACHE_ENABLED) {
            cacheHelpers.setStringValue(certName, base64Cert);
        }

        return base64Cert;
    } catch (err) {
        console.error(`Error retrieving certificate ${certName}:`, err);
        throw err;
    }
}
