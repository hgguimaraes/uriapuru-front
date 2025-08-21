/**
 * Contracts API functions
 */

import { httpGet, httpPost, httpPatch, httpDelete } from '@/shared/lib/http';
import { 
  Contract, 
  CreateContractDto, 
  UpdateContractDto,
  PaginatedResponse,
  ApiResponse 
} from '@/entities/types';

export interface ContractsFilters {
  status?: string;
  holder_user_id?: string;
  unit_id?: string;
  page?: number;
  limit?: number;
}

/**
 * Get all contracts with filters
 */
export async function getContracts(filters?: ContractsFilters): Promise<PaginatedResponse<Contract>> {
  return httpGet('/v2/contracts', filters);
}

/**
 * Get contract by ID
 */
export async function getContract(id: string): Promise<ApiResponse<Contract>> {
  return httpGet(`/v2/contracts/${id}`);
}

/**
 * Create new contract (ADMIN only)
 */
export async function createContract(data: CreateContractDto): Promise<ApiResponse<Contract>> {
  return httpPost('/v2/contracts', data);
}

/**
 * Update contract (ADMIN only)
 */
export async function updateContract(id: string, data: UpdateContractDto): Promise<ApiResponse<Contract>> {
  return httpPatch(`/v2/contracts/${id}`, data);
}

/**
 * Delete contract (ADMIN only)
 */
export async function deleteContract(id: string): Promise<void> {
  return httpDelete(`/v2/contracts/${id}`);
}