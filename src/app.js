import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { isDBConnected } from "./config/db.js";
import authRoutes from "./modules/auth/auth.routes.js";
import profileRoutes from "./modules/profiles/profiles.routes.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("Blood donation server is running");
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    database: isDBConnected() ? "connected" : "not connected",
  });
});

export default app;
