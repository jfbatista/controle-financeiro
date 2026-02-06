## Guia de Deploy (Visão Inicial)

### Backend (NestJS + MySQL)

1. **Configurar variáveis de ambiente no servidor**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `REFRESH_JWT_SECRET`
   - `NODE_ENV=production`

2. **Instalar dependências e build**
   - `npm install`
   - `npm run build`

3. **Rodar migrations Prisma**
   - `npx prisma migrate deploy`

4. **Subir serviço Node**
   - Usar PM2, Docker ou serviço gerenciado.

### Frontend (React + Vite)

1. **Definir URL da API** em variável de ambiente (ex.: `VITE_API_URL`).
2. **Build de produção**
   - `npm install`
   - `npm run build`
3. **Servir arquivos estáticos**
   - Nginx, serviço de static hosting, etc.

### Checklist Pós-Deploy

- Login funciona?
- Lançamento de entrada/saída funciona?
- Dashboard mostra valores condizentes?
- Layout está ok em desktop e smartphone?

