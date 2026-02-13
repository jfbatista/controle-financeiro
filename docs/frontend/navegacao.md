## Navegação e Telas do Frontend

### Rotas Principais

- `/login`
  - Tela de autenticação.
- `/first-access`
  - Tela de criação do primeiro usuário + empresa.
- `/dashboard`
  - Visão geral com cards de entradas, saídas e resultado.
- `/transactions`
  - Lista, filtro e criação de lançamentos.
- `/categories`
  - Cadastro e listagem de categorias (receitas e despesas).
- `/payment-methods`
  - Cadastro e listagem de formas de pagamento.

### Padrões de UI

- **Desktop**
  - Sidebar fixa (Dashboard, Lançamentos, Contas Fixas, Relatórios, Configurações).
  - Conteúdo central em cards.

- **Mobile**
  - Header simplificado + menu hamburguer ou bottom nav.
  - Campos grandes, botões fáceis de tocar.

### Fluxos Principais

- **Primeiro acesso**
  - Usuário acessa `/first-access` e cria o primeiro usuário e empresa.
  - Em seguida, faz login em `/login`.
- **Uso diário**
  - Faz login em `/login`.
  - Acessa `/transactions` para lançar entradas/saídas do dia.
  - Consulta `/dashboard` para ver situação do caixa (entradas, saídas, resultado).

