import { SigninSchema, SignupSchema } from "@screen-guide/types";
import {
  signIn as signInEndpoint,
  signUp as signUpEndpoint,
} from "@/api/server";

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
