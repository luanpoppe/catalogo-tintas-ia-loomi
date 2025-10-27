-- Habilita a extensão pgvector no seu banco de dados
CREATE EXTENSION IF NOT EXISTS vector;

-- Corrige o ALTER TABLE para adicionar a coluna de embedding
ALTER TABLE "tintas" ADD COLUMN "embedding" vector(1536);
