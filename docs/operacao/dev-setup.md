## Guia de Setup para Desenvolvimento

### 1. Pré-requisitos

- Node.js LTS instalado.
- Acesso ao banco MySQL configurado no provedor (`jdiweb.com.br`).
- Git configurado e repositório clonado.

### 2. Clonar o repositório

```bash
git clone https://github.com/jfbatista/controle-financeiro.git
cd controle-financeiro
```

Em ambiente local atual, o código está em:

- `D:\svn\Fluxo_caixa`

### 3. Backend (API NestJS)

1. Entrar na pasta:

```bash
cd backend
```

2. Copiar `.env.example` para `.env` e ajustar valores:

```bash
cp .env.example .env
```

- Definir `DATABASE_URL` e `SHADOW_DATABASE_URL` com usuário/senha corretos.
- Definir `JWT_SECRET` e `REFRESH_JWT_SECRET` com chaves fortes.

3. Instalar dependências:

```bash
npm install
```

4. Aplicar schema do Prisma no banco:

- Em ambiente de desenvolvimento atual já foi feito via `prisma migrate dev`.
- Para novo ambiente:

```bash
npx prisma migrate deploy
```

5. Subir API em modo desenvolvimento:

```bash
npm run start:dev
```

A API ficará disponível em `http://localhost:3000`.

### 4. Frontend (React + Vite)

1. Entrar na pasta:

```bash
cd ../frontend
```

2. Criar arquivo `.env` (se necessário) com a URL da API:

```bash
VITE_API_URL="http://localhost:3000"
```

3. Instalar dependências:

```bash
npm install
```

4. Subir o app em modo desenvolvimento:

```bash
npm run dev
```

O frontend ficará em `http://localhost:5173`.

### 5. Teste rápido do fluxo

1. Acessar `http://localhost:5173/first-access` e criar o usuário/empresa inicial.
2. Acessar `http://localhost:5173/login` e realizar login.
3. Em seguida:
   - Acessar `/categories` e criar algumas categorias de receita e despesa.
   - Acessar `/payment-methods` e cadastrar formas de pagamento.
   - Acessar `/transactions` e lançar entradas/saídas.
   - Acessar `/dashboard` para ver os totais.

