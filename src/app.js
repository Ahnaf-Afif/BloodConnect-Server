import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { isDBConnected } from "./config/db.js";
import { setupServer } from "./config/setup.js";
import authRoutes from "./modules/auth/auth.routes.js";
import donationRequestRoutes from "./modules/donationRequests/donationRequests.routes.js";
import profileRoutes from "./modules/profiles/profiles.routes.js";
import userRoutes from "./routes/users.routes.js";
import fundRoutes from "./routes/funds.routes.js";
import contactRoutes from "./routes/contacts.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(async (req, res, next) => {
  try {
    await setupServer();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/donation-requests", donationRequestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/contacts", contactRoutes);

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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const isInvalidJson = error.type === "entity.parse.failed";

  return res.status(isInvalidJson ? 400 : 500).json({
    success: false,
    message: isInvalidJson
      ? "Request body is not valid JSON"
      : "Server could not process the request",
  });
});

export default app;
