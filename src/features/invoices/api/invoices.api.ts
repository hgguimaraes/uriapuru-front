/**
 * Invoices API functions
 */

import { httpGet, httpPost, httpPatch } from '@/shared/lib/http';
import { 
  Invoice, 
  CreateInvoiceDto, 
  UpdateInvoiceDto,
  PayInvoiceDto,
  PaginatedResponse,
  ApiResponse 
} from '@/entities/types';

export interface InvoicesFilters {
  contract_id?: string;
  status?: string;
  year?: number;
  month?: number;
  page?: number;
  limit?: number;
}

/**
 * Get all invoices with filters
 */
export async function getInvoices(filters?: InvoicesFilters): Promise<PaginatedResponse<Invoice>> {
  return httpGet('/v2/invoices', filters);
}

/**
 * Get invoice by ID
 */
export async function getInvoice(id: string): Promise<ApiResponse<Invoice>> {
  return httpGet(`/v2/invoices/${id}`);
}

/**
 * Create new invoice (ADMIN only)
 */
export async function createInvoice(data: CreateInvoiceDto): Promise<ApiResponse<Invoice>> {
  return httpPost('/v2/invoices', data);
}

/**
 * Update invoice (ADMIN only)
 */
export async function updateInvoice(id: string, data: UpdateInvoiceDto): Promise<ApiResponse<Invoice>> {
  return httpPatch(`/v2/invoices/${id}`, data);
}

/**
 * Mark invoice as paid (ADMIN only)
 */
export async function payInvoice(id: string, data: PayInvoiceDto): Promise<ApiResponse<Invoice>> {
  return httpPost(`/v2/invoices/${id}/pay`, data);
}

/**
 * Reconcile invoice (ADMIN only)
 */
export async function reconcileInvoice(id: string): Promise<ApiResponse<Invoice>> {
  return httpPost(`/v2/invoices/${id}/reconcile`);
}