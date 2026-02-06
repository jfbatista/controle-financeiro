## Visão Geral do Sistema de Controle Financeiro

**Nome interno**: Controle Financeiro  
**Público-alvo**: pequenos comércios (açaíterias, lanchonetes, salões,
lojas locais, MEIs etc.).

- Gráficos automatizados.
- Navegação simples, quase “tipo app”.
- Foco em donos de pequenos negócios que não dominam Excel.

### Objetivo do Sistema

- Ter todas as **entradas e saídas** da empresa consolidadas em um
  único lugar.
- Mostrar **saldo, receitas, despesas e lucro/prejuízo** de forma
  simples, visual e acessível.
- Funcionar bem em **navegador desktop** e **smartphone** (PWA).

### Funcionalidades do MVP

- **Autenticação**
  - Login com e-mail e senha.
  - Sessão baseada em JWT (access + refresh tokens).

- **Configurações**
  - Cadastro da **empresa** (nome, documento, contato).
  - Cadastro de **categorias** (receitas e despesas).
  - Cadastro de **formas de pagamento** (dinheiro, cartão, Pix, boleto etc.).

- **Lançamentos**
  - Registro de **entradas** (vendas/recebimentos).
  - Registro de **saídas** (despesas/pagamentos).
  - Filtros por data, tipo, categoria, forma de pagamento.

- **Contas Fixas (Recorrentes)**
  - Cadastro de contas mensais recorrentes (aluguel, internet, folha,
    impostos etc.).
  - Base para previsões de fluxo de caixa.

- **Dashboard**
  - Saldo do período.
  - Total de receitas e despesas.
  - Lucro ou prejuízo.
  - Gráfico de barras (entradas x saídas).
  - Gráfico de pizza (distribuição de despesas por categoria).

- **Relatórios básicos**
  - Lista de lançamentos com filtros.
  - Resumo por período (ex.: mês atual, mês anterior).

### Futuras Evoluções (pós-MVP)

- Múltiplos usuários por empresa.
- Perfis de permissão.
- Exportação para Excel/CSV.
- Relatórios mais avançados (ex.: DRE simplificado).
- Plano de assinatura (modo SaaS).

