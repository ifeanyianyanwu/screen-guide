import { createUser, getUserByEmail } from "../database/models/user.model";
import { ExpressRouteHandler } from "../types";
import bcrypt from "bcryptjs";
import { SigninSchema, SignupSchema } from "@screen-guide/types";
import jwt from "jsonwebtoken";
import config from "../config";

const SALT_ROUNDS = 12;

export const signup: ExpressRouteHandler = async (req, res) => {
  try {
    const validationResult = SignupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        errors: validationResult.error.errors.map((item) => item.message),
      });
    }

    const { email, password } = validationResult.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser)
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await createUser({
      email,
      password: hashedPassword,
      watchList: { items: [] },
    });

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      data: { _id: user._id, email: user.email, token },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const signin: ExpressRouteHandler = async (req, res) => {
  try {
    const validationResult = SigninSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        errors: validationResult.error.errors.map((item) => item.message),
      });
    }

    const { email, password } = validationResult.data;

    const existingUser = await getUserByEmail(email);

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { _id: existingUser._id, email: existingUser.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { _id: existingUser._id, email: existingUser.email, token },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
