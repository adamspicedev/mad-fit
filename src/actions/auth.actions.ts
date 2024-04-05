"use server";

import { SignInSchema, SignUpSchema } from "@/types";
import { z } from "zod";
import * as Argon2 from "argon2";
import { generateId } from "lucia";
import db from "@/lib/db";
import { emailVerificationTable, userTable } from "@/lib/db/schema";
import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/email";
import { generateCodeVerifier, generateState } from "arctic";
import { google } from "@/lib/lucia/oauth";

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

    const code = generateCode();

    await db.insert(emailVerificationTable).values([
      {
        userId,
        code,
        id: generateId(15),
        sentAt: new Date(),
      },
    ]);

    const token = createToken(values.email, userId, code);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`;

    await sendEmail({
      html: `<a href="${url}">Verify your email</a>`,
      subject: "Verify your email",
      to: values.email,
    });

    return {
      success: true,
      data: { userId },
    };
  } catch (error: any) {
    return {
      error: error?.message,
      key: "user_username_unique",
    };
  }
};

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  const existingUser = await db.query.userTable.findFirst({
    where: (table) => eq(table.email, values.email),
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

  const isValidPassword = await Argon2.verify(
    existingUser.hashedPassword,
    values.password
  );

  if (!isValidPassword) {
    return {
      error: "Invalid credentials",
    };
  }

  if (existingUser.isEmailVerified === false) {
    return {
      error: "Email not verified",
      key: "email_not_verified",
    };
  }

  await createSessionCookie(existingUser.id);

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

export const resendVerificationEmail = async (email: string) => {
  try {
    const existingUser = await db.query.userTable.findFirst({
      where: (table) => eq(table.email, email),
    });

    if (!existingUser) {
      return {
        error: "User not found",
      };
    }

    if (existingUser.isEmailVerified === true) {
      return {
        error: "Email already verified",
      };
    }

    const existingCode = await db.query.emailVerificationTable.findFirst({
      where: eq(emailVerificationTable.userId, existingUser.id),
    });

    if (!existingCode) {
      return {
        error: "Code not found",
      };
    }

    const sentAt = new Date(existingCode.sentAt);
    const hasOneMinuteHasPassed =
      new Date().getTime() - sentAt.getTime() > 60000; // 1 minute

    if (!hasOneMinuteHasPassed) {
      return {
        error:
          "An email has already been sent, you can send another  in " +
          (60 - Math.floor((new Date().getTime() - sentAt.getTime()) / 1000)) +
          " seconds",
      };
    }

    const code = generateCode();

    await db
      .update(emailVerificationTable)
      .set({
        code,
        sentAt: new Date(),
      })
      .where(eq(emailVerificationTable.userId, existingUser.id));

    const token = createToken(email, existingUser.id, code);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`;

    await sendEmail({
      html: `<a href="${url}">Verify your email</a>`,
      subject: "Verify your email",
      to: email,
    });

    return {
      success: "Email sent",
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const createGoogleAuthorizationURL = async () => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true,
    });

    cookies().set("state", state, {
      httpOnly: true,
    });

    const authorizationURL = await google.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile"],
      }
    );

    return {
      success: true,
      data: authorizationURL,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

const createSessionCookie = async (userId: string) => {
  const session = await lucia.createSession(userId, {
    expiresIn: 60 * 60 * 24 * 30,
  });

  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};

const createToken = (email: string, userId: string, code: string) =>
  jwt.sign({ email: email, userId, code }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

const generateCode = () => Math.random().toString(36).slice(2, 8);
