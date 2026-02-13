## Arquitetura do Sistema

### Visão Macro

- **Frontend**: React + TypeScript + Vite + Chakra UI.
- **Backend**: Node.js + NestJS + Prisma.
- **Banco de Dados**: MySQL (instância externa).
- **Autenticação**: JWT (access + refresh tokens).
- **Estilo**: visual vibrante, inspirado na LTQ Educação.

### Frontend

- **SPA** com React Router.
- **Gerenciamento de estado**: Zustand (ou Redux Toolkit, se necessário).
- **UI**:
  - Chakra UI com tema próprio (cores vibrantes).
  - Layout com sidebar (desktop) e navegação simplificada (mobile).
- **PWA**:
  - `manifest.json` e service worker.
  - “Adicionar à tela inicial” para smartphones.

### Backend

- **NestJS** em arquitetura modular:
  - `AuthModule`, `UsersModule`, `CompaniesModule`, `CategoriesModule`,
    `PaymentMethodsModule`, `TransactionsModule`, `RecurringBillsModule`,
    `ReportsModule`.
- **ORM**: Prisma conectado ao MySQL.
- **Validação**: class-validator + DTOs.
- **Documentação de API**: Swagger (OpenAPI).

### Banco de Dados

Conexão via variável de ambiente, algo como:

- `DATABASE_URL="mysql://<user>:<password>@jdiweb.com.br:3306/jdiwebco_financeirodb"`

> **Importante**: nunca versionar senha ou URL completa com credenciais.

Entidades principais (detalhadas em `docs/backend/entidades.md`):

- `User`
- `Company`
- `Category`
- `PaymentMethod`
- `Transaction`
- `RecurringBill`
- `Group`
- `GroupPermission`

### Segurança

- Hash de senha (ex.: bcrypt).
- Tokens JWT assinados com segredos em variáveis de ambiente.
- **RBAC Granular**:
  - Permissões baseadas em Grupos (ex.: `TRANSACTION_VIEW`, `USER_EDIT`).
  - Guards globais e locais (`PermissionsGuard`) para proteger rotas.
- CORS restrito para domínios conhecidos.
- Rate limiting em rotas sensíveis (login).
- Logs de auditoria para operações críticas (opcional em MVP).

### Ambientes

- **dev**: ambiente local, banco de desenvolvimento.
- **test**: banco isolado para testes (futuro).
- **prod**: banco MySQL gerenciado em `jdiweb.com.br`.

