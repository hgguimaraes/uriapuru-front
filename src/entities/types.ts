/**
 * Domain entities and DTOs
 */

// Base types
export type UUID = string;
export type Timestamp = string; // ISO string

// User roles
export type UserRole = 'ENGINEER' | 'ADMIN' | 'USER';

// Contract status
export type ContractStatus = 'active' | 'suspended' | 'canceled';

// Invoice status
export type InvoiceStatus = 'open' | 'paid' | 'overdue';

// Payment methods
export type PaymentMethod = 'stripe' | 'bank_transfer' | 'pix' | 'cash';

// Base entity
export interface BaseEntity {
  id: UUID;
  tenant_id: UUID;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Contract entity
export interface Contract extends BaseEntity {
  contract_number: string;
  status: ContractStatus;
  unit_id: UUID;
  holder_user_id: UUID;
  holder_name?: string;
  unit_name?: string;
  start_date: Timestamp;
  end_date?: Timestamp;
}

// Invoice entity
export interface Invoice extends BaseEntity {
  contract_id: UUID;
  contract?: Contract;
  year: number;
  month: number;
  kwh: number;
  amount: number;
  status: InvoiceStatus;
  due_date: Timestamp;
  paid_at?: Timestamp;
  payment_method?: PaymentMethod;
  payment_ref?: string;
  closed_at?: Timestamp;
}

// Order entity
export interface Order extends BaseEntity {
  contract_id: UUID;
  contract?: Contract;
  order_number: string;
  description: string;
  amount: number;
  status: string;
  created_by: UUID;
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
  request_id: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  request_id: string;
}

// DTOs for API requests
export interface CreateContractDto {
  contract_number: string;
  status: ContractStatus;
  unit_id: UUID;
  holder_user_id: UUID;
  start_date: string;
  end_date?: string;
}

export interface UpdateContractDto extends Partial<CreateContractDto> {}

export interface CreateInvoiceDto {
  contract_id: UUID;
  year: number;
  month: number;
  kwh: number;
  amount: number;
  due_date: string;
}

export interface UpdateInvoiceDto extends Partial<CreateInvoiceDto> {}

export interface PayInvoiceDto {
  method: PaymentMethod;
  ref: string;
  paid_at: string;
}

export interface CreateOrderDto {
  contract_id: UUID;
  order_number: string;
  description: string;
  amount: number;
  status: string;
}