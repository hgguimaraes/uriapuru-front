import Link from 'next/link'
import { Button } from '@/shared/ui/Button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="z-10 max-w-4xl w-full text-center">
        <h1 className="text-6xl font-bold text-primary-900 mb-4">
          Uirapuru ☀️
        </h1>
        <p className="text-xl text-primary-700 mb-6 font-medium">
          Sistema de Monitoramento de Usinas Fotovoltaicas
        </p>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Sistema moderno desenvolvido com Next.js e TailwindCSS para visualização, 
          gestão e monitoramento de dados de usinas solares fotovoltaicas. 
          Arquitetura multi-tenant com autenticação JWT e RBAC.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link href="/dashboard">
            <Button size="lg" className="min-w-[200px]">
              Acessar Dashboard
            </Button>
          </Link>
          <Link href="/contracts">
            <Button variant="secondary" size="lg" className="min-w-[200px]">
              Ver Contratos
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🏭 Multi-Tenant</h3>
            <p className="text-gray-600">
              Suporte completo a múltiplos inquilinos com isolamento de dados por tenant_id.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🔐 Segurança</h3>
            <p className="text-gray-600">
              Autenticação JWT com controle de acesso baseado em funções (RBAC).
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Observabilidade</h3>
            <p className="text-gray-600">
              Métricas Prometheus, tracing OpenTelemetry e dashboards Grafana.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}