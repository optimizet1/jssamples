import { CacheHelpers } from './cacheHelpers';

// Test logger function to display test results
function testLogger(testName: string, passed: boolean) {
    const status = passed ? 'PASSED' : 'FAILED';
    console.log(`${testName}: ${status}`);
}

// Test Cache Module Independently
function testCacheModule() {
    console.log('Testing Cache Module...');

    // Initialize CacheHelpers with a 1-second cache duration for testing
    const cacheHelpers = new CacheHelpers(1000);

    // Test setting and retrieving a string value before expiration
    cacheHelpers.setStringValue('username', 'john_doe');
    let cachedStringValue = cacheHelpers.getStringValue('username');
    testLogger('Cache Retrieve String Before Expiration', cachedStringValue === 'john_doe');

    // Test setting and retrieving an integer value before expiration
    cacheHelpers.setIntValue('age', 30);
    let cachedIntValue = cacheHelpers.getIntValue('age');
    testLogger('Cache Retrieve Int Before Expiration', cachedIntValue === 30);

    // Test retrieving non-existent string value (should return empty string)
    let nonExistentString = cacheHelpers.getStringValue('non_existent_key');
    testLogger('Cache Retrieve Non-Existent String', nonExistentString === '');

    // Test retrieving non-existent integer value (should return Number.MIN_SAFE_INTEGER)
    let nonExistentInt = cacheHelpers.getIntValue('non_existent_int');
    testLogger('Cache Retrieve Non-Existent Int', nonExistentInt === Number.MIN_SAFE_INTEGER);

    // Wait 1.5 seconds to test expired cache
    setTimeout(() => {
        // Test retrieving a string after expiration (should return empty string)
        cachedStringValue = cacheHelpers.getStringValue('username');
        testLogger('Cache Retrieve String After Expiration', cachedStringValue === '');

        // Test retrieving an int after expiration (should return Number.MIN_SAFE_INTEGER)
        cachedIntValue = cacheHelpers.getIntValue('age');
        testLogger('Cache Retrieve Int After Expiration', cachedIntValue === Number.MIN_SAFE_INTEGER);
    }, 1500);
}

// Mock Key Vault to Simulate External Calls
const mockKeyVault = {
    getSecret: (secretName: string) => {
        console.log(`Mock fetching secret: ${secretName}`);
        return secretName === 'my-secret'
            ? Promise.resolve({ value: 'mocked-secret-value' })
            : Promise.resolve({ value: '' });
    },
    getCertificate: (certName: string) => {
        console.log(`Mock fetching certificate: ${certName}`);
        return certName === 'my-cert'
            ? Promise.resolve({ cer: Buffer.from('mocked-cert-value') })
            : Promise.resolve({ cer: null });
    }
};

// Mocked Key Vault Helper Functions
async function mockGetSecretValue(secretName: string): Promise<string> {
    const result = await mockKeyVault.getSecret(secretName);
    return result.value || '';
}

async function mockGetCertificateBase64(certName: string): Promise<string> {
    const result = await mockKeyVault.getCertificate(certName);
    return result.cer?.toString('base64') || '';
}

// Test Key Vault Helper with Mocked Data
async function testKeyVaultHelper() {
    console.log('Testing Key Vault Helper with Mocked Key Vault...');

    // Test mock secret retrieval
    const secretValue = await mockGetSecretValue('my-secret');
    testLogger('Get Secret Value from Mocked Key Vault', secretValue === 'mocked-secret-value');

    // Test mock certificate retrieval
    const certValue = await mockGetCertificateBase64('my-cert');
    testLogger('Get Certificate Value from Mocked Key Vault', certValue === Buffer.from('mocked-cert-value').toString('base64'));
}

// Test Cache with Key Vault Helper Mock Integration
async function testCacheWithKeyVaultHelper() {
    console.log('Testing Cache with Key Vault Helper...');

    // Initialize CacheHelpers with a 1-second cache duration for testing
    const cacheHelpers = new CacheHelpers(1000);

    // First retrieval (mocked call to Key Vault)
    let secretValue = cacheHelpers.getStringValue('my-secret');
    if (!secretValue) {
        secretValue = await mockGetSecretValue('my-secret');
        cacheHelpers.setStringValue('my-secret', secretValue);
    }
    testLogger('First Key Vault Cache Secret Fetch', secretValue === 'mocked-secret-value');

    // Retrieve from cache before expiration
    secretValue = cacheHelpers.getStringValue('my-secret');
    testLogger('Retrieve Cached Secret Before Expiration', secretValue === 'mocked-secret-value');

    // Wait for 1.5 seconds to let the cache expire
    setTimeout(async () => {
        secretValue = cacheHelpers.getStringValue('my-secret');
        if (!secretValue) {
            secretValue = await mockGetSecretValue('my-secret');
            cacheHelpers.setStringValue('my-secret', secretValue);
        }
        testLogger('Retrieve New Secret After Cache Expiration', secretValue === 'mocked-secret-value');
    }, 1500);
}

// Run the tests
testCacheModule();
setTimeout(() => {
    testKeyVaultHelper();
    testCacheWithKeyVaultHelper();
}, 2000);
