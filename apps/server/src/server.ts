import express, { type Request, type Response } from "express";
import authRouter from "./modules/auth/routes/auth.route.js";
import adminRouter from "./modules/admin/routes/admin.route.js";
import creditRouter from "./modules/credit/routes/credit.route.js";
import paymentRouter from "./modules/payment/routes/payment.route.js";
import formRouter from "./modules/form/routes/form.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

const PORT = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: [process.env.FE_URL!, "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/credit", creditRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/form", formRouter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Health route is fine." });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
