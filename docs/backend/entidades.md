## Entidades de Domínio (Backend + Banco de Dados)

### User

Representa um usuário do sistema (uso interno).

Campos principais:

- `id` (string/UUID ou int)
- `name`
- `email` (único)
- `passwordHash`
- `isActive`
- `createdAt`
- `updatedAt`

### Company

Empresa à qual os dados financeiros pertencem.

Campos principais:

- `id`
- `name`
- `document` (CNPJ/CPF, opcional)
- `contactEmail` (opcional)
- `ownerUserId` (FK para `User`)
- `createdAt`
- `updatedAt`

### Category

Categoria de lançamento (receita ou despesa).

Campos principais:

- `id`
- `companyId` (FK para `Company`)
- `name`
- `type` (`INCOME` | `EXPENSE`)
- `color` (para gráficos)
- `isActive`
- `createdAt`
- `updatedAt`

### PaymentMethod

Forma de pagamento.

Campos:

- `id`
- `companyId`
- `name` (ex.: Dinheiro, Cartão Crédito, Pix)
- `isActive`
- `createdAt`
- `updatedAt`

### Transaction

Lançamento de entrada ou saída.

Campos:

- `id`
- `companyId`
- `type` (`INCOME` | `EXPENSE`)
- `categoryId`
- `paymentMethodId`
- `date`
- `amount` (sempre positivo)
- `description` (opcional)
- `createdByUserId`
- `createdAt`
- `updatedAt`

### RecurringBill

Conta fixa (recorrente) mensal.

Campos:

- `id`
- `companyId`
- `type` (`INCOME` | `EXPENSE`)
- `categoryId`
- `amountExpected`
- `dueDay` (1–31)
- `description`
- `isActive`
- `createdAt`
- `updatedAt`

