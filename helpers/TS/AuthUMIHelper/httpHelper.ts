import axios, { AxiosRequestConfig, Method } from 'axios';
import { getAccessToken } from './authHelper';
import appSettings from './configService';

interface RequestOptions {
  method: Method;
  url: string;
  data?: any;
  headers?: Record<string, string>;
  scope: string;
}

async function makeAuthenticatedRequest({ method, url, data, headers, scope }: RequestOptions) {
  const token = await getAccessToken(scope, appSettings.managedIdentityObjectId);

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error calling endpoint ${url}:`, error);
    throw error;
  }
}

export { makeAuthenticatedRequest };
