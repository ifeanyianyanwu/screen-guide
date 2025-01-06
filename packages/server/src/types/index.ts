import { NextFunction, Response, Request } from "express";

interface CustomRequest extends Request {
  user?: { _id: string; email: string };
}

export type ExpressRouteHandler = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => Promise<Response | void> | void;
