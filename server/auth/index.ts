import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "../db";
import { sessions } from "../db/schema/sessions";
import { users } from "../db/schema/users";
import { Lucia } from "lucia";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);
export const lucia = new Lucia(adapter, {
  getUserAttributes: ({ email, email_verified }) => ({
    email,
    emailVerified: email_verified,
  }),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      email_verified: boolean;
    };
  }
}
