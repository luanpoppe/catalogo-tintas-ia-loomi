-- Habilita a extensão pgvector no seu banco de dados
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- Corrige o ALTER TABLE para adicionar a coluna de embedding
ALTER TABLE "tintas" ADD COLUMN "embedding" public.vector(1536);
