/**
 * Modal for creating new contracts
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/shared/ui/Modal';
import { Form, FormField, Input, Select } from '@/shared/ui/Form';
import { Button } from '@/shared/ui/Button';
import { useCreateContract } from '@/shared/hooks/useContracts';
import { CreateContractDto } from '@/entities/types';

const contractSchema = z.object({
  contract_number: z.string().min(1, 'Número do contrato é obrigatório'),
  status: z.enum(['active', 'suspended', 'canceled']),
  unit_id: z.string().min(1, 'Unidade é obrigatória'),
  holder_user_id: z.string().min(1, 'Responsável é obrigatório'),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  end_date: z.string().optional(),
});

type ContractForm = z.infer<typeof contractSchema>;

interface CreateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'suspended', label: 'Suspenso' },
  { value: 'canceled', label: 'Cancelado' },
];

// Mock options - in real app, these would come from API
const unitOptions = [
  { value: 'unit-1', label: 'Unidade Solar 01' },
  { value: 'unit-2', label: 'Unidade Solar 02' },
  { value: 'unit-3', label: 'Unidade Solar 03' },
];

const userOptions = [
  { value: 'user-1', label: 'João Silva' },
  { value: 'user-2', label: 'Maria Santos' },
  { value: 'user-3', label: 'Pedro Oliveira' },
];

export function CreateContractModal({ isOpen, onClose }: CreateContractModalProps) {
  const createContract = useCreateContract();
  
  const form = useForm<ContractForm>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: ContractForm) => {
    try {
      await createContract.mutateAsync({
        contract_number: data.contract_number,
        status: data.status as CreateContractDto['status'],
        unit_id: data.unit_id,
        holder_user_id: data.holder_user_id,
        start_date: data.start_date,
        end_date: data.end_date || undefined,
      });
      
      form.reset();
      onClose();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Criar Novo Contrato"
      size="lg"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form>
          <FormField
            form={form}
            name="contract_number"
            label="Número do Contrato"
            required
          >
            <Input
              {...form.register('contract_number')}
              placeholder="Ex: CON-2024-001"
              error={!!form.formState.errors.contract_number}
            />
          </FormField>

          <FormField
            form={form}
            name="status"
            label="Status"
            required
          >
            <Select
              {...form.register('status')}
              options={statusOptions}
              error={!!form.formState.errors.status}
            />
          </FormField>

          <FormField
            form={form}
            name="unit_id"
            label="Unidade"
            required
          >
            <Select
              {...form.register('unit_id')}
              placeholder="Selecione uma unidade"
              options={unitOptions}
              error={!!form.formState.errors.unit_id}
            />
          </FormField>

          <FormField
            form={form}
            name="holder_user_id"
            label="Responsável"
            required
          >
            <Select
              {...form.register('holder_user_id')}
              placeholder="Selecione um responsável"
              options={userOptions}
              error={!!form.formState.errors.holder_user_id}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              form={form}
              name="start_date"
              label="Data de Início"
              required
            >
              <Input
                {...form.register('start_date')}
                type="date"
                error={!!form.formState.errors.start_date}
              />
            </FormField>

            <FormField
              form={form}
              name="end_date"
              label="Data de Fim"
              description="Opcional"
            >
              <Input
                {...form.register('end_date')}
                type="date"
                error={!!form.formState.errors.end_date}
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={createContract.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={createContract.isPending}
            >
              Criar Contrato
            </Button>
          </div>
        </Form>
      </form>
    </Modal>
  );
}