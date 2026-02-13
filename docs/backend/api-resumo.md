## API – Resumo de Endpoints (MVP)

### Autenticação

- `POST /auth/login`
  - Entrada: `{ email, password }`
  - Saída: `{ accessToken, refreshToken }`
- `POST /auth/refresh`
  - Entrada: `{ refreshToken }`
  - Saída: `{ accessToken }`

### Usuários / Empresa

- `POST /users/first`
  - Cria o primeiro usuário do sistema (admin) e a empresa associada.
  - Apenas permitido se ainda não existir usuário cadastrado.
- `GET /companies/me`
  - Retorna dados da empresa principal do usuário autenticado.
- `PUT /companies/me`
  - Atualiza dados básicos da empresa (nome, documento, e-mail de contato).

### Categorias

- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id` (soft delete ou inativação).

### Formas de Pagamento

- `GET /payment-methods`
- `POST /payment-methods`
- `PUT /payment-methods/:id`
- `DELETE /payment-methods/:id` (inativar).

### Lançamentos (`transactions`)

- `GET /transactions`
  - Filtros: `from`, `to`, `type`, `categoryId`, `paymentMethodId`.
- `POST /transactions`
  - Cria um lançamento de entrada (`INCOME`) ou saída (`EXPENSE`).
- `PUT /transactions/:id`
  - Atualiza um lançamento existente.
- `DELETE /transactions/:id`
  - Remove um lançamento.

### Relatórios / Dashboard

- `GET /reports/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD`
  - Retorna:
    - `totalIncomes`: soma das entradas no período.
    - `totalExpenses`: soma das saídas no período.
    - `netResult`: resultado líquido (`totalIncomes - totalExpenses`).
    - `expensesByCategory`: totais de despesas por categoria.

