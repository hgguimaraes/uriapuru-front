/**
 * MSW handlers for API mocking
 */

import { http, HttpResponse } from 'msw';
import { Contract, Invoice } from '@/entities/types';

// Mock data
const mockContracts: Contract[] = [
  {
    id: 'contract-1',
    tenant_id: 'test-tenant',
    contract_number: 'CON-2024-001',
    status: 'active',
    unit_id: 'unit-1',
    holder_user_id: 'user-1',
    holder_name: 'João Silva',
    unit_name: 'Unidade Solar 01',
    start_date: '2024-01-15T00:00:00.000Z',
    created_at: '2024-01-15T00:00:00.000Z',
    updated_at: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'contract-2',
    tenant_id: 'test-tenant',
    contract_number: 'CON-2024-002',
    status: 'suspended',
    unit_id: 'unit-2',
    holder_user_id: 'user-2',
    holder_name: 'Maria Santos',
    unit_name: 'Unidade Solar 02',
    start_date: '2024-02-01T00:00:00.000Z',
    created_at: '2024-02-01T00:00:00.000Z',
    updated_at: '2024-02-01T00:00:00.000Z',
  },
];

const mockInvoices: Invoice[] = [
  {
    id: 'invoice-1',
    tenant_id: 'test-tenant',
    contract_id: 'contract-1',
    year: 2024,
    month: 8,
    kwh: 1500,
    amount: 2500.00,
    status: 'open',
    due_date: '2024-08-31T00:00:00.000Z',
    created_at: '2024-08-01T00:00:00.000Z',
    updated_at: '2024-08-01T00:00:00.000Z',
  },
];

export const handlers = [
  // Contracts endpoints
  http.get('http://localhost:3001/v2/contracts', () => {
    return HttpResponse.json({
      data: mockContracts,
      pagination: {
        page: 1,
        limit: 10,
        total: mockContracts.length,
        totalPages: 1,
      },
      request_id: 'test-request-id',
    });
  }),

  http.get('http://localhost:3001/v2/contracts/:id', ({ params }) => {
    const contract = mockContracts.find(c => c.id === params.id);
    if (!contract) {
      return new HttpResponse('Contract not found', { status: 404 });
    }
    
    return HttpResponse.json({
      data: contract,
      request_id: 'test-request-id',
    });
  }),

  http.post('http://localhost:3001/v2/contracts', async ({ request }) => {
    const body = await request.json() as any;
    const newContract: Contract = {
      id: 'new-contract-id',
      tenant_id: 'test-tenant',
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json({
      data: newContract,
      request_id: 'test-request-id',
    });
  }),

  // Invoices endpoints
  http.get('http://localhost:3001/v2/invoices', () => {
    return HttpResponse.json({
      data: mockInvoices,
      pagination: {
        page: 1,
        limit: 10,
        total: mockInvoices.length,
        totalPages: 1,
      },
      request_id: 'test-request-id',
    });
  }),

  // Auth endpoint
  http.post('http://localhost:3001/v2/auth/login', async ({ request }) => {
    const body = await request.json() as any;
    
    if (body.email === 'admin@test.com' && body.password === 'password') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: {
          id: 'user-1',
          email: 'admin@test.com',
          name: 'Admin User',
          role: 'ADMIN',
          tenantId: 'test-tenant',
        },
      });
    }

    return new HttpResponse('Invalid credentials', { status: 401 });
  }),
];