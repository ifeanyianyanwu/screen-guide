import { signin, signup } from "../controllers/auth.controller";
import express, { RequestHandler } from "express";

export const authRoute = (router: express.Router) => {
  router.post("/auth/signup", signup as RequestHandler);
  router.post("/auth/signin", signin as RequestHandler);
};
