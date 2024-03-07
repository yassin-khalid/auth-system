import { type Config } from "drizzle-kit";

export default {
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_TOKEN,
  },
  schema: "server/db/schema",
} satisfies Config;
