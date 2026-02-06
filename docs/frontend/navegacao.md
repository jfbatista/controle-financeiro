## Navegação e Telas do Frontend

### Rotas Principais

- `/login`
  - Tela de autenticação.
- `/`
  - Redireciona para `/dashboard` quando logado.
- `/dashboard`
  - Visão geral com cards e gráficos.
- `/lancamentos`
  - Lista e filtro de lançamentos.
- `/lancamentos/novo`
  - Formulário para novo lançamento.
- `/contas-fixas`
  - Cadastro de contas recorrentes.
- `/configuracoes`
  - Sub-seções:
    - `/configuracoes/empresa`
    - `/configuracoes/categorias`
    - `/configuracoes/formas-pagamento`

### Padrões de UI

- **Desktop**
  - Sidebar fixa (Dashboard, Lançamentos, Contas Fixas, Relatórios, Configurações).
  - Conteúdo central em cards.

- **Mobile**
  - Header simplificado + menu hamburguer ou bottom nav.
  - Campos grandes, botões fáceis de tocar.

### Fluxos Principais

- **Primeiro acesso**
  - Usuário loga.
  - Sistema pede confirmação/cadastro da empresa e categorias iniciais.
- **Uso diário**
  - Acessa `/lancamentos`.
  - Lança entradas/saídas do dia.
  - Volta ao `/dashboard` para ver situação do caixa.

