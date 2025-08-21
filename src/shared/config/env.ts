/**
 * Environment configuration with validation
 */

interface Environment {
  API_URL: string;
  TENANT_ID: string;
  NODE_ENV: 'development' | 'production' | 'test';
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env: Environment = {
  API_URL: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3001'),
  TENANT_ID: getEnvVar('NEXT_PUBLIC_TENANT_ID', 'public'),
  NODE_ENV: (process.env.NODE_ENV as Environment['NODE_ENV']) || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

// Validate critical environment variables
if (!env.API_URL) {
  console.warn('NEXT_PUBLIC_API_URL not set, using default:', env.API_URL);
}

if (!env.TENANT_ID) {
  console.warn('NEXT_PUBLIC_TENANT_ID not set, using default:', env.TENANT_ID);
}