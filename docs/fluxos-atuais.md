## Fluxos Atuais do Sistema

### 1. Primeiro acesso (criação do usuário inicial)

- **Objetivo**: registrar o primeiro usuário administrador e a empresa.
- **Telas/rotas**:
  - Frontend: `/first-access`.
  - Backend: `POST /users/first`.
- **Passos**:
  - Usuário informa:
    - Nome.
    - E-mail.
    - Senha.
    - Nome da empresa.
  - Backend:
    - Verifica se já existe algum usuário.
    - Cria o usuário com senha hasheada.
    - Cria a empresa associada (ownerUserId).
- **Resultado**:
  - Usuário inicial cadastrado.
  - Pronto para realizar login em `/login`.

### 2. Login e sessão

- **Objetivo**: autenticar usuário e obter tokens JWT.
- **Telas/rotas**:
  - Frontend: `/login`.
  - Backend:
    - `POST /auth/login`.
    - `POST /auth/refresh`.
- **Passos**:
  - Usuário informa e-mail e senha.
  - Front chama `POST /auth/login`.
  - Backend valida credenciais e devolve:
    - `accessToken`.
    - `refreshToken`.
    - Dados básicos do usuário.
  - Front armazena tokens (Zustand + localStorage) e redireciona para `/dashboard`.

### 3. Configuração de categorias

- **Objetivo**: cadastrar categorias de receita e despesa para uso nos lançamentos.
- **Telas/rotas**:
  - Frontend: `/categories`.
  - Backend:
    - `GET /categories`
    - `POST /categories`
    - `PUT /categories/:id`
    - `DELETE /categories/:id`
- **Passos**:
  - Usuário acessa `/categories`.
  - Vê lista de categorias existentes.
  - Preenche nome, tipo (Receita/Despesa) e cor opcional e salva.
- **Resultado**:
  - Categorias prontas para seleção ao lançar entradas e saídas.

### 4. Configuração de formas de pagamento

- **Objetivo**: cadastrar formas de pagamento utilizadas nos lançamentos.
- **Telas/rotas**:
  - Frontend: `/payment-methods`.
  - Backend:
    - `GET /payment-methods`
    - `POST /payment-methods`
    - `PUT /payment-methods/:id`
    - `DELETE /payment-methods/:id`
- **Passos**:
  - Usuário acessa `/payment-methods`.
  - Vê lista de formas existentes.
  - Adiciona novas formas (Dinheiro, Cartão, Pix, etc.).

### 5. Lançamentos de entradas e saídas

- **Objetivo**: registrar movimentações diárias de caixa.
- **Telas/rotas**:
  - Frontend: `/transactions`.
  - Backend:
    - `GET /transactions`
    - `POST /transactions`
    - `PUT /transactions/:id`
    - `DELETE /transactions/:id`
- **Passos**:
  - Usuário acessa `/transactions`.
  - Preenche:
    - Tipo (Entrada/Saída).
    - Data.
    - Valor.
    - Categoria (compatível com o tipo).
    - Forma de pagamento.
    - Descrição opcional.
  - Lança e visualiza na tabela com filtros por período e tipo.

### 6. Dashboard (visão geral)

- **Objetivo**: visualizar rapidamente a situação do caixa.
- **Telas/rotas**:
  - Frontend: `/dashboard`.
  - Backend: `GET /reports/dashboard`.
- **Conteúdo**:
  - Cartão de **Entradas** (total de receitas).
  - Cartão de **Saídas** (total de despesas).
  - Cartão de **Resultado** (entradas – saídas).
- **Passos**:
  - Ao acessar `/dashboard`, o frontend chama `/reports/dashboard`.
  - Exibe os valores em reais, com destaque visual para resultado positivo/negativo.

