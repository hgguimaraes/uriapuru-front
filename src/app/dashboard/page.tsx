/**
 * Dashboard with metrics and charts
 */

'use client';

import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Users,
  Zap,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useContracts } from '@/shared/hooks/useContracts';
import { formatCurrency } from '@/shared/lib/utils';

// Mock data - in real app, this would come from API
const monthlyRevenue = [
  { month: 'Jan', value: 45000, invoices: 25 },
  { month: 'Fev', value: 52000, invoices: 28 },
  { month: 'Mar', value: 48000, invoices: 26 },
  { month: 'Abr', value: 61000, invoices: 32 },
  { month: 'Mai', value: 55000, invoices: 30 },
  { month: 'Jun', value: 67000, invoices: 35 },
];

const contractsStatus = [
  { name: 'Ativos', value: 156, color: '#10B981' },
  { name: 'Suspensos', value: 12, color: '#F59E0B' },
  { name: 'Cancelados', value: 8, color: '#EF4444' },
];

const energyGeneration = [
  { month: 'Jan', kwh: 125000 },
  { month: 'Fev', kwh: 135000 },
  { month: 'Mar', kwh: 142000 },
  { month: 'Abr', kwh: 158000 },
  { month: 'Mai', kwh: 165000 },
  { month: 'Jun', kwh: 172000 },
];

export default function DashboardPage() {
  const { data: contractsData, isLoading: contractsLoading } = useContracts();
  const [selectedPeriod, setSelectedPeriod] = useState('6m');

  const stats = [
    {
      title: 'Receita Total',
      value: formatCurrency(328000),
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      description: 'Últimos 6 meses'
    },
    {
      title: 'Contratos Ativos',
      value: contractsData?.contracts.filter(c => c.status === 'active').length || '156',
      change: '+3.2%',
      changeType: 'increase',
      icon: FileText,
      description: 'Total de contratos'
    },
    {
      title: 'Energia Gerada',
      value: '897 MWh',
      change: '+8.7%',
      changeType: 'increase',
      icon: Zap,
      description: 'Este mês'
    },
    {
      title: 'Faturas Pendentes',
      value: '23',
      change: '-15.3%',
      changeType: 'decrease',
      icon: AlertTriangle,
      description: 'Em aberto'
    },
  ];

  if (contractsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Visão geral do sistema de energia solar
          </p>
          
          {/* Period Selector */}
          <div className="mt-4 flex gap-2">
            {['1m', '3m', '6m', '1y'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {period === '1m' && '1 Mês'}
                {period === '3m' && '3 Meses'}
                {period === '6m' && '6 Meses'}
                {period === '1y' && '1 Ano'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-danger-500 mr-1" />
                  )}
                  <span className={
                    stat.changeType === 'increase' 
                      ? 'text-success-600' 
                      : 'text-danger-600'
                  }>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 ml-2">{stat.description}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Receita Mensal
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Receita']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4669fa" 
                  fill="#4669fa"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Contracts Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Status dos Contratos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contractsStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {contractsStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Energy Generation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Geração de Energia (kWh)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={energyGeneration}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} kWh`, 'Geração']}
              />
              <Line 
                type="monotone" 
                dataKey="kwh" 
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Atividades Recentes
          </h3>
          <div className="space-y-4">
            {[
              {
                action: 'Novo contrato criado',
                description: 'CON-2024-045 - João Silva',
                time: '2 horas atrás',
                type: 'success'
              },
              {
                action: 'Fatura paga',
                description: 'R$ 2.500,00 - Contrato CON-2024-032',
                time: '4 horas atrás',
                type: 'info'
              },
              {
                action: 'Contrato suspenso',
                description: 'CON-2024-018 - Pagamento em atraso',
                time: '1 dia atrás',
                type: 'warning'
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-success-500' :
                  activity.type === 'info' ? 'bg-info-500' :
                  'bg-warning-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.description}
                  </p>
                </div>
                <span className="text-sm text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}