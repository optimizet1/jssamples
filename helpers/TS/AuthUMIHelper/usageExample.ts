import { getExampleData, updateExampleData } from './endpointHelpers';

async function main() {
  const data = await getExampleData();
  console.log('GET response:', data);

  const updateResponse = await updateExampleData({ key: 'value' });
  console.log('PUT response:', updateResponse);
}

main().catch(console.error);
