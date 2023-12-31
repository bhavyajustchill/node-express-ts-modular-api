import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import attemptConnection from "./config/db";
import { groupRoutes } from "./utils/routeGroups";
import todoRoutes from "./modules/v1/todo/todo.route";
import { notFoundMiddleware } from "./middleware/errors.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
attemptConnection();

// API Routes
app.get("/", (req: express.Request, res: express.Response) => {
  return res.status(200).json({ message: "API is Live!" });
});
app.use(
  groupRoutes("/api/v1", (router) => {
    router.use("/todos", todoRoutes);
  })
);

// Middleware
app.use(notFoundMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
