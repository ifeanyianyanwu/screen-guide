import { config as dotenvConfig } from "dotenv";

// Load environment variables at startup
dotenvConfig();

// Type definitions for our config
interface Config {
  server: {
    port: number;
    nodeEnv: "development" | "production" | "test";
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  database: {
    uri: string;
    username?: string;
    password?: string;
  };
}

// Helper function for required values
function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Create and validate config object
export const config: Config = {
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: (process.env.NODE_ENV ||
      "development") as Config["server"]["nodeEnv"],
  },
  jwt: {
    secret: requireEnvVar("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  },
  database: {
    uri: requireEnvVar("MONGODB_URI"),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
} as const;

// Validate the config values
function validateConfig(config: Config) {
  // Validate port number
  if (isNaN(config.server.port) || config.server.port <= 0) {
    throw new Error("Invalid PORT configuration");
  }

  // Validate node environment
  if (!["development", "production", "test"].includes(config.server.nodeEnv)) {
    throw new Error("Invalid NODE_ENV configuration");
  }

  // Validate JWT expiration
  if (!/^\d+[smhd]$/.test(config.jwt.expiresIn)) {
    throw new Error("Invalid JWT_EXPIRES_IN format. Use format: 1h, 30m, etc.");
  }
}

// Run validation
validateConfig(config);

// Export a frozen config object to prevent modifications
export default Object.freeze(config);
