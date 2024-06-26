import { Lucia } from "lucia";
import adapter from "./db/adapter";
import { cookies } from "next/headers";
import { cache } from "react";
import db from "./db";
import { eq } from "drizzle-orm";
import { userTable } from "./db/schema";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId)
    return {
      user: null,
      session: null,
    };

  const { user, session } = await lucia.validateSession(sessionId);

  let userData = null;

  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    userData = await db.query.userTable.findFirst({
      where: eq(userTable.id, user?.id ?? ""),
    });
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return { user, session, userData };
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
