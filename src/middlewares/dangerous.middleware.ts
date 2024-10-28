import { Request, Response, NextFunction } from "express";

export const stopBackendMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "Stopping Backend! None of the APIs will work from now!",
  });
  process.exit(0);
};
