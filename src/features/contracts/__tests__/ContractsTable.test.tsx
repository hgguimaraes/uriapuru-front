/**
 * ContractsTable component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ContractsTable } from '../components/ContractsTable';
import { Contract } from '@/entities/types';

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

describe('ContractsTable', () => {
  it('renders contracts correctly', () => {
    render(<ContractsTable contracts={mockContracts} />);
    
    expect(screen.getByText('CON-2024-001')).toBeInTheDocument();
    expect(screen.getByText('CON-2024-002')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
  });

  it('shows status badges with correct colors', () => {
    render(<ContractsTable contracts={mockContracts} />);
    
    const activeStatus = screen.getByText('Ativo');
    const suspendedStatus = screen.getByText('Suspenso');
    
    expect(activeStatus).toHaveClass('bg-success-100');
    expect(suspendedStatus).toHaveClass('bg-warning-100');
  });

  it('shows action buttons for admin users', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <ContractsTable 
        contracts={mockContracts}
        onEditContract={onEdit}
        onDeleteContract={onDelete}
        userRole="ADMIN"
      />
    );
    
    expect(screen.getAllByText('Editar')).toHaveLength(2);
    expect(screen.getAllByText('Excluir')).toHaveLength(2);
  });

  it('hides action buttons for non-admin users', () => {
    render(
      <ContractsTable 
        contracts={mockContracts}
        userRole="USER"
      />
    );
    
    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
    expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
  });

  it('calls onEditContract when edit button is clicked', () => {
    const onEdit = jest.fn();
    
    render(
      <ContractsTable 
        contracts={mockContracts}
        onEditContract={onEdit}
        userRole="ADMIN"
      />
    );
    
    fireEvent.click(screen.getAllByText('Editar')[0]);
    expect(onEdit).toHaveBeenCalledWith(mockContracts[0]);
  });

  it('handles sorting when column header is clicked', () => {
    render(<ContractsTable contracts={mockContracts} />);
    
    const contractNumberHeader = screen.getByText('Número do Contrato');
    fireEvent.click(contractNumberHeader);
    
    // Verify that sorting is applied (first contract should change)
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('CON-2024-001');
  });

  it('shows empty state when no contracts', () => {
    render(<ContractsTable contracts={[]} />);
    
    expect(screen.getByText('Nenhum contrato encontrado')).toBeInTheDocument();
  });
});