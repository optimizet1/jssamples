function concatenateUrl(
    baseUrl: string, 
    baseRoute: string = '',  // Default value is empty string
    extraRoute: string = ''  // Default value is empty string
): string {
    // Remove any trailing slash from baseUrl
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    // Clean baseRoute only if it's not null
    let cleanBaseRoute = baseRoute !== null 
        ? (baseRoute.startsWith('/') ? baseRoute.slice(1) : baseRoute) 
        : '';
    
    // Clean extraRoute only if it's not null
    let cleanExtraRoute = extraRoute !== null 
        ? (extraRoute.startsWith('/') ? extraRoute.slice(1) : extraRoute)
        : '';

    // If both baseRoute and extraRoute are provided, concatenate all three
    if (cleanBaseRoute && cleanExtraRoute) {
        return `${cleanBaseUrl}/${cleanBaseRoute}/${cleanExtraRoute}`;
    }

    // If only baseRoute is provided
    if (cleanBaseRoute) {
        return `${cleanBaseUrl}/${cleanBaseRoute}`;
    }

    // If only extraRoute is provided
    if (cleanExtraRoute) {
        return `${cleanBaseUrl}/${cleanExtraRoute}`;
    }

    // If neither baseRoute nor extraRoute are provided, just return the baseUrl
    return cleanBaseUrl;
}

// Example usage:
const baseUrl = 'https://example.com/';
const baseRoute = '';  // or null
const extraRoute = '/resource/';

const fullUrl1: string = concatenateUrl(baseUrl, baseRoute, extraRoute);
console.log(fullUrl1);  // Output: https://example.com/resource

const fullUrl2: string = concatenateUrl(baseUrl, undefined, '/resource/');
console.log(fullUrl2);  // Output: https://example.com/resource

const fullUrl3: string = concatenateUrl(baseUrl, null, '/resource/');
console.log(fullUrl3);  // Output: https://example.com/resource




interface UrlConfig {
    baseUrl: string;
    baseRoute?: string | null;
    extraRoute?: string | null;
}

function concatenateUrl2(config: UrlConfig): string {
    // Destructure config and provide default values for baseRoute and extraRoute
    const { baseUrl, baseRoute = '', extraRoute = '' } = config;

    // Remove any trailing slash from baseUrl
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    // Clean baseRoute only if it's not null
    let cleanBaseRoute = baseRoute !== null
        ? (baseRoute.startsWith('/') ? baseRoute.slice(1) : baseRoute)
        : '';

    // Clean extraRoute only if it's not null
    let cleanExtraRoute = extraRoute !== null
        ? (extraRoute.startsWith('/') ? extraRoute.slice(1) : extraRoute)
        : '';

    // If both baseRoute and extraRoute are provided, concatenate all three
    if (cleanBaseRoute && cleanExtraRoute) {
        return `${cleanBaseUrl}/${cleanBaseRoute}/${cleanExtraRoute}`;
    }

    // If only baseRoute is provided
    if (cleanBaseRoute) {
        return `${cleanBaseUrl}/${cleanBaseRoute}`;
    }

    // If only extraRoute is provided
    if (cleanExtraRoute) {
        return `${cleanBaseUrl}/${cleanExtraRoute}`;
    }

    // If neither baseRoute nor extraRoute are provided, just return the baseUrl
    return cleanBaseUrl;
}

// Example usage:
const config1: UrlConfig = {
    baseUrl: 'https://example.com/',
    baseRoute: '', // or undefined or null
    extraRoute: '/resource/'
};

const config2: UrlConfig = {
    baseUrl: 'https://example.com/',
    baseRoute: '/api/',
    extraRoute: '' // or undefined or null
};

const config3: UrlConfig = {
    baseUrl: 'https://example.com/',
    baseRoute: null, // Explicitly set to null
    extraRoute: null // Explicitly set to null
};

// Test cases
const fullUrl10: string = concatenateUrl2(config1);
console.log(fullUrl1);  // Output: https://example.com/resource

const fullUrl20: string = concatenateUrl2(config2);
console.log(fullUrl2);  // Output: https://example.com/api

const fullUrl30: string = concatenateUrl2(config3);
console.log(fullUrl3);  // Output: https://example.com
