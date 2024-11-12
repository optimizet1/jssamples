import * as fs from 'fs';
import * as path from 'path';

type AppSettings = {
  endpointUrl: string;
  scope: string;
  authority: string;
  clientId: string;
  managedIdentityObjectId: string;
};

function loadAppSettings(env: 'PROD' | 'PPE' | 'DEV'): AppSettings {
  const configPath = path.resolve(__dirname, `../config/appsettings.${env}.json`);
  const configContent = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(configContent);
}

const appSettings = loadAppSettings(process.env.NODE_ENV as 'PROD' | 'PPE' | 'DEV');
export default appSettings;
