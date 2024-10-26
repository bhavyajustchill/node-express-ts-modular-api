import { Request, Response } from "express";
import TodoModel from "./todo.model";
import { Todo } from "./todo.interface";
import { todoValidation } from "./todo.validation";

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { error, value } = await todoValidation.validateAsync(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const todoData: Todo = value;
    const todo = new TodoModel(todoData);
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos: Todo[] = await TodoModel.find();
    res.status(200).json(todos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const todo: Todo | null = await TodoModel.findById(id);
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
    const { error, value } = await todoValidation.validateAsync(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const updatedTodo: Todo | null = await TodoModel.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!updatedTodo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    res.status(200).json({
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
    const deletedTodo: Todo | null = await TodoModel.findByIdAndRemove(id);
    if (!deletedTodo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    res.status(200).json({ message: "Todo deleted successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
