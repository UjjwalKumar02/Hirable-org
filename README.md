# Hirable

A web app that lets users create custom forms, manage responses from a centralized dashboard, and use AI-powered analytics to extract actionable insights from collected data.

![landing](./apps/client/public/landingImage.png)

### Features:

- Role-Based Access Control (RBAC) with JWT authentication
- Custom Form builder
- Asynchronous email and embedding services
- RAG-powered querying of form responses
- Razorpay integration with a credit-based system
- Clean and responsive UI

### Tech stack:

- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Context
- **Backend:** Express.js, Prisma, Zod, Nodemailer, ioredis, @google/genai
- **Database:** PostgreSQL, pgvector
- **Infrastructure:** Redis, BullMQ, Docker
- **LLM API:** Gemini
- **Payments:** Razorpay

### Demo:

[Demo-video](./apps/client/public/app_demo.mp4)

### Things needed to do:

- Deploy (priority)
- Rate limiting
- Responsive UI

### Limitation:

- Embedding model should be same for prevention of vector length mismatch

<!-- #### Steps to add pgvector to postgres:

```bash
docker exec -it <container-name> psql -U postgres -d app_pg
CREATE EXTENSION IF NOT EXISTS vector;
# For checking
SELECT extname FROM pg_extension;
# For table description
\d "<table-name>"
``` -->
