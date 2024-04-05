import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { emailVerificationTable, userTable } from "@/lib/db/schema";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);

    const token = url.searchParams.get("token");

    if (!token) {
      return Response.json({ error: "Token not found" }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
      code: string;
      userId: string;
    };

    const emailVerificationQueryResult =
      await db.query.emailVerificationTable.findFirst({
        where:
          eq(emailVerificationTable.code, decoded.code) &&
          eq(emailVerificationTable.userId, decoded.userId),
      });

    if (!emailVerificationQueryResult) {
      return Response.json({ error: "Token is invalid" }, { status: 400 });
    }

    await db
      .delete(emailVerificationTable)
      .where(
        eq(emailVerificationTable.code, decoded.code) &&
          eq(emailVerificationTable.userId, decoded.userId)
      );

    const updateUser = await db
      .update(userTable)
      .set({ isEmailVerified: true })
      .where(eq(userTable.id, decoded.userId));

    const session = await lucia.createSession(decoded.userId, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return Response.redirect(
      new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`).toString()
    );
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
};
