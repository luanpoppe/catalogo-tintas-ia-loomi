# Catálogo Inteligente de Tintas com IA

Um assistente inteligente para explorar e escolher tintas, construído com Next.js 16 e React 19.

## Funcionalidades

- **Autenticação Completa**: Sistema de login e cadastro com gerenciamento automático de tokens (access e refresh)
- **Chat Inteligente**: Interface de chat moderna que se comunica com APIs de LLMs
- **Suporte a Imagens**: Visualização de imagens enviadas pelo backend nas respostas
- **Streaming de Respostas**: Suporte para respostas em tempo real (com fallback para requisições normais)
- **Design Moderno**: Interface limpa com paleta de cores roxo/lilás

## Tecnologias

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

### Instalação

\`\`\`bash
npm install
npm run dev
\`\`\`

O aplicativo estará disponível em `http://localhost:3000`.

## Estrutura da API Backend

O frontend espera que o backend implemente os seguintes endpoints:

### Autenticação

#### POST /auth/signup
Cria uma nova conta de usuário.

**Request:**
\`\`\`json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
\`\`\`

**Response:**
\`\`\`json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "123",
    "email": "usuario@email.com",
    "name": "Nome do Usuário"
  }
}
\`\`\`

#### POST /auth/login
Autentica um usuário existente.

**Request:**
\`\`\`json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "123",
    "email": "usuario@email.com",
    "name": "Nome do Usuário"
  }
}
\`\`\`

#### POST /auth/refresh
Renova o access token usando o refresh token.

**Request:**
\`\`\`json
{
  "refreshToken": "eyJhbGc..."
}
\`\`\`

**Response:**
\`\`\`json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
\`\`\`

### Chat

#### POST /chat/message
Envia uma mensagem e recebe uma resposta completa.

**Headers:**
\`\`\`
Authorization: Bearer {accessToken}
\`\`\`

**Request:**
\`\`\`json
{
  "message": "Qual a melhor tinta para parede externa?"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Para paredes externas, recomendo tintas acrílicas...",
  "imageUrl": "https://exemplo.com/imagem-tinta.jpg"
}
\`\`\`

#### POST /chat/stream (Opcional)
Envia uma mensagem e recebe a resposta em streaming (Server-Sent Events).

**Headers:**
\`\`\`
Authorization: Bearer {accessToken}
\`\`\`

**Request:**
\`\`\`json
{
  "message": "Mostre cores de azul para quarto"
}
\`\`\`

**Response (SSE):**
\`\`\`
data: {"type": "text", "content": "Aqui estão "}
data: {"type": "text", "content": "algumas opções "}
data: {"type": "text", "content": "de azul..."}
data: {"type": "image", "url": "https://exemplo.com/azul.jpg"}
data: [DONE]
\`\`\`

## Gerenciamento de Tokens

O sistema implementa refresh automático de tokens:

1. Todas as requisições autenticadas incluem o `accessToken` no header `Authorization`
2. Se uma requisição retornar 401 (Unauthorized), o sistema automaticamente:
   - Tenta renovar o token usando o `refreshToken`
   - Refaz a requisição original com o novo token
   - Se a renovação falhar, redireciona para a página de login

## Estrutura de Arquivos

\`\`\`
app/
├── chat/
│   └── page.tsx          # Página principal do chat
├── login/
│   └── page.tsx          # Página de login
├── signup/
│   └── page.tsx          # Página de cadastro
├── layout.tsx            # Layout raiz
├── page.tsx              # Página inicial
└── globals.css           # Estilos globais com tema roxo/lilás

components/
├── auth-form.tsx         # Formulário de autenticação
├── chat-container.tsx    # Container de mensagens
├── chat-header.tsx       # Cabeçalho do chat
├── chat-input.tsx        # Input de mensagens
└── chat-message.tsx      # Componente de mensagem individual

lib/
├── auth.ts               # Utilitários de autenticação
└── api.ts                # Cliente API com refresh automático
\`\`\`

## Personalização

### Cores

As cores podem ser personalizadas no arquivo `app/globals.css`. O tema atual usa:
- Primary: Roxo vibrante
- Secondary: Lilás claro
- Accent: Roxo-rosa

### Backend URL

Configure a URL do backend na variável de ambiente `NEXT_PUBLIC_API_URL`.
