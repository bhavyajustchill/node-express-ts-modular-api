import { Request, Response, NextFunction } from "express";

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route Not Found!" });
};
