import "server-only";
import { jwtVerify } from "jose";
import { serverConfig } from "@/lib/server-config";

export async function verifyJwt(input: string) {
  const secret = serverConfig.serverJwtSecret;
  if (!secret) {
    throw new Error("SERVER_JWT_SECRET is not defined");
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
