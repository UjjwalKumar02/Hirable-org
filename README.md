# Hirable

A saas platform featuring a custom form builder, centralized response management, and AI-powered analytics over response data.

![landing](./apps/client/public/landingImage.png)

### Features:

- Role-Based Access Control (RBAC)
- JWT authentication with access & refresh tokens
- Asynchronous email service
- Razorpay payment integration
- Credit system with ledger tracking
- Dynamic form builder
- RAG-powered querying of form responses
- Independent embedding service
- Clean and responsive UI/UX
- API rate limiting

### Tech stack:

- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Context
- **Backend:** Express.js, Prisma, Zod, Nodemailer
- **Database:** PostgreSQL, pgvector
- **Infrastructure:** Redis, BullMQ, Docker
- **Payments:** Razorpay

### Demo:

[Demo-video](./apps/client/public/demo.mp4)

### Things needed to do:

- Deploy (priority)
- Rate limiting
- Form context and dynamic sidebar
- Search using submission id

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
