# Dockerfile para desenvolvimento
FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema para better-sqlite3
RUN apk add --no-cache python3 make g++ libc6-compat

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./

# Instalar dependências
RUN npm install

# Criar diretório do banco
RUN mkdir -p /app/data

# Expor porta
EXPOSE 3000

# Comando padrão
CMD ["npm", "run", "dev"]