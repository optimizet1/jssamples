import { createSign } from "crypto";
import { ClientSecretCredential } from "@azure/identity";
import axios from "axios";
import { config } from "./config";

// Helper to generate a signed JWT token using Base64 cert
export async function generateTokenWithCertificate(certBase64: string, audience: string): Promise<string> {
    const key = Buffer.from(certBase64, "base64");

    const header = {
        alg: "RS256",
        typ: "JWT",
        x5t: "your_certificate_thumbprint", // Optional, include if needed
    };

    const payload = {
        aud: audience,
        iss: config.clientId,
        sub: config.clientId,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1-hour expiration
        nbf: Math.floor(Date.now() / 1000),
    };

    // Generate a signature using the certificate
    const sign = createSign("RSA-SHA256");
    sign.update(JSON.stringify(header) + "." + JSON.stringify(payload));
    const signature = sign.sign(key, "base64");

    return `${Buffer.from(JSON.stringify(header)).toString("base64")}.${Buffer.from(JSON.stringify(payload)).toString("base64")}.${signature}`;
}

// Helper to fetch a token using Azure Entra and Client Secret
export async function fetchToken(audience: string): Promise<string> {
    const credential = new ClientSecretCredential(config.tenantId, config.clientId, config.clientSecret);
    const token = await credential.getToken(audience);
    return token.token;
}
