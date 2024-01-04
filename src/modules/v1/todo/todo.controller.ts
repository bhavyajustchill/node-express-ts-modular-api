import { Request, Response } from "express";
import TodoModel from "./todo.model";
import { Todo as TodoInterface } from "./todo.interface";

export const createTodo = async (req: Request, res: Response) => {
  try {
    const todoData: TodoInterface = req.body;
    const todo = new TodoModel(todoData);
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos: TodoInterface[] = await TodoModel.find();
    res.status(200).json(todos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const todo: TodoInterface | null = await TodoModel.findById(id);
    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    res.status(200).json(todo);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedTodo: TodoInterface | null = await TodoModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedTodo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    res
      .status(200)
      .json({
        message: "Todo Updated successfully!",
        updatedTodo: updatedTodo,
      });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedTodo: TodoInterface | null = await TodoModel.findByIdAndRemove(
      id
    );
    if (!deletedTodo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    res.status(200).json({ message: "Todo deleted successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
