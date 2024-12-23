import config from "../config";
import { sendErrorResponse } from "../helpers";
import jwt from "jsonwebtoken";
import { ExpressRouteHandler } from "../types";

type ValidatedToken =
  | {
      _id: string;
      email: string;
    }
  | undefined;

export const isAuthenticated: ExpressRouteHandler = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    sendErrorResponse(res, 401, "Not authenticated");
    return;
  }

  const token = authHeader.split(" ")[1]; // split because of Bearer prefix on the header.
  if (!token) {
    sendErrorResponse(res, 400, "Bad request");
    return;
  }
  try {
    console.log("validatedToken");
    const validatedToken = jwt.verify(
      token,
      config.jwt.secret
    ) as ValidatedToken;

    if (validatedToken) {
      req.user = { _id: validatedToken._id, email: validatedToken.email };
      next();
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return sendErrorResponse(res, 401, "Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return sendErrorResponse(res, 401, "Invalid token");
    }

    console.error("Authentication error:", error);
    return sendErrorResponse(res, 500, "Internal server error");
  }
};
