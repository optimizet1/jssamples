import { DefaultAzureCredential, ManagedIdentityCredential } from '@azure/identity';

async function getAccessToken(scope: string, managedIdentityObjectId?: string): Promise<string> {
  const credential = managedIdentityObjectId 
    ? new ManagedIdentityCredential(managedIdentityObjectId)
    : new DefaultAzureCredential();

  const tokenResponse = await credential.getToken(scope);
  if (!tokenResponse) throw new Error('Failed to obtain access token.');
  return tokenResponse.token;
}

export { getAccessToken };
