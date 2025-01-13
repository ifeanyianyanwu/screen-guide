import { SigninSchema, SignupSchema } from "@screen-guide/types";
import {
  signIn as signInEndpoint,
  signUp as signUpEndpoint,
} from "@/api/server";
import { jwtVerify } from "jose";
import { appConfig } from "@/lib/config";

export async function signIn(formData: FormData) {
  const validationResult = SigninSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((item) => item.message);
    throw errors;
  }

  const res = await signInEndpoint(validationResult.data);
  return res;
}

export async function signUp(formData: FormData) {
  const validationResult = SignupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((item) => item.message);
    throw errors;
  }

  const res = await signUpEndpoint(validationResult.data);
  return res;
}

export async function verifyJwt(input: string) {
  const secret = appConfig.serverJwtSecret;
  if (!secret) {
    throw new Error("AUTH_SECRET is not defined");
  }

  // Convert string secret to Uint8Array
  const secretKey = new TextEncoder().encode(secret);

  try {
    await jwtVerify(input, secretKey);
    return true;
  } catch {
    return false;
  }
}
