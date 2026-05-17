import express, { type Request, type Response } from "express";
import "dotenv/config";
import authRouter from "./modules/auth/routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Health is fine." });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
