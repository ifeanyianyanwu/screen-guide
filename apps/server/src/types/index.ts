import { NextFunction, Response, Request } from "express";

interface CustomRequest extends Request {
  user?: { _id: string; email: string };
}

export type ExpressRouteHandler = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => Promise<Response | void> | void;

export interface User {
  email: string;
  password: string;
  watchList: {
    items: {
      name: string;
      imageUrl: string;
      rating: number;
      releaseDate: string;
    }[];
  };
}
