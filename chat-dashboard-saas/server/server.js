import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./auth.js";
import chatwootRouter from "./chatwoot.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET is not set in server/.env");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRouter);
app.use("/api", chatwootRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SaaS backend running on http://localhost:${PORT}`);
});
