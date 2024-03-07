"use server";

import { cookies } from "next/headers";
import { lucia } from "../auth";
import { Session, User, generateId } from "lucia";
import { db } from "../db";
import { users } from "../db/schema/users";
import { Argon2id } from "oslo/password";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export const validateRequest = async (): Promise<
  | {
      user: User;
      session: Session;
    }
  | {
      user: null;
      session: null;
    }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return { user: null, session: null };
  }
  const result = await lucia.validateSession(sessionId);
  const { session, user } = result;
  if (session && session.fresh) {
    const { id } = await lucia.createSession(user.id, {});
    const { name, value, attributes } = lucia.createSessionCookie(id);
    cookies().set(name, value, attributes);
  }
  if (!session) {
    const { name, value, attributes } = lucia.createBlankSessionCookie();
    cookies().set(name, value, attributes);
  }
  return result;
};

export const registerUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const id = generateId(15);
  const hashedPassword = await new Argon2id().hash(password);
  await db.insert(users).values({ id, email, hashedPassword });
  const { id: sessionId } = await lucia.createSession(id, {});
  const { name, value, attributes } = lucia.createSessionCookie(sessionId);
  cookies().set(name, value, attributes);
  revalidatePath("/");
  redirect("/");
};

export const loginUser = async ({ email }: { email: string }) => {
  const [{ id }] = await db.select().from(users).where(eq(users.email, email));
  const { id: sessionId } = await lucia.createSession(id, {});
  const { name, value, attributes } = lucia.createSessionCookie(sessionId);
  cookies().set(name, value, attributes);
  revalidatePath("/");
  redirect("/");
};

export const isEmailExists = async ({ email }: { email: string }) => {
  const emails = await db.select({ email: users.email }).from(users);
  return emails.every((e) => e.email !== email);
};

export const logout = async () => {
  const { session } = await validateRequest();
  if (!session) {
    return new Response(null, { status: 401 });
  }
  await lucia.invalidateSession(session.id);
  const { name, value, attributes } = lucia.createBlankSessionCookie();
  cookies().set(name, value, attributes);
  redirect("/login");
};

export const isUserExists = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const [user] = await db
    .select({ hashedPassword: users.hashedPassword })
    .from(users)
    .where(eq(users.email, email));
  if (!user) {
    return false;
  }
  return await new Argon2id().verify(user.hashedPassword, password);
};
