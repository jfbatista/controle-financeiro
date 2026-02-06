## Regras de Negócio – Lançamentos

### Tipos de Lançamento

- `INCOME` → entrada (receitas).
- `EXPENSE` → saída (despesas).

### Regras Gerais

- **Valor**
  - Sempre positivo (`amount > 0`).
  - O tipo (`INCOME`/`EXPENSE`) indica o sinal lógico no cálculo.

- **Data**
  - Obrigatória.
  - Deve ser uma data válida.

- **Categoria**
  - Obrigatória.
  - Categoria de entrada só pode ser usada com `INCOME`.
  - Categoria de despesa só pode ser usada com `EXPENSE`.

- **Forma de Pagamento**
  - Obrigatória.
  - Deve existir e estar ativa.

### Cálculo de Saldo

Para um período `[from, to]`:

- `totalIncomes = soma(amount) onde type = INCOME e data dentro do período`
- `totalExpenses = soma(amount) onde type = EXPENSE e data dentro do período`
- `netResult = totalIncomes - totalExpenses`

### Contas Fixas

- Cada `RecurringBill` representa uma previsão mensal.
- Pode ser usada para:
  - Pré-carregar lançamentos previstos.
  - Comparar “previsto x realizado“ (futuro).

### Exclusão

- Recomenda-se **não apagar fisicamente** lançamentos importantes.
- MVP pode usar delete físico, mas com cuidado; futuro: `isDeleted` ou `deletedAt`.

