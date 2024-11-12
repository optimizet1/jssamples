import { makeAuthenticatedRequest } from './httpHelper';
import appSettings from './configService';

// Example for a GET endpoint
async function getExampleData() {
  return makeAuthenticatedRequest({
    method: 'GET',
    url: `${appSettings.endpointUrl}/example-get`,
    scope: appSettings.scope,
  });
}

// Example for a PUT endpoint
async function updateExampleData(data: any) {
  return makeAuthenticatedRequest({
    method: 'PUT',
    url: `${appSettings.endpointUrl}/example-put`,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    scope: appSettings.scope,
  });
}

export { getExampleData, updateExampleData };
