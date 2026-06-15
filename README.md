# Hirable

A web app that enables users to create custom forms, manage responses through a centralized dashboard, and leverage AI-powered analytics to generate actionable insights from collected data.

![landing](./apps/client/public/landingImage.png)

### Features:

- Role-Based Access Control (RBAC)
- JWT authentication with access & refresh tokens
- Asynchronous email service
- Razorpay integration & Credit based system
- Custom Form builder
- RAG-powered querying of form responses
- Asynchronous embedding service
- Clean and responsive UI/UX

### Tech stack:

- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Context
- **Backend:** Express.js, Prisma, Zod, Nodemailer
- **Database:** PostgreSQL, pgvector
- **Infrastructure:** Redis, BullMQ, Docker
- **Payments:** Razorpay

### Demo:

[Demo-video](./apps/client/public/app_demo.mp4)

### Things needed to do:

- Deploy (priority)
- Rate limiting
- Search using submission id
- Credit ledger page in FE
- Responsive UI

### Limitation:

- Embedding model should be same for prevention of vector length mismatch

#### Steps to add pgvector to postgres:

```bash
docker exec -it <container-name> psql -U postgres -d app_pg
CREATE EXTENSION IF NOT EXISTS vector;
# For checking
SELECT extname FROM pg_extension;
# For table description
\d "<table-name>"
```
