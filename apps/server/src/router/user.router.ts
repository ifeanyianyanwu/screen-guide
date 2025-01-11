import { isAuthenticated } from "../middleware/is-auth";
import {
  addToWatchList,
  getWatchList,
  removeFromWatchList,
} from "../controllers/user.controller";
import express, { RequestHandler } from "express";

export const userRoute = (router: express.Router) => {
  router.post(
    "/user/addToWatchList",
    isAuthenticated as RequestHandler,
    addToWatchList as RequestHandler
  );
  router.patch(
    "/user/removeFromWatchList/:id",
    isAuthenticated as RequestHandler,
    removeFromWatchList as RequestHandler
  );
  router.get(
    "/user/getWatchList",
    isAuthenticated as RequestHandler,
    getWatchList as RequestHandler
  );
};
