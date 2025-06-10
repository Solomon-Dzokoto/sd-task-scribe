import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import { testConnection } from "./utils/db";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5175",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Task Management API is running" });
});

// Mount auth routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Error handling
const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  console.error("Error details:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  if (err?.name === "ZodError") {
    res.status(400).json({ error: "Invalid input data", details: err });
    return;
  }

  if (err?.name === "PrismaClientKnownRequestError") {
    res.status(400).json({ error: "Database operation failed" });
    return;
  }

  res.status(500).json({ error: "Something broke!" });
};

app.use(errorHandler);

const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error("Could not connect to database");
    }

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
