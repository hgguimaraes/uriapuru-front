# Guia de Início Rápido

Este guia ajudará você a configurar e executar o projeto em poucos minutos.

## ⚡ Setup em 5 Minutos

### 1. Verificar Pré-requisitos

```bash
# Verificar Node.js (necessário 18.0.0+)
node --version

# Verificar npm (necessário 8.0.0+)
npm --version

# Se não tiver instalado, baixe em: https://nodejs.org/
```

### 2. Clonar e Instalar

```bash
# Clonar o repositório
git clone https://github.com/usuario/projeto.git
cd projeto

# Instalar dependências
npm install
```

### 3. Executar

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# ✅ Pronto! Abra http://localhost:5173
```

## 🎯 Primeira Implementação

### Modificar a Página Principal

Edite `src/main.js`:

```javascript
import './style.css'

// Seu primeiro componente
function createWelcomeMessage(name) {
  return `
    <div class="welcome">
      <h1>Olá, ${name}! 👋</h1>
      <p>Bem-vindo ao seu novo projeto!</p>
    </div>
  `;
}

// Renderizar na página
document.querySelector('#app').innerHTML = createWelcomeMessage('Desenvolvedor');
```

### Adicionar Estilos

Edite `src/style.css`:

```css
.welcome {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.welcome h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  animation: fadeInUp 0.8s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## 🧩 Criando Seu Primeiro Componente

### 1. Criar o Arquivo

Crie `src/components/counter.js`:

```javascript
/**
 * Componente Contador
 * Demonstra interatividade básica
 */
export class Counter {
  constructor(initialValue = 0) {
    this.value = initialValue;
    this.element = null;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'counter';
    this.updateDisplay();
    this.attachEvents();
    return this.element;
  }
  
  updateDisplay() {
    this.element.innerHTML = `
      <div class="counter__display">
        <h2>Contador: ${this.value}</h2>
      </div>
      <div class="counter__controls">
        <button class="btn btn--decrement">-</button>
        <button class="btn btn--increment">+</button>
        <button class="btn btn--reset">Reset</button>
      </div>
    `;
  }
  
  attachEvents() {
    const incrementBtn = this.element.querySelector('.btn--increment');
    const decrementBtn = this.element.querySelector('.btn--decrement');
    const resetBtn = this.element.querySelector('.btn--reset');
    
    incrementBtn.addEventListener('click', () => this.increment());
    decrementBtn.addEventListener('click', () => this.decrement());
    resetBtn.addEventListener('click', () => this.reset());
  }
  
  increment() {
    this.value++;
    this.updateDisplay();
    this.attachEvents(); // Re-attach após update
  }
  
  decrement() {
    this.value--;
    this.updateDisplay();
    this.attachEvents();
  }
  
  reset() {
    this.value = 0;
    this.updateDisplay();
    this.attachEvents();
  }
}
```

### 2. Estilos do Componente

Adicione ao `src/style.css`:

```css
.counter {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  max-width: 300px;
  margin: 2rem auto;
  text-align: center;
}

.counter__display h2 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.counter__controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn--increment {
  background: #4CAF50;
  color: white;
}

.btn--decrement {
  background: #f44336;
  color: white;
}

.btn--reset {
  background: #2196F3;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0,0,0,0.2);
}
```

### 3. Usar o Componente

Atualize `src/main.js`:

```javascript
import './style.css'
import { Counter } from './components/counter.js'

function createApp() {
  // Criar instância do contador
  const counter = new Counter(0);
  
  return `
    <div class="app">
      <div class="welcome">
        <h1>Meu Primeiro Projeto! 🚀</h1>
        <p>Aqui está seu primeiro componente:</p>
      </div>
      <div id="counter-container"></div>
    </div>
  `;
}

// Renderizar aplicação
document.querySelector('#app').innerHTML = createApp();

// Adicionar o componente contador
const counter = new Counter(10);
document.querySelector('#counter-container').appendChild(counter.render());
```

## 🔧 Utilitários Básicos

### Criar Helper Functions

Crie `src/utils/helpers.js`:

```javascript
/**
 * Função para formatar números
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('pt-BR').format(num);
}

/**
 * Função para debounce
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Função para validar email
 */
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Função para gerar ID único
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
```

### Usar os Utilitários

```javascript
import { formatNumber, debounce, generateId } from './utils/helpers.js';

// Exemplo de uso
const uniqueId = generateId();
const formattedValue = formatNumber(1234567);

// Debounce para input de pesquisa
const searchInput = document.querySelector('#search');
const debouncedSearch = debounce((value) => {
  console.log('Searching for:', value);
}, 300);

searchInput?.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

## 📱 Responsividade Rápida

### Mobile-First CSS

```css
/* Base mobile */
.app {
  padding: 1rem;
  max-width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .app {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .app {
    padding: 3rem;
    max-width: 1200px;
  }
}
```

## 🚀 Deploy Rápido

### Build de Produção

```bash
# Gerar build otimizado
npm run build

# Testar build localmente
npm run preview
```

### Deploy Automático (Netlify)

1. Faça push para o GitHub
2. Conecte seu repositório no [Netlify](https://netlify.com)
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

## 📚 Próximos Passos

Agora que você tem o básico funcionando:

1. **Explore a documentação**: [docs/](../README.md)
2. **Adicione mais componentes**: Crie em `src/components/`
3. **Implemente serviços**: Use `src/services/`
4. **Configure testes**: Adicione Vitest
5. **Melhore o CSS**: Use CSS Variables
6. **Adicione TypeScript**: Para type safety

## 🆘 Problemas Comuns

### Porta já em uso
```bash
# Erro: Port 5173 is already in use
# Solução: Mudar porta
npm run dev -- --port 3000
```

### Módulos não encontrados
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Hot reload não funciona
```bash
# Verificar se está salvando os arquivos
# Verificar se não há erros no console
```

---

**🎉 Parabéns!** Você já tem um projeto funcional! Agora é só customizar e expandir.