import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import attemptConnection from "./config/db.config";
import {
  notFoundMiddleware,
  internalServerErrorMiddleware,
} from "./middlewares/errors.middleware";
import { stopBackendMiddleware } from "./middlewares/dangerous.middleware";
import { groupRoutes } from "./utils/group-routes";
import todoRoutes from "./modules/v1/todo/todo.route";
import userRoutes from "./modules/v1/user/user.route";
import paymentRoutes from "./modules/v1/payment/payment.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
    router.use("/auth", userRoutes);
    router.use("/payment", paymentRoutes);
  })
);

// Middleware
app.post("/dangerous/stop/backend", stopBackendMiddleware);
app.use(notFoundMiddleware);
app.use(internalServerErrorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
