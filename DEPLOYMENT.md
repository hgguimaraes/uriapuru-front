# Deployment Guide - Uirapuru Frontend

Este documento descreve como fazer deploy do Uirapuru Frontend em diferentes ambientes.

## 🚀 Estratégias de Deploy

### 1. Vercel (Recomendado)

#### Deploy Automático via GitHub

1. **Conecte seu repositório ao Vercel:**
   ```bash
   # Instale a Vercel CLI
   npm i -g vercel
   
   # Faça login
   vercel login
   
   # Configure o projeto
   vercel
   ```

2. **Configure as variáveis de ambiente no Vercel:**
   ```env
   NEXT_PUBLIC_API_URL=https://api.uirapuru.com
   NEXT_PUBLIC_TENANT_ID=production-tenant
   NODE_ENV=production
   ```

3. **Configure domínio customizado:**
   - Acesse Vercel Dashboard → Project → Settings → Domains
   - Adicione seu domínio: `app.uirapuru.com`
   - Configure DNS (A record ou CNAME)

#### Deploy Manual
```bash
# Build e deploy
npm run build
vercel --prod
```

### 2. Netlify

#### Deploy via Git
1. Conecte repositório no Netlify Dashboard
2. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: .next
   ```
3. Configure variáveis de ambiente no painel

#### Deploy manual
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

### 3. Docker

#### Build da imagem
```bash
# Build da imagem de produção
docker build -t uirapuru-frontend:latest .

# Teste local
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.uirapuru.com \
  -e NEXT_PUBLIC_TENANT_ID=production \
  uirapuru-frontend:latest
```

#### Docker Compose para produção
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  uirapuru-frontend:
    image: ghcr.io/techamazon/uirapuru-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.uirapuru.com
      - NEXT_PUBLIC_TENANT_ID=production
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`app.uirapuru.com`)"
```

### 4. Kubernetes

#### Namespace e ConfigMap
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: uirapuru

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
  namespace: uirapuru
data:
  NEXT_PUBLIC_API_URL: "https://api.uirapuru.com"
  NEXT_PUBLIC_TENANT_ID: "production"
  NODE_ENV: "production"
```

#### Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: uirapuru-frontend
  namespace: uirapuru
spec:
  replicas: 3
  selector:
    matchLabels:
      app: uirapuru-frontend
  template:
    metadata:
      labels:
        app: uirapuru-frontend
    spec:
      containers:
      - name: frontend
        image: ghcr.io/techamazon/uirapuru-frontend:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: frontend-config
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

#### Service e Ingress
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: uirapuru-frontend-service
  namespace: uirapuru
spec:
  selector:
    app: uirapuru-frontend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: uirapuru-frontend-ingress
  namespace: uirapuru
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - app.uirapuru.com
    secretName: frontend-tls
  rules:
  - host: app.uirapuru.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: uirapuru-frontend-service
            port:
              number: 80
```

## 🔧 Configurações por Ambiente

### Development
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_TENANT_ID=dev-tenant
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### Staging
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://staging-api.uirapuru.com
NEXT_PUBLIC_TENANT_ID=staging-tenant
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.uirapuru.com
NEXT_PUBLIC_TENANT_ID=production
NEXT_PUBLIC_ENABLE_DEBUG=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## 📊 Monitoramento

### Health Checks
- **Endpoint**: `/api/health`
- **Resposta esperada**: 200 OK
- **Payload**:
  ```json
  {
    "uptime": 12345,
    "message": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "production",
    "version": "1.0.0",
    "api_status": "connected"
  }
  ```

### Métricas (Web Vitals)
- **Core Web Vitals** via Next.js Analytics
- **Error tracking** via Sentry
- **Performance** via Lighthouse CI

### Logs
```bash
# Ver logs no Docker
docker logs -f container_id

# Ver logs no Kubernetes
kubectl logs -f deployment/uirapuru-frontend -n uirapuru

# Ver logs no Vercel
vercel logs
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run type-check

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: |
          docker build -t ghcr.io/${{ github.repository }}:${{ github.sha }} .
          docker tag ghcr.io/${{ github.repository }}:${{ github.sha }} ghcr.io/${{ github.repository }}:latest
      
      - name: Login to GHCR
        run: echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
      
      - name: Push to GHCR
        run: |
          docker push ghcr.io/${{ github.repository }}:${{ github.sha }}
          docker push ghcr.io/${{ github.repository }}:latest
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/uirapuru-frontend frontend=ghcr.io/${{ github.repository }}:${{ github.sha }} -n uirapuru
```

## 🔒 Segurança

### Headers de Segurança
```javascript
// next.config.mjs
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

### SSL/TLS
- **Certificados**: Let's Encrypt via cert-manager
- **Redirect HTTP → HTTPS**: Configurado no Ingress
- **HSTS**: Configurado nos headers

## 📋 Checklist de Deploy

### Pré-deploy
- [ ] Testes passando (`npm run test:ci`)
- [ ] Build funcionando (`npm run build`)
- [ ] Type checking OK (`npm run type-check`)
- [ ] Lint sem erros (`npm run lint`)
- [ ] Variáveis de ambiente configuradas
- [ ] SSL certificado válido

### Pós-deploy
- [ ] Health check respondendo
- [ ] Aplicação carregando corretamente
- [ ] APIs conectando com sucesso
- [ ] Autenticação funcionando
- [ ] Métricas sendo coletadas
- [ ] Logs sendo gerados
- [ ] Performance aceitável (Core Web Vitals)

## 🆘 Rollback

### Rollback no Kubernetes
```bash
# Ver histórico de deployments
kubectl rollout history deployment/uirapuru-frontend -n uirapuru

# Rollback para versão anterior
kubectl rollout undo deployment/uirapuru-frontend -n uirapuru

# Rollback para versão específica
kubectl rollout undo deployment/uirapuru-frontend --to-revision=2 -n uirapuru
```

### Rollback no Vercel
```bash
# Listar deployments
vercel ls

# Fazer rollback
vercel rollback [deployment-url]
```

## 📞 Suporte

Em caso de problemas durante o deploy:

1. **Verifique os logs** da aplicação
2. **Teste o health check** `/api/health`
3. **Valide as variáveis** de ambiente
4. **Consulte a documentação** da plataforma
5. **Contate o suporte**: comercial@techamazon.tech