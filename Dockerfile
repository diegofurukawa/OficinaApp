# Multi-stage build para otimizar o tamanho da imagem

# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./

# Instalar dependências
RUN npm ci --only=production

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build da aplicação
RUN npm run build

# Stage 3: Runtime
FROM node:18-alpine AS runner
WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Criar e configurar diretório do banco
RUN mkdir -p /app/data
RUN chown -R nextjs:nodejs /app/data

# Copiar banco de dados inicial se existir
COPY --chown=nextjs:nodejs data/ ./data/

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]