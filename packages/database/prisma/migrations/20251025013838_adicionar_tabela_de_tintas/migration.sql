-- CreateEnum
CREATE TYPE "AMBIENTES" AS ENUM ('INTERNO', 'EXTERNO', 'INTERNO_EXTERNO');

-- CreateEnum
CREATE TYPE "ACABAMENTOS" AS ENUM ('ACETINADO', 'FOSCO', 'BRILHANTE');

-- CreateEnum
CREATE TYPE "LINHAS" AS ENUM ('PREMIUM', 'STANDARD');

-- CreateEnum
CREATE TYPE "TIPOS_DE_SUPERFICIE" AS ENUM ('ALVENARIA', 'MADEIRA', 'FERRO');

-- CreateTable
CREATE TABLE "tintas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "ambiente" "AMBIENTES" NOT NULL,
    "acabamento" "ACABAMENTOS" NOT NULL,
    "features" TEXT[],
    "linhas" "LINHAS" NOT NULL,
    "tiposDeSuperfeicie" "TIPOS_DE_SUPERFICIE"[],

    CONSTRAINT "tintas_pkey" PRIMARY KEY ("id")
);
