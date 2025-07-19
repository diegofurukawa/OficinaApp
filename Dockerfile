FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++ libc6-compat

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código
COPY . .

# Criar diretório data
RUN mkdir -p /app/data

EXPOSE 3002

CMD ["npm", "run", "dev"]