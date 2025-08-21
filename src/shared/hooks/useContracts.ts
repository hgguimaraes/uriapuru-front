/**
 * React Query hooks for contracts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getContracts, 
  getContract, 
  createContract, 
  updateContract, 
  deleteContract,
  ContractsFilters 
} from '@/features/contracts/api/contracts.api';
import { CreateContractDto, UpdateContractDto } from '@/entities/types';
import { useToast } from '@/shared/ui/Toast';
import { HttpError } from '@/shared/lib/http';

export function useContracts(filters?: ContractsFilters) {
  return useQuery({
    queryKey: ['contracts', filters],
    queryFn: () => getContracts(filters),
    select: (data) => ({
      contracts: data.data,
      pagination: data.pagination,
    }),
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: ['contracts', id],
    queryFn: () => getContract(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateContractDto) => createContract(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      addToast({
        type: 'success',
        title: 'Contrato criado',
        description: 'O contrato foi criado com sucesso.',
      });
    },
    onError: (error: HttpError) => {
      addToast({
        type: 'error',
        title: 'Erro ao criar contrato',
        description: error.message,
        requestId: error.requestId,
      });
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContractDto }) => 
      updateContract(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.id] });
      addToast({
        type: 'success',
        title: 'Contrato atualizado',
        description: 'O contrato foi atualizado com sucesso.',
      });
    },
    onError: (error: HttpError) => {
      addToast({
        type: 'error',
        title: 'Erro ao atualizar contrato',
        description: error.message,
        requestId: error.requestId,
      });
    },
  });
}

export function useDeleteContract() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteContract(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      addToast({
        type: 'success',
        title: 'Contrato excluído',
        description: 'O contrato foi excluído com sucesso.',
      });
    },
    onError: (error: HttpError) => {
      addToast({
        type: 'error',
        title: 'Erro ao excluir contrato',
        description: error.message,
        requestId: error.requestId,
      });
    },
  });
}