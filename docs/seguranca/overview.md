## Segurança

### Senhas

- Nunca armazenar senha em texto puro.
- Utilizar hash seguro (ex.: bcrypt com salt).
- Política mínima:
  - Tamanho mínimo (ex.: 8 caracteres).

### Tokens (JWT)

- **Access token**
  - Curta duração (ex.: 15 minutos).
  - Usado nas chamadas à API via header `Authorization: Bearer <token>`.

- **Refresh token**
  - Duração maior (ex.: 7 dias).
  - Endpoint dedicado para renovação de access token.

### Variáveis de Ambiente

- `DATABASE_URL`
- `JWT_SECRET`
- `REFRESH_JWT_SECRET`
- Não versionar `.env`.

### Proteções Adicionais

- CORS: liberar apenas domínios esperados (dev e prod).
- Rate limiting em `/auth/login`.
- Sanitização e validação de todas as entradas (class-validator).

### Controle de Acesso (RBAC)

O sistema utiliza um modelo de RBAC (Role-Based Access Control) dinâmico baseado em **Grupos**:

1. **Grupos**: Conjunto de permissões (ex: Admin, Operador, Leitor).
2. **Permissões Granulares**: Ações específicas definidas no sistema (ex: `TRANSACTION_CREATE`, `category_VIEW`).
3. **Vínculo**: Cada usuário (`UserCompany`) pertence a um Grupo.

**Lógica de Acesso a Recursos Compartilhados**:
Alguns recursos são auxiliares a outros. Para simplificar a gestão, o sistema concede acesso implícito:
- Quem tem permissão para **Visualizar Lançamentos** (`TRANSACTION_VIEW`) também pode **Visualizar Categorias e Formas de Pagamento**.
- Isso evita que o administrador precise marcar dezenas de permissões básicas manualmente.

**Escopo de Dados**:
Todo acesso é estritamente escopado pelo `companyId`. Um usuário autenticado nunca deve conseguir acessar dados de outra empresa, mesmo que tenha permissão de "Admin", pois a validação do JWT e dos Services garante o isolamento por tenant.

