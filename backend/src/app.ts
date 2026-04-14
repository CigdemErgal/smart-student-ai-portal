//------------------DAY 1----------//
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./user/routes/auth.routes";
import studentRoutes from "./modules/student/routes/student.routes";

const app = express();
//health route ekle,json formatında {status: 'ok'} döndürsün
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);

export default app;
