# 🎨 Catálogo Inteligente de Tintas IA - Desafio Loomi

Este projeto implementa um assistente de IA especialista em tintas Suvinil, desenvolvido como solução para o Desafio Back IA da Loomi. O assistente ajuda usuários a escolherem produtos ideais, interpretando suas necessidades, buscando informações em uma base de dados vetorizada e, opcionalmente, gerando simulações visuais.

## 🌟 1. Visão Geral

A solução é um monorepo gerenciado com NPM Workspaces, contendo os seguintes pacotes principais:

1.  **`packages/api`**: Serviço backend (Node.js + Fastify + TypeScript) responsável pelo CRUD de tintas e usuários, autenticação JWT (com RBAC), e por servir como ponto de entrada para o chatbot.
2.  **`packages/agente-tintas-ia`**: Pacote contendo a lógica do agente de IA (Langchain), incluindo a definição do agente, ferramentas (tools), prompts e modelos de linguagem. É utilizado pela API.
3.  **`packages/database`**: Gerencia o schema do banco de dados (Prisma), migrações, seeding (incluindo geração de embeddings) e o cliente Prisma.
4.  **`packages/frontend`**: (Bônus) Aplicação frontend (Next.js + React + TypeScript) com interface de chat para interagir com o assistente.

## ✨ 2. Funcionalidades Implementadas

### API (`packages/api`)

- **Autenticação JWT:** Login (`/auth/login`), Cadastro (`/usuario`), Refresh Token (`/auth/refresh`) com cookies HttpOnly.
- **RBAC:** Middlewares para verificar login (`VerificarUsuarioLogadoMiddleware`) e permissões (Admin/Comum - `VerificarPermissaoDoUsuarioMiddleware`).
- **CRUD Tintas (`/tinta`):** Endpoints para `GET` (todos, por ID, por query/search), `POST`, `PATCH`, `DELETE` (protegidos para Admin).
- **CRUD Usuários (`/usuario`):** Endpoints para `GET` (por ID, por email), `POST`, `PUT`, `DELETE` (protegidos para Admin).
- **Chat Endpoint (`/chat`):** Recebe mensagens do usuário, interage com o `agente-tintas-ia` e retorna a resposta da IA (protegido por login).
- **Documentação:** Swagger UI disponível em `/swagger`.
- **Validação:** Validação de entrada e saída com Zod.

### Agente de IA (`packages/agente-tintas-ia`)

- **Orquestração com Langchain:** Utiliza `createAgent` para um agente baseado em LLM (Gemini configurado em `models.ts`) capaz de usar ferramentas.
- **Prompt Engineering:** Prompt detalhado (`agente-tinta-prompt.ts`) define a persona "Catálogo Inteligente Suvinil", objetivos e regras de uso das ferramentas.
- **Ferramentas (Tools):**
  - `buscar_tintas_suvinil`: Realiza busca semântica (RAG) na base de dados PostgreSQL/pgvector usando embeddings OpenAI (`buscar-tinta.tool.ts`).
  - `buscar_tintas_por_query`: Busca tintas no banco de dados com filtros estruturados (cor, ambiente, etc.) via API (`buscar-tintas-por-query.tool.ts`).
  - `listar_todas_tintas`: Lista todas as tintas da API (`listar-todas-tintas.tool.ts`).
  - `gerar_imagem_tinta`: Gera uma imagem de simulação usando DALL-E 3 (`gerar-imagem-tinta.tool.ts`).
  - `buscar_na_internet`: Usa Tavily Search API para buscas web genéricas (`buscar-internet.tool.ts`).
- **Memória:** Persistência de curto prazo do histórico da conversa por `thread_id` (associado ao `userId`) usando `PostgresSaver` (`short-term-memory.ts`).
- **Schema de Resposta:** Define um schema Zod (`agente-tinta.dto.ts`) para a resposta estruturada do agente, incluindo texto e URL da imagem (se gerada).

### Banco de Dados (`packages/database`)

- **Schema Prisma:** Define modelos `Tintas` e `Usuarios` com os campos necessários, incluindo `embedding vector(1536)` na tabela `tintas`.
- **Migrations:** Arquivos SQL para criar tabelas, enums, índices e habilitar a extensão `vector`.
- **Seeding:** Script (`seed.ts`) que:
  - Lê dados do `seed-tintas.csv`.
  - Gera embeddings para cada tinta usando `OpenAIEmbeddings` (`text-embedding-3-small`).
  - Insere os dados e embeddings no PostgreSQL.
  - Cria um usuário `admin@admin.com` padrão.

### Frontend (`packages/frontend`)

- **Interface de Chat:** Permite ao usuário enviar mensagens e visualizar respostas da IA, incluindo imagens (`app/conversar/page.tsx`).
- **Autenticação:** Páginas e formulários para Login (`/entrar`) e Cadastro (`/cadastrar`).
- **Gerenciamento de Token:** Cliente API (`lib/api.ts`) com lógica para refresh automático de token JWT.
- \*\*Modo Dev

## 🏗️ 3. Arquitetura da Solução

O projeto adota uma arquitetura de monorepo com pacotes independentes, utilizando Docker Compose para orquestração.

**Fluxo da Arquitetura:**

1.  O **Frontend (Next.js)**, rodando em `localhost:3000`, envia requisições para a API.
2.  A **API (Fastify)**, rodando em `localhost:3333`, recebe as requisições.
    - Para operações CRUD (Criar, Ler, Atualizar, Deletar), a API interage diretamente com o Banco de Dados.
    - Para requisições de chat, a API chama o **Agente IA (Lib)**.
3.  O **Agente IA (Lib)**, utilizando Langchain, processa a requisição do chat.
    - Ele interage com **LLMs** (Modelos de Linguagem Grandes como Gemini, OpenAI GPT, DALL-E) para compreensão e geração de texto/imagem.
    - Ele utiliza **Ferramentas** (Tools) para realizar ações específicas, como busca RAG (Retrieval-Augmented Generation), busca por query estruturada, geração de imagem ou busca na web.
    - As ferramentas de busca (RAG e Query) interagem com o **Banco de Dados**.
4.  O **Banco de Dados (PostgreSQL + pgvector)**, rodando em `localhost:5432`, armazena os dados dos usuários, das tintas e os embeddings (vetores) para a busca RAG.
5.  A resposta é retornada pelo Agente IA para a API, que a encaminha para o Frontend.

**Componentes Principais:**

- **Frontend:** Interage exclusivamente com a API.
- **API:** Gerencia dados (CRUD), autenticação e encaminha requisições de chat para o pacote `agente-tintas-ia`.
- **Agente IA (Lib):** Contém a lógica do agente Langchain, que processa a entrada, decide qual ferramenta usar, interage com LLMs e ferramentas (incluindo busca vetorial no DB).
- **Banco de Dados:** Armazena dados relacionais (usuários, tintas) e vetoriais (embeddings das tintas).

### Estrutura de Diretórios (Monorepo)

A estrutura do projeto no monorepo é organizada da seguinte forma:

- **/ (Raiz do Projeto):** Contém arquivos de configuração globais e a pasta `packages`.
  - `packages/`: Diretório principal que agrupa todos os pacotes do monorepo.
    - `api/`: Contém o serviço backend principal construído com Fastify e TypeScript. Inclui o código fonte (`src/`), testes (`test/`), o `Dockerfile` para containerização, `package.json` para dependências e scripts, e um `.env.example` para variáveis de ambiente.
    - `agente-tintas-ia/`: Abriga o pacote com a lógica da Inteligência Artificial, utilizando Langchain. Possui seu próprio código fonte (`src/`), `package.json`, e `.env.example`.
    - `database/`: Responsável pelo gerenciamento do banco de dados com Prisma. Contém o diretório `prisma/` com as migrações (`migrations/`), a definição do schema (`schema.prisma`), o script de seeding (`seed.ts`) e os dados para o seed (`seed-tintas.csv`), além do `package.json` específico.
    - `frontend/`: Contém a aplicação frontend (bônus) construída com Next.js e React. Inclui a estrutura do Next.js (`app/`), componentes (`components/`), utilitários (`lib/`), seu `Dockerfile.frontend`, `package.json`, e `.env.local.example`.
  - `docker-compose.yml`: Arquivo que define e orquestra os containers Docker para a API, banco de dados e frontend.
  - `docker-entrypoint.sh`: Script executado na inicialização do container da API para tarefas como aplicar migrações.
  - `.gitignore`: Especifica arquivos e diretórios a serem ignorados pelo Git.
  - `package.json`: Arquivo de configuração da raiz do monorepo, definindo os workspaces.
  - `tsconfig.json`: Configuração TypeScript base para o monorepo, referenciando os pacotes.
  - `README.md`: O arquivo principal de documentação do projeto.

## 💻 4. Stack Tecnológica

| Categoria            | Tecnologia                 | Justificativa (Baseado no Desafio)                               |
| :------------------- | :------------------------- | :--------------------------------------------------------------- |
| **Backend**          | Node.js + TypeScript       | Stack principal requisitada [cite: 99]                           |
|                      | Fastify                    | Framework web performático para Node.js                          |
| **Banco de Dados**   | PostgreSQL + pgvector      | Banco relacional recomendado + suporte a vetores [cite: 101, 91] |
|                      | Prisma                     | ORM para interagir com o PostgreSQL                              |
| **IA (Framework)**   | Langchain                  | Framework recomendado para agentes e RAG                         |
| **IA (LLM)**         | Google Gemini / OpenAI GPT | Modelos de linguagem para o agente [cite: 86, 94]                |
| **IA (Embeddings)**  | OpenAI Embeddings API      | Geração de vetores para RAG [cite: 91, 94]                       |
| **IA (Geração Img)** | OpenAI DALL-E 3            | Geração visual (escopo extra) [cite: 110, 94]                    |
| **IA (Busca Web)**   | Tavily Search API          | Ferramenta para busca externa contextual                         |
| **Autenticação**     | JWT (Fastify JWT)          | Requisito para autenticação e RBAC                               |
| **Containerização**  | Docker + Docker Compose    | Requisito para deploy e ambiente de testes                       |
| **API Docs**         | Swagger (Fastify Swagger)  | Requisito para documentação da API                               |
| **Frontend**         | Next.js + React + TS       | (Bônus) Framework moderno para UI                                |
|                      | Tailwind CSS + shadcn/ui   | (Bônus) Estilização e componentes de UI                          |

## 🚀 5. Como Executar (Getting Started)

### Pré-requisitos

- Node.js (v20 ou superior recomendado)
- NPM (v8 ou superior)
- Docker e Docker Compose
- Chaves de API:
  - OpenAI (`OPENAI_API_KEY`): Necessária para embeddings e DALL-E.
  - Google Gemini (`GEMINI_API_KEY`): Necessária para o LLM do agente.
  - Tavily (`TAVILY_API_KEY`): Necessária para a ferramenta de busca na web.

### Configuração das Variáveis de Ambiente

1.  **API:** Copie `packages/api/.env.example` para `packages/api/.env` e preencha as variáveis:
    - `DATABASE_URL`: Será preenchido automaticamente pelo Docker Compose, mas ajuste se rodar manualmente.
    - `JWT_SECRET`: Gere um segredo forte.
    - `OPENAI_API_KEY`, `GEMINI_API_KEY`, `TAVILY_API_KEY`: Insira suas chaves.
2.  **Agente IA:** Copie `packages/agente-tintas-ia/.env.example` para `packages/agente-tintas-ia/.env` e preencha:
    - `DATABASE_URL`: Deixe como está para Docker Compose, ou ajuste se rodar manualmente (igual ao da API).
    - `GEMINI_API_KEY`, `OPENAI_API_KEY`, `TAVILY_API_KEY`: Insira suas chaves.
3.  **Frontend:** Copie `packages/frontend/.env.example` (se existir) para `packages/frontend/.env.local` e defina:
    - `NEXT_PUBLIC_API_URL=http://localhost:3333` (ou a URL/porta onde a API estará rodando).

### Executando com Docker (Recomendado)

Este método sobe a API, o Frontend e o Banco de Dados PostgreSQL com a extensão pgvector habilitada.

1.  Clone o repositório:
    ```bash
    git clone https://github.com/luanpoppe/catalogo-tintas-ia-loomi.git .
    cd catalogo-tintas-ia-loomi
    ```
2.  Configure os arquivos `.env` conforme a seção anterior.
3.  Execute o Docker Compose:
    ```bash
    docker compose up --build -d
    ```
4.  **Aguarde:** Os serviços podem levar alguns minutos para iniciar completamente, especialmente na primeira vez (build e seed do banco). Você pode acompanhar os logs com `docker compose logs -f api database frontend`. O script `docker-entrypoint.sh` aplicará as migrações e o `seed.ts` populará o banco com tintas e embeddings.
5.  Acesse:
    - **Frontend:** `http://localhost:3000`
    - **API (Swagger):** `http://localhost:3333/swagger`

### Executando Manualmente

Requer instalação manual das dependências e gerenciamento do banco de dados.

1.  **Banco de Dados:** Inicie uma instância PostgreSQL (v16+ recomendado) com a extensão `pgvector` habilitada. Configure a `DATABASE_URL` nos arquivos `.env` da API e do Agente IA.
2.  **Instale Dependências:** Na raiz do projeto:
    ```bash
    npm install
    ```
3.  **Prepare o Banco de Dados:**

    ```bash
    # Aplica migrações, gera o Prisma Client e popula o banco com dados do CSV e gera embeddings (requer OPENAI_API_KEY)
    npm run build -w @catalogo-tintas/database

    ```

4.  **Inicie a API:**
    ```bash
    npm run start -w api
    ```
    A API estará rodando em `http://localhost:3333` (ou a porta definida no `.env`).
5.  **Inicie o Frontend:** (Em outro terminal)
    ```bash
    npm run dev -w @catalogo-tintas/frontend
    ```
    O Frontend estará disponível em `http://localhost:3000`.

## 🧪 6. Testando

### Acesso de Administrador

Para facilitar os testes das funcionalidades administrativas (como gerenciamento de tintas e usuários), o script de `seed` do banco de dados cria um usuário administrador padrão com as seguintes credenciais:

- **E-mail:** `admin@admin.com`
- **Senha:** `Senha123`

Com este usuário, você pode fazer login e ter acesso total aos endpoints protegidos da API, permitindo a criação de outros administradores e a gestão completa de tintas e usuários.

### API (Swagger)

Acesse `http://localhost:3333/swagger` para interagir com os endpoints da API (CRUD Tintas, CRUD Usuários, Auth). Use o botão "Authorize" para testar endpoints protegidos após obter um token JWT via login[cite: 107].

### Chatbot (Frontend)

Acesse `http://localhost:3000`, crie uma conta ou faça login (ou use o botão "Modo Desenvolvimento"). Vá para a página de chat (`/conversar`) para interagir com o assistente.

### Chatbot (API Direta)

Você pode enviar requisições POST diretamente para o endpoint `/chat` da API (requer token de autenticação):

```bash
curl -X POST http://localhost:3333/chat \
-H "Content-Type: application/json" \
-H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
-d '{
    "userMessage": "Qual tinta sem cheiro você recomenda para um quarto de bebê?",
    "shouldEraseMemory": false
}'
```

### Exemplo de Resposta:

```JSON
{
"aiMessage": "Para um quarto de bebê, a segurança e o bem-estar são essenciais! Recomendo a Suvinil Toque de Seda, que além de ter acabamento acetinado e ser lavável, possui tecnologia sem odor, ideal para ambientes de crianças.",
"urlImagem": null
}
```

## ✅ 7. Testes Automatizados

O projeto inclui testes **unitários** e **end-to-end** para a API:

- **Rodar todos os testes:**

  ```bash
  npm run test -ws
  ```

- **Rodar testes unitários da API:**:

  ```bash
  npm run test -w api
  ```

- **Rodar testes e2e da API:**
  (requer ambiente de teste com banco de dados configurado por prisma-test-environment.ts)

  ```bash
  npm run test:e2e -w api
  ```

- **Verificar cobertura:**
  ```bash
  npm run test:coverage -w api
  # ou
  npm run test:e2e:coverage -w api
  ```

## 🤖 8. Uso de Ferramentas de IA no Desenvolvimento

Conforme solicitado no desafio, foram utilizadas ferramentas de **IA** para auxiliar no desenvolvimento:

### 💡 Extensão Cline do VS Code (Ferramenta open source que simula Cursor/Copilot):

### 🔍 Gemini (Google)

- **Brainstorming:** geração de ideias para estrutura de projeto e nomes de ferramentas LangChain.
- **Geração de Código:** criação de boilerplate para controllers Fastify, use cases e testes unitários iniciais (com posterior refatoração).
  > Exemplo de Prompt:  
  > “Gere um caso de uso em TypeScript para criar uma entidade ‘Tinta’ usando um repositório com interface ITintaRepository, seguindo princípios de Clean Architecture.”
- **Revisão e Refatoração:** sugestões para melhorar legibilidade e eficiência do código, especialmente em lógicas complexas (ex: script de seed com embeddings).
  > Exemplo de Prompt:  
  > “Revise este código TypeScript para o script de seed do Prisma e sugira melhorias de performance e tratamento de erros ao gerar embeddings com a API da OpenAI.”
- **Debugging:** identificação de erros em configurações de Docker, Prisma e LangChain.
- **Documentação:** auxílio na escrita inicial de seções do README e comentários de código.
- **Pesquisa Conceitual:** exploração de conceitos como RAG, arquitetura de agentes e pgvector.
- **Comparação de Abordagens:** auxílio na decisão entre diferentes formas de implementar a memória do agente ou a busca vetorial.

- **Geração Contextual:** gerar funções ou classes com base no contexto do arquivo atual.
  > Exemplo: Selecionar a interface `ITintaRepository` e pedir para gerar uma implementação inicial da classe `TintaRepository`.
- **Explicação de Código:** compreensão de trechos complexos de bibliotecas (ex: funcionamento interno de `createAgent` do LangChain).

### 🎨 v0.dev (Vercel)

- **Prototipação de UI:** Utilizado para a criação e iteração rápida dos componentes visuais e da estrutura inicial da interface do frontend.
  > Exemplo: Gerar o layout inicial da página de chat e dos formulários de autenticação com base em descrições textuais.

### 🧭 Tomada de Decisão

As sugestões das IAs foram usadas como ponto de partida ou auxílio.  
Todo o código gerado foi **revisado, adaptado e testado** para garantir qualidade, boas práticas e integração com o restante do projeto.  
A decisão final sobre arquitetura, escolha de ferramentas e implementação foi **autoral**, com as IAs atuando como ferramentas de **produtividade e consulta**.

## 🌳 9. Fluxo de Git

O desenvolvimento seguiu as diretrizes do desafio:

- **Branch Principal:** `develop`

- **Feature Branches:** cada funcionalidade (ex: `feat/auth`, `feat/rag-tool`, `fix/seed-script`) foi desenvolvida em sua própria branch a partir de `develop`.

- **Commits:** descritivos e seguindo o padrão **Conventional Commits**

  > Exemplo: `feat: implement jwt authentication`, `fix: correct database connection string`

- **Pull Requests:** ao concluir uma feature, foi aberto um PR para `develop` para revisão (simulada neste contexto) antes do merge.

## ➡️ 10. Próximos Passos:

- **Enums Dinâmicos:** Transformar os enums relacionados às características das tintas (Ambiente, Acabamento, Linhas, Tipos de Superfície) em tabelas no banco de dados. Isso permitiria que um administrador pudesse adicionar ou editar essas opções sem necessidade de alterar o código e redployar a aplicação.
- **Contexto do Usuário para IA:** Passar informações do usuário logado (como o nome) para o prompt do agente de IA, permitindo uma interação mais personalizada.
- **Memória de Longo Prazo:** Além da memória de curto prazo por sessão, implementar um mecanismo para salvar resumos ou contextos importantes de conversas anteriores do usuário, permitindo que o agente recupere informações relevantes em novas sessões.
- **Otimização do Frontend no Docker:** Atualmente, o frontend roda em modo de desenvolvimento (`npm run dev:docker`) no container. Melhorar isso gerando uma build otimizada (`npm run build` e `npm run start`) dentro do Dockerfile do frontend para um melhor desempenho em produção.
- **CI/CD:** Implementar um pipeline de Integração Contínua e Entrega Contínua (CI/CD) utilizando ferramentas como GitHub Actions para automatizar testes, builds e deploys.
- **Observabilidade:** Expandir a observabilidade para além do agente de IA (LangSmith). Implementar monitoramento e logging estruturado para a API e o banco de dados (ex: usando OpenTelemetry, Prometheus, Grafana, Datadog) para acompanhar a saúde e performance da aplicação como um todo.
- **Testes de IA:** Adicionar testes específicos para o fluxo do agente Langchain, mockando as ferramentas (tools) e o LLM para validar a lógica de decisão do agente em diferentes cenários.
- **Streaming de Respostas:** Implementar o endpoint `/chat/stream` na API e ajustar o frontend para consumir respostas em tempo real (Server-Sent Events), melhorando a percepção de velocidade para o usuário.
- **Melhoria de UI/UX:** Aprimorar a interface do frontend, adicionando mais detalhes sobre as tintas recomendadas, permitindo visualizar histórico de conversas anteriores, e refinando a experiência geral do usuário.
