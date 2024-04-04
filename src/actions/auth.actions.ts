"use server";

import { SignInSchema, SignUpSchema } from "@/types";
import { z } from "zod";
import * as Argon2 from "argon2";
import { generateId } from "lucia";
import db from "@/lib/db";
import { userTable } from "@/lib/db/schema";
import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  const hashedPassword = await Argon2.hash(values.password);
  const userId = generateId(15);
  try {
    await db.insert(userTable).values([
      {
        id: userId,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        hashedPassword,
      },
    ]);

    const code = Math.random().toString(36).slice(2, 8);

    const token = jwt.sign(
      { email: values.email, code },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

    return {
      success: true,
      data: { userId },
    };
  } catch (error: any) {
    return {
      error:
        error.message ===
        'duplicate key value violates unique constraint "user_username_unique"'
          ? "User already exists"
          : error?.message,
    };
  }
};

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  const existingUser = await db.query.userTable.findFirst({
    where: (table) => eq(table.username, values.username),
  });

  if (!existingUser) {
    return {
      error: "User does not exist",
    };
  }

  if (!existingUser.hashedPassword) {
    return {
      error: "User does not exist",
    };
  }

  const isValidPassword = await new Argon2id().verify(
    existingUser.hashedPassword,
    values.password
  );

  if (!isValidPassword) {
    return {
      error: "Invalid credentials",
    };
  }

  const session = await lucia.createSession(existingUser.id, {
    expiresIn: 60 * 60 * 24 * 30,
  });

  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return { success: "User logged in successfully" };
};

export const signOut = async () => {
  try {
    const { session } = await validateRequest();

    if (!session)
      return {
        error: "Unauthorized",
      };

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};
