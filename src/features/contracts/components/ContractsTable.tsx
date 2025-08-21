/**
 * Contracts table with sorting and filtering
 */

'use client';

import { useState } from 'react';
import { Contract, ContractStatus } from '@/entities/types';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/shared/ui/Table';
import { Button } from '@/shared/ui/Button';
import { formatDate, cn } from '@/shared/lib/utils';

interface ContractsTableProps {
  contracts: Contract[];
  onEditContract?: (contract: Contract) => void;
  onDeleteContract?: (contract: Contract) => void;
  userRole?: string;
}

const statusLabels: Record<ContractStatus, string> = {
  active: 'Ativo',
  suspended: 'Suspenso',
  canceled: 'Cancelado',
};

const statusColors: Record<ContractStatus, string> = {
  active: 'bg-success-100 text-success-800',
  suspended: 'bg-warning-100 text-warning-800',
  canceled: 'bg-danger-100 text-danger-800',
};

export function ContractsTable({ 
  contracts, 
  onEditContract, 
  onDeleteContract,
  userRole 
}: ContractsTableProps) {
  const [sortField, setSortField] = useState<keyof Contract>('contract_number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Contract) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedContracts = [...contracts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const canManageContracts = userRole === 'ADMIN';

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              sortable 
              sorted={sortField === 'contract_number' ? sortDirection : null}
              onSort={() => handleSort('contract_number')}
            >
              Número do Contrato
            </TableHead>
            <TableHead 
              sortable 
              sorted={sortField === 'status' ? sortDirection : null}
              onSort={() => handleSort('status')}
            >
              Status
            </TableHead>
            <TableHead>
              Responsável
            </TableHead>
            <TableHead>
              Unidade
            </TableHead>
            <TableHead 
              sortable 
              sorted={sortField === 'start_date' ? sortDirection : null}
              onSort={() => handleSort('start_date')}
            >
              Data de Início
            </TableHead>
            {canManageContracts && (
              <TableHead>
                Ações
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedContracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>
                <span className="font-medium text-gray-900">
                  {contract.contract_number}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  statusColors[contract.status]
                )}>
                  {statusLabels[contract.status]}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-gray-900">
                  {contract.holder_name || 'N/A'}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-gray-900">
                  {contract.unit_name || 'N/A'}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-gray-500">
                  {formatDate(contract.start_date)}
                </span>
              </TableCell>
              {canManageContracts && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEditContract?.(contract)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => onDeleteContract?.(contract)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {contracts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum contrato encontrado</p>
          <p className="text-gray-400 text-sm mt-2">
            {canManageContracts ? 'Clique em "Novo Contrato" para começar' : 'Aguarde novos contratos serem criados'}
          </p>
        </div>
      )}
    </div>
  );
}