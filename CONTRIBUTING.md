# Guia de Contribuição

Agradecemos seu interesse em contribuir para este projeto! Este documento fornece diretrizes e informações sobre como contribuir efetivamente.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)
- [Processo de Submissão](#processo-de-submissão)
- [Revisão de Código](#revisão-de-código)
- [Comunicação](#comunicação)

## 🤝 Código de Conduta

Este projeto segue o [Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você concorda em manter um ambiente respeitoso e inclusivo para todos.

## 💡 Como Posso Contribuir?

### 🐛 Reportando Bugs

Antes de reportar um bug, verifique se já existe uma issue similar. Se não existir, crie uma nova issue com:

- **Título descritivo**
- **Descrição detalhada** do problema
- **Passos para reproduzir**
- **Comportamento esperado vs atual**
- **Screenshots** (se aplicável)
- **Informações do ambiente** (OS, Node.js, navegador)

### 💡 Sugerindo Melhorias

Para sugerir melhorias:

1. Verifique se não há uma discussão similar
2. Crie uma issue com tag `enhancement`
3. Descreva claramente a melhoria proposta
4. Explique por que seria útil
5. Inclua mockups ou exemplos se possível

### 🔨 Contribuindo com Código

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature
4. **Desenvolva** seguindo nossos padrões
5. **Teste** suas mudanças
6. **Commit** com mensagens claras
7. **Push** para seu fork
8. **Abra** um Pull Request

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18.0.0 ou superior
- npm 8.0.0 ou superior
- Git

### Setup Local

```bash
# 1. Fork e clone o repositório
git clone https://github.com/SEU_USUARIO/projeto.git
cd projeto

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Execute os testes
npm run test
```

## 📝 Padrões de Desenvolvimento

### Estrutura de Código

```javascript
// ✅ Bom: Função bem documentada e estruturada
/**
 * Calcula a soma de dois números
 * @param {number} a - Primeiro número
 * @param {number} b - Segundo número
 * @returns {number} A soma dos dois números
 */
function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Ambos os parâmetros devem ser números');
  }
  return a + b;
}

// ❌ Ruim: Função sem documentação
function sum(a, b) {
  return a + b;
}
```

### Convenções de Nomenclatura

- **Variáveis e funções**: camelCase (`userName`, `calculateTotal`)
- **Constantes**: SCREAMING_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Arquivos**: kebab-case (`user-service.js`, `api-client.js`)
- **Classes**: PascalCase (`UserManager`, `ApiClient`)

### Estrutura de Arquivos

```javascript
// 📁 src/components/user-profile.js
/**
 * Componente de perfil do usuário
 */

// Imports externos primeiro
import { format } from 'date-fns';

// Imports internos depois
import { apiClient } from '../services/api-client.js';
import { validateUser } from '../utils/validation.js';

// Constantes
const DEFAULT_AVATAR = '/images/default-avatar.png';

// Funções auxiliares
function formatUserName(firstName, lastName) {
  return `${firstName} ${lastName}`.trim();
}

// Exportação principal
export function createUserProfile(userData) {
  // Implementação...
}
```

### CSS/Estilos

```css
/* ✅ Bom: Classe bem nomeada e organizada */
.user-profile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
}

.user-profile__avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
}

.user-profile__name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* ❌ Ruim: Classes genéricas e sem organização */
.container {
  padding: 10px;
}

.img {
  width: 50px;
}
```

### Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos de commit
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Mudanças na documentação
style:    Formatação, ponto e vírgula, etc
refactor: Refatoração de código
test:     Adição ou modificação de testes
chore:    Manutenção geral

# Exemplos
git commit -m "feat: adiciona validação de email"
git commit -m "fix: corrige erro de responsividade no mobile"
git commit -m "docs: atualiza guia de instalação"
```

### Testes

```javascript
// ✅ Bom: Teste bem estruturado
describe('UserValidator', () => {
  describe('validateEmail', () => {
    it('deve retornar true para email válido', () => {
      const result = validateEmail('user@example.com');
      expect(result).toBe(true);
    });

    it('deve retornar false para email inválido', () => {
      const result = validateEmail('invalid-email');
      expect(result).toBe(false);
    });

    it('deve lançar erro para valor null', () => {
      expect(() => validateEmail(null)).toThrow();
    });
  });
});
```

## 🚀 Processo de Submissão

### Checklist do Pull Request

Antes de submeter seu PR, verifique:

- [ ] **Código testado** localmente
- [ ] **Testes** passando (`npm run test`)
- [ ] **Linting** sem erros (`npm run lint`)
- [ ] **Build** funcionando (`npm run build`)
- [ ] **Documentação** atualizada
- [ ] **Commits** seguem o padrão
- [ ] **Descrição** clara no PR

### Template de Pull Request

```markdown
## Descrição
Breve descrição das mudanças realizadas.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Testes
- [ ] Testes unitários adicionados/atualizados
- [ ] Testado localmente
- [ ] Testado em diferentes navegadores

## Screenshots
(Se aplicável)

## Checklist
- [ ] Código revisado
- [ ] Documentação atualizada
- [ ] Testes passando
```

## 👀 Revisão de Código

### Para Revisores

- **Seja construtivo** e respeitoso
- **Teste** as mudanças localmente
- **Verifique** se segue os padrões
- **Considere** o impacto nas funcionalidades existentes

### Para Contribuidores

- **Responda** aos comentários prontamente
- **Faça** as correções solicitadas
- **Mantenha** a discussão focada no código
- **Seja aberto** a sugestões

## 💬 Comunicação

### Canais de Comunicação

- **Issues**: Para bugs e melhorias
- **Discussions**: Para perguntas e discussões gerais
- **Email**: Para questões sensíveis

### Diretrizes

- **Use português** para comunicação geral
- **Seja claro** e objetivo
- **Forneça contexto** suficiente
- **Seja paciente** com as respostas

## 🏷️ Labels e Tags

### Issues
- `bug`: Problemas no código
- `enhancement`: Melhorias
- `documentation`: Relacionado à documentação
- `good first issue`: Bom para iniciantes
- `help wanted`: Precisa de ajuda da comunidade

### Pull Requests
- `wip`: Work in progress
- `ready for review`: Pronto para revisão
- `breaking change`: Mudança que quebra compatibilidade

## 🎉 Reconhecimento

Todos os contribuidores são reconhecidos no README e recebem créditos por suas contribuições. Agradecemos por fazer parte desta comunidade!

---

**Obrigado por contribuir! 🙏**