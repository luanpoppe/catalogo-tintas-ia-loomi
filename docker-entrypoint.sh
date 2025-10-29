#!/bin/sh
# Para o script se um comando falhar
set -e

echo "ENTRYPOINT: Gerando client do Prisma (para Linux)..."
npx prisma generate --schema=packages/database/prisma/schema.prisma

echo "ENTRYPOINT: Construindo workspace 'agente-tintas-ia'..."
npm run build --workspace=packages/agente-tintas-ia

echo "ENTRYPOINT: Construindo workspace 'database'..."
npm run build --workspace=packages/database

echo "ENTRYPOINT: Aplicando migrações do Prisma..."
npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma

echo "ENTRYPOINT: Iniciando a API em modo de desenvolvimento (watch)..."
# 'exec' é importante aqui: ele substitui o processo do script
# pelo processo do 'npm', permitindo que o contêiner receba
# sinais (como um CTRL+C ou 'docker-compose down') corretamente.
exec npm run start --workspace=packages/api
