/**
 * Invoices table with actions and filtering
 */

'use client';

import { useState } from 'react';
import { Invoice, InvoiceStatus } from '@/entities/types';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/shared/ui/Table';
import { Button } from '@/shared/ui/Button';
import { formatDate, formatCurrency, formatInvoicePeriod, cn } from '@/shared/lib/utils';

interface InvoicesTableProps {
  invoices: Invoice[];
  onPayInvoice?: (invoice: Invoice) => void;
  onReconcileInvoice?: (invoice: Invoice) => void;
  onEditInvoice?: (invoice: Invoice) => void;
  userRole?: string;
  loading?: boolean;
}

const statusLabels: Record<InvoiceStatus, string> = {
  open: 'Em Aberto',
  paid: 'Paga',
  overdue: 'Vencida',
};

const statusColors: Record<InvoiceStatus, string> = {
  open: 'bg-info-100 text-info-800',
  paid: 'bg-success-100 text-success-800',
  overdue: 'bg-danger-100 text-danger-800',
};

export function InvoicesTable({ 
  invoices, 
  onPayInvoice, 
  onReconcileInvoice,
  onEditInvoice,
  userRole,
  loading 
}: InvoicesTableProps) {
  const [sortField, setSortField] = useState<keyof Invoice>('due_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Invoice) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle date sorting
    if (typeof aValue === 'string' && typeof bValue === 'string' && 
        (aValue.includes('-') || aValue.includes('T'))) {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const canManageInvoices = userRole === 'ADMIN';

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              sortable 
              sorted={sortField === 'year' ? sortDirection : null}
              onSort={() => handleSort('year')}
            >
              Período
            </TableHead>
            <TableHead>
              Contrato
            </TableHead>
            <TableHead 
              sortable 
              sorted={sortField === 'kwh' ? sortDirection : null}
              onSort={() => handleSort('kwh')}
            >
              kWh
            </TableHead>
            <TableHead 
              sortable 
              sorted={sortField === 'amount' ? sortDirection : null}
              onSort={() => handleSort('amount')}
            >
              Valor
            </TableHead>
            <TableHead 
              sortable 
              sorted={sortField === 'status' ? sortDirection : null}
              onSort={() => handleSort('status')}
            >
              Status
            </TableHead>
            <TableHead 
              sortable 
              sorted={sortField === 'due_date' ? sortDirection : null}
              onSort={() => handleSort('due_date')}
            >
              Vencimento
            </TableHead>
            {canManageInvoices && (
              <TableHead>
                Ações
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <span className="font-medium text-gray-900">
                  {formatInvoicePeriod(invoice.year, invoice.month)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-gray-900">
                  {invoice.contract?.contract_number || 'N/A'}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-gray-900">
                  {invoice.kwh.toLocaleString('pt-BR')}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-medium text-gray-900">
                  {formatCurrency(invoice.amount)}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  statusColors[invoice.status]
                )}>
                  {statusLabels[invoice.status]}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn(
                  'text-sm',
                  invoice.status === 'overdue' && new Date(invoice.due_date) < new Date()
                    ? 'text-danger-600 font-medium'
                    : 'text-gray-500'
                )}>
                  {formatDate(invoice.due_date)}
                </span>
                {invoice.paid_at && (
                  <div className="text-xs text-success-600 mt-1">
                    Pago em {formatDate(invoice.paid_at)}
                  </div>
                )}
              </TableCell>
              {canManageInvoices && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    {invoice.status === 'open' && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => onPayInvoice?.(invoice)}
                      >
                        Pagar
                      </Button>
                    )}
                    {invoice.status === 'paid' && (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => onReconcileInvoice?.(invoice)}
                      >
                        Conciliar
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEditInvoice?.(invoice)}
                    >
                      Editar
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {invoices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma fatura encontrada</p>
          <p className="text-gray-400 text-sm mt-2">
            {canManageInvoices ? 'Clique em "Gerar Faturas" para começar' : 'Aguarde as faturas serem geradas'}
          </p>
        </div>
      )}
    </div>
  );
}