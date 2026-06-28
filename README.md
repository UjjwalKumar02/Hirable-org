# Hirable

A form management platform that enables users to create custom forms, manage responses from a centralized dashboard, and leverage AI-powered analytics to extract actionable insights from collected data.

![landing](./apps/client/public/landingImage.png)

### Features:

- Role-Based Access Control (RBAC) with JWT authentication
- Custom Form builder
- Asynchronous email and embedding services
- RAG-powered querying of form responses
- Razorpay integration with a credit-based system
- Clean and responsive UI

### Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Context API
- **Backend:** Express.js, Prisma, Zod, Nodemailer, ioredis, @google/genai
- **Database:** PostgreSQL + pgvector
- **Message Queue:** Upstash Redis
- **LLM API:** Gemini
- **Payments:** Razorpay
- **Deployment:** Vercel & Render

### Demo:

[Demo-video](./apps/client/public/app_demo.mp4)

<!-- ### Things needed to do:

- Deploy (priority)
- Rate limiting
- Responsive UI -->

<!-- ### Limitation:

- Embedding model should be same for prevention of vector length mismatch -->

<!-- #### Steps to add pgvector to postgres:

```bash
docker exec -it <container-name> psql -U postgres -d app_pg
CREATE EXTENSION IF NOT EXISTS vector;
# For checking
SELECT extname FROM pg_extension;
# For table description
\d "<table-name>"
``` -->
