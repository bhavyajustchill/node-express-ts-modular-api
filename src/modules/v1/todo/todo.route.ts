import express from "express";
import { createTodo, getTodos, getTodoById, updateTodo, deleteTodo } from "./todo.controller";
import { authenticateToken } from "../../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authenticateToken, createTodo);
router.get("/", authenticateToken, getTodos);
router.get("/:id", authenticateToken, getTodoById);
router.put("/:id", authenticateToken, updateTodo);
router.delete("/:id", authenticateToken, deleteTodo);

export default router;
