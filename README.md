# Uirapuru - Sistema de Monitoramento de Usinas Fotovoltaicas ☀️

![Uirapuru Logo](./public/assets/images/uirapuru-logo.png)

Sistema moderno SaaS multi-tenant desenvolvido com **Next.js** e **TailwindCSS** para visualização, gestão e monitoramento de dados de usinas solares fotovoltaicas.

## 🚀 Stack Tecnológica

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de CSS utilitário
- **React Query** - Cache e sincronização de estado
- **React Hook Form + Zod** - Formulários e validação
- **Recharts** - Gráficos e visualizações
- **Jest + RTL** - Testes unitários e integração

### Backend Integration
- **API RESTful** - Integração com Uirapuru API
- **JWT Authentication** - Autenticação segura
- **RBAC** - Controle de acesso baseado em roles
- **Multi-tenancy** - Suporte a múltiplos inquilinos

## 🏗️ Arquitetura

O sistema segue uma arquitetura orientada a features com Clean Architecture:

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/          # Dashboard com métricas
│   ├── contracts/          # Gestão de contratos
│   └── layout.tsx          # Layout raiz
├── features/               # Módulos por domínio
│   ├── contracts/          # Gestão de contratos
│   │   ├── api/           # Cliente API
│   │   └── components/     # Componentes específicos
│   └── invoices/           # Gestão de faturas
├── shared/                 # Código compartilhado
│   ├── ui/                # Componentes base
│   ├── lib/               # Utilitários
│   ├── auth/              # Autenticação
│   ├── hooks/             # Hooks customizados
│   └── providers/         # Context providers
├── entities/               # Types e DTOs
└── test/                  # Setup e mocks de teste
```

## ⚡ Quick Start

### Pré-requisitos

- Node.js 18+ 
- npm/yarn/pnpm
- Backend Uirapuru API rodando

### Instalação

```bash
# Clone o repositório
git clone https://github.com/techamazon/uirapuru-frontend.git
cd uirapuru-frontend

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env.local
# Edite o .env.local com suas configurações

# Execute em desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

### Configuração do Ambiente

Crie um arquivo `.env.local` baseado no `.env.example`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_TENANT_ID=your-tenant-id

# Environment
NODE_ENV=development

# Features (optional)
NEXT_PUBLIC_ENABLE_DEBUG=true
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build           # Build para produção
npm run start           # Inicia servidor de produção
npm run lint            # Executa ESLint
npm run type-check      # Verifica tipos TypeScript

# Testes
npm run test            # Executa testes unitários
npm run test:watch      # Executa testes em modo watch
npm run test:coverage   # Executa testes com coverage
npm run test:ci         # Executa testes para CI

# Qualidade de código
npm run format          # Formata código com Prettier
npm run analyze         # Analisa bundle size
```

## 🌐 Multi-tenancy

O sistema suporta múltiplos inquilinos através do header `X-Tenant-Id`:

```typescript
// Configuração automática no HTTP client
const response = await http('/v2/contracts', {
  // X-Tenant-Id é injetado automaticamente
  // X-Request-Id é gerado automaticamente
});
```

## 🔐 Autenticação e Autorização

### JWT Authentication

```typescript
// Login
const { login } = useAuth();
await login('user@example.com', 'password');

// Verificar permissões
const { hasPermission } = useAuth();
const canWrite = hasPermission('contracts', 'write');
```

### RBAC (Role-Based Access Control)

| Recurso   | Read | Write |
|-----------|------|-------|
| orders    | ALL  | ENGINEER, ADMIN |
| contracts | ALL  | ADMIN |
| invoices  | ALL  | ADMIN |
| billing   | ALL  | ENGINEER, ADMIN |

## 📊 Features Implementadas

### Dashboard
- **Métricas em tempo real**: Receita, contratos ativos, energia gerada
- **Gráficos interativos**: Receita mensal, status de contratos, geração de energia
- **Filtros de período**: 1 mês, 3 meses, 6 meses, 1 ano
- **Timeline de atividades**: Ações recentes do sistema

### Gestão de Contratos
- **Listagem paginada** com filtros e ordenação
- **CRUD completo** (somente ADMIN para write)
- **Estados visuais**: Ativo, Suspenso, Cancelado
- **Formulário de criação** com validação Zod

### Gestão de Faturas
- **Listagem por período** e contrato
- **Ações administrativas**: Pagar, conciliar, fechar
- **Estados visuais**: Em aberto, paga, vencida
- **Formatação de moeda** e datas brasileiras

### Sistema de Notificações
- **Toast notifications** com tipos (success, error, warning, info)
- **Request ID tracking** para debugging
- **Auto-dismiss** configurável

## 🎨 UI/UX Design System

### Componentes Base
- **Button** - Variantes (primary, secondary, danger, ghost)
- **Table** - Acessível com sorting e navegação por teclado
- **Modal** - Focus management e escape para fechar
- **Form** - Integração com React Hook Form + Zod
- **Toast** - Sistema de notificações

### Acessibilidade (A11y)
- ✅ **WCAG 2.1 AA** compliant
- ✅ **Navegação por teclado** completa
- ✅ **ARIA labels** e roles apropriados
- ✅ **Contraste de cores** adequado
- ✅ **Screen reader** friendly

### Responsividade
- ✅ **Mobile-first** design
- ✅ **Breakpoints** Tailwind padrão
- ✅ **Grid layouts** adaptativos

## 🧪 Testes

### Estratégia de Testes
- **Unit Tests**: Componentes e hooks (Jest + RTL)
- **Integration Tests**: Fluxos completos com MSW
- **API Mocking**: MSW para simulação de endpoints

### Executar Testes

```bash
# Testes unitários
npm run test

# Com coverage
npm run test:coverage

# Modo watch para desenvolvimento
npm run test:watch

# Para CI/CD
npm run test:ci
```

### Coverage Goals
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+
- **Statements**: 70%+

## 🚀 Deploy

### Build para Produção

```bash
# Build estático
npm run build

# Verificar build
npm run start
```

### Variáveis de Ambiente para Produção

```env
# Production Environment
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.uirapuru.com
NEXT_PUBLIC_TENANT_ID=production-tenant

# Optional Features
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### Docker (Opcional)

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance

### Otimizações Implementadas
- **Code splitting** automático do Next.js
- **Image optimization** com next/image
- **Font optimization** com next/font
- **Bundle analysis** com @next/bundle-analyzer

### Métricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## 🔧 Configuração Avançada

### Customização do Tema

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F6F8FF',
          500: '#4669fa',
          900: '#151F49',
        }
      }
    }
  }
}
```

### HTTP Client Customizado

```typescript
// src/shared/lib/http.ts
export async function http(path: string, opts: HttpOptions = {}) {
  // Injeção automática de headers
  // Tratamento de erros
  // Request ID tracking
}
```

## 📚 Documentação da API

### Endpoints Principais

```typescript
// Contratos
GET    /v2/contracts          # Listar contratos
GET    /v2/contracts/:id      # Obter contrato
POST   /v2/contracts          # Criar contrato (ADMIN)
PATCH  /v2/contracts/:id      # Atualizar contrato (ADMIN)
DELETE /v2/contracts/:id      # Deletar contrato (ADMIN)

// Faturas
GET    /v2/invoices           # Listar faturas
POST   /v2/invoices/:id/pay   # Pagar fatura (ADMIN)
POST   /v2/invoices/:id/reconcile # Conciliar fatura (ADMIN)
```

### Headers Obrigatórios
```typescript
Authorization: Bearer <JWT_TOKEN>
X-Tenant-Id: <TENANT_ID>
X-Request-Id: <UUID>
Content-Type: application/json
```

## 🛠️ Troubleshooting

### Problemas Comuns

**Erro de autenticação**
```bash
# Verifique se a API está rodando
curl http://localhost:3001/health

# Verifique as variáveis de ambiente
echo $NEXT_PUBLIC_API_URL
```

**Problemas de build**
```bash
# Limpe o cache do Next.js
rm -rf .next

# Reinstale dependências
rm -rf node_modules package-lock.json
npm install
```

**Testes falhando**
```bash
# Execute testes isoladamente
npm run test -- --testPathPattern=Button

# Limpe cache do Jest
npx jest --clearCache
```

## 🤝 Contribuição

### Workflow de Desenvolvimento
1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Faça commit: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Padrões de Commit
Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Documentação
style:    Formatação
refactor: Refatoração
test:     Testes
chore:    Manutenção
```

### Code Review Checklist
- [ ] Testes unitários passando
- [ ] Cobertura de testes mantida
- [ ] ESLint sem erros
- [ ] TypeScript sem erros
- [ ] Acessibilidade verificada
- [ ] Documentação atualizada

## 📞 Suporte

### Canais de Comunicação
- **Issues**: Para bugs e melhorias
- **Discussions**: Para perguntas gerais
- **Email**: comercial@techamazon.tech

### Logs e Debug
Para debugging, verifique:
1. Browser DevTools Console
2. Network tab para requisições API
3. Request ID nos headers para rastreamento

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Equipe

**Techamazon - Soluções em Energia Inteligente**
- Website: [techamazon.tech](https://techamazon.tech)
- Email: comercial@techamazon.tech
- LinkedIn: [Techamazon](https://linkedin.com/company/techamazon)

---

**Feito com ❤️ e ☀️ pela equipe Techamazon**