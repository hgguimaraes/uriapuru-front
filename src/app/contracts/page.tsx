/**
 * Contracts page with table and management
 */

'use client';

import { useState } from 'react';
import { ContractsTable } from '@/features/contracts/components/ContractsTable';
import { CreateContractModal } from '@/features/contracts/components/CreateContractModal';
import { Button } from '@/shared/ui/Button';
import { useContracts } from '@/shared/hooks/useContracts';
import { useAuth } from '@/shared/auth/AuthContext';
import { Contract } from '@/entities/types';

export default function ContractsPage() {
  const { user, hasPermission } = useAuth();
  const { data, isLoading } = useContracts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleEditContract = (contract: Contract) => {
    console.log('Edit contract:', contract.id);
    // TODO: Implement edit modal
  };

  const handleDeleteContract = (contract: Contract) => {
    console.log('Delete contract:', contract.id);
    // TODO: Implement delete confirmation
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando contratos...</p>
        </div>
      </div>
    );
  }

  const contracts = data?.contracts || [];
  const canManageContracts = hasPermission('contracts', 'write');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Contratos
              </h1>
              <p className="mt-2 text-gray-600">
                Gerencie todos os contratos de energia solar
              </p>
            </div>
            {canManageContracts && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Novo Contrato
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <svg className="h-6 w-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contracts.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <svg className="h-6 w-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Suspensos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contracts.filter(c => c.status === 'suspended').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-danger-100 rounded-lg">
                <svg className="h-6 w-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contracts.filter(c => c.status === 'canceled').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contracts Table */}
        <ContractsTable
          contracts={contracts}
          onEditContract={handleEditContract}
          onDeleteContract={handleDeleteContract}
          userRole={user?.role}
        />

        {/* Create Contract Modal */}
        <CreateContractModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </div>
  );
}