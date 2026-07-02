# Gestão de Fornecedores

Sistema de cadastro, homologação e gestão de fornecedores. Fornecedores se
cadastram, enviam os documentos exigidos, passam por uma análise (atualmente
simulada) e, uma vez homologados, podem cadastrar os colaboradores que vão
prestar serviço.

## Stack

- Next.js (App Router) + TypeScript
- Prisma + SQLite (driver adapter `better-sqlite3`)
- Auth.js (NextAuth v5) com Credentials + JWT
- Tailwind CSS, zod

## Perfis de usuário

- **Fornecedor**: se cadastra publicamente em `/cadastro`, envia documentos em
  `/documentos` e, após homologado, cadastra colaboradores em `/colaboradores`.
- **Administrador**: revisa fornecedores em `/admin/fornecedores`, vê o
  resultado da análise de cada documento e aprova/rejeita a homologação.
- **Consulta (contratante)**: busca fornecedores por razão social/CNPJ em
  `/consulta/buscar`, somente leitura (sem acesso a documentos).

## Setup

```bash
npm install
npm run db:push    # cria/atualiza o banco SQLite (prisma/dev.db)
npm run db:seed     # cria os usuários iniciais (ver credenciais abaixo)
npm run dev
```

Copie `.env.example` para `.env` e gere um `AUTH_SECRET` próprio (`openssl
rand -base64 32`) antes de rodar em qualquer ambiente que não seja
descartável.

> **Nota de ambiente**: `better-sqlite3` é um módulo nativo e é compilado
> durante o `npm install` (é necessário ter `python3`, `make` e `g++`
> disponíveis). Isso é normal e só acontece uma vez.

### Credenciais criadas pelo seed

| Perfil    | E-mail                    | Senha           |
| --------- | -------------------------- | --------------- |
| Admin     | admin@empresa.com.br       | `admin123`\*     |
| Consulta  | consulta@empresa.com.br    | `consulta123`\*  |

\* Personalizável via `SEED_ADMIN_PASSWORD` e `SEED_VIEWER_PASSWORD` antes de
rodar `npm run db:seed`. Fornecedores não são seedados — eles se cadastram
pelo próprio site em `/cadastro`.

## Análise de documentos (IA)

A análise de cada documento enviado roda atrás da interface
`DocumentAnalyzer` (`src/lib/ai/types.ts`). Por padrão (`AI_PROVIDER=mock`)
é usado um analisador determinístico e simulado (`src/lib/ai/mock-analyzer.ts`)
que não depende de nenhuma API externa. Para plugar uma IA real (ex: Claude
com visão), implemente `src/lib/ai/claude-analyzer.ts` e defina
`AI_PROVIDER=claude` — o restante do fluxo (upload, status do fornecedor,
tela do admin) não precisa mudar.

## Documentos e armazenamento

Os arquivos enviados ficam em `storage/uploads/<supplierId>/` (fora de
`/public`, nunca servidos diretamente) e só podem ser baixados via
`/api/documents/[id]/download`, que confere a sessão (dono do documento ou
administrador) antes de servir o arquivo.

## Fluxo de homologação

1. Fornecedor se cadastra (status `PENDENTE`) e envia os 5 documentos
   obrigatórios (Contrato Social, Cartão CNPJ, Certidão Negativa Federal,
   Certidão Negativa Trabalhista, Comprovante de Endereço).
2. Cada documento é analisado automaticamente ao ser enviado. Quando todos os
   5 tipos estiverem presentes, o status vira `EM_ANALISE`.
3. Um administrador revisa os resultados da análise em
   `/admin/fornecedores/[id]` e aprova (`APROVADO`) ou rejeita (`REJEITADO`,
   com motivo).
4. Só com `status = APROVADO` o fornecedor consegue cadastrar colaboradores
   em `/colaboradores`.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` / `npm run start` — build e execução em produção
- `npm run db:push` — sincroniza o schema Prisma com o banco
- `npm run db:seed` — cria os usuários iniciais
- `npm run db:studio` — abre o Prisma Studio
