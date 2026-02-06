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

