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
