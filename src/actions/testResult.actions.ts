"use server";

import { validateRequest } from "@/lib/auth";
import db from "@/lib/db";
import { testResultsTable } from "@/lib/db/schema";
import { TestResultSchema } from "@/types";
import exp from "constants";
import { and, asc, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";

export const createTestResult = async (
  values: z.infer<typeof TestResultSchema>
) => {
  try {
    const { user } = await validateRequest();

    if (!user) return { error: "Unauthorized" };

    const existingTestResult = await db.query.testResultsTable.findFirst({
      where: (table) =>
        and(eq(table.userId, user.id), eq(table.date, new Date(values.date))),
    });

    if (!existingTestResult) {
      await db.insert(testResultsTable).values([
        {
          id: generateId(15),
          userId: user.id,
          date: new Date(values.date),
          pressUps: values.pressUps?.toString(),
          parkLap: values.parkLap?.toString(),
          stepUp: values.stepUp?.toString(),
          sledPush: values.sledPush?.toString(),
          chestPress: values.chestPress?.toString(),
          plank: values.plank?.toString(),
        },
      ]);
    } else {
      await db
        .update(testResultsTable)
        .set({
          pressUps: values.pressUps?.toString(),
          parkLap: values.parkLap?.toString(),
          stepUp: values.stepUp?.toString(),
          sledPush: values.sledPush?.toString(),
          chestPress: values.chestPress?.toString(),
          plank: values.plank?.toString(),
        })
        .where(eq(testResultsTable.id, existingTestResult.id));
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const getTestResultsForCurrentUser = async () => {
  try {
    const { user } = await validateRequest();

    if (!user) return { error: "Unauthorized" };

    const testResults = await db.query.testResultsTable.findMany({
      where: (table) => eq(table.userId, user.id),
      orderBy: [asc(testResultsTable.date)],
    });

    return {
      success: true,
      data: testResults,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const deleteTestResult = async (id: string) => {
  try {
    const { user } = await validateRequest();

    if (!user) return { error: "Unauthorized" };

    await db
      .delete(testResultsTable)
      .where(
        and(eq(testResultsTable.id, id), eq(testResultsTable.userId, user.id))
      );

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};
