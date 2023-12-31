import mongoose, { Schema, Document } from "mongoose";
import { Todo as TodoInterface } from "./todo.interface";

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: false }
);

interface TodoDocument extends TodoInterface, Document {}

const TodoModel = mongoose.model<TodoDocument>("Todo", TodoSchema);

export default TodoModel;
