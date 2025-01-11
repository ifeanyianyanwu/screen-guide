import express from "express";
import { authRoute } from "./auth.router";
import { userRoute } from "./user.router";

const router = express.Router();

export default (): express.Router => {
  authRoute(router);
  userRoute(router);

  return router;
};
