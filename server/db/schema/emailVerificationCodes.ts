import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const emailVerificationCodes = sqliteTable("email_verification_code", {
  id: integer("id", { mode: "number" })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  code: text("code").notNull(),
  userId: text("user_id")
    .unique()
    .references(() => users.id),
  email: text("email").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
