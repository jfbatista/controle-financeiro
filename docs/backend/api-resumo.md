## API – Resumo de Endpoints (MVP)

### Autenticação

- `POST /auth/login`
  - Entrada: `{ email, password }`
  - Saída: `{ accessToken, refreshToken }`
- `POST /auth/refresh`
  - Entrada: `{ refreshToken }`
  - Saída: `{ accessToken }`

### Usuários / Empresa

- `GET /me`
  - Retorna dados do usuário autenticado.
- `GET /companies/me`
  - Retorna dados da empresa principal do usuário.
- `PUT /companies/me`
  - Atualiza dados básicos da empresa.

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
  - Filtros: `from`, `to`, `type`, `categoryId`, `paymentMethodId`, paginação.
- `POST /transactions`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`

### Contas Fixas (`recurring-bills`)

- `GET /recurring-bills`
- `POST /recurring-bills`
- `PUT /recurring-bills/:id`
- `DELETE /recurring-bills/:id`

### Relatórios / Dashboard

- `GET /reports/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD`
  - Saldos, totais, lucro/prejuízo.
- `GET /reports/categories?from=...&to=...`
  - Totais por categoria.

