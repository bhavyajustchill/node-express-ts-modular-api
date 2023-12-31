import express, { Router } from "express";

export const groupRoutes = (baseRoute: string, routesCallback: (router: Router) => void) => {
  const router = express.Router();
  routesCallback(router);
  return express.Router().use(baseRoute, router);
};
