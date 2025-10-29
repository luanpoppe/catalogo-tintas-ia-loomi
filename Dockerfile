# Use a imagem oficial do Node.js como base
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para instalar as dependências
COPY package.json package-lock.json ./
COPY packages/api/package.json ./packages/api/
COPY packages/agente-tintas-ia/package.json ./packages/agente-tintas-ia/
COPY packages/database/package.json ./packages/database/

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# Expõe a porta que a API irá rodar
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "run", "start", "--workspace=packages/api"]
