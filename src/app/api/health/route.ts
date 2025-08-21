import { NextResponse } from 'next/server';

export async function GET() {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    api_url: process.env.NEXT_PUBLIC_API_URL,
    tenant_id: process.env.NEXT_PUBLIC_TENANT_ID,
  };

  try {
    // Test API connectivity
    if (process.env.NEXT_PUBLIC_API_URL) {
      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
        timeout: 5000,
      }).catch(() => null);

      healthCheck.api_status = apiResponse?.ok ? 'connected' : 'disconnected';
    }

    return NextResponse.json(healthCheck);
  } catch (error) {
    healthCheck.message = 'Service Unavailable';
    return NextResponse.json(healthCheck, { status: 503 });
  }
}