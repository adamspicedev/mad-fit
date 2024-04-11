"use server";

import db from "@/lib/db";
import { weightTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import { WeightSchema } from "@/types";
import { asc, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";

export const createWeight = async (values: z.infer<typeof WeightSchema>) => {
  console.log("values", values);
  try {
    const { user } = await validateRequest();

    if (!user) return { error: "Unauthorized" };

    await db.insert(weightTable).values([
      {
        id: generateId(15),
        userId: user.id,
        weight: values.weight.toString(),
        date: new Date(values.date),
      },
    ]);

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const getWeightsForCurrentUser = async () => {
  try {
    const { user } = await validateRequest();

    if (!user) return { error: "Unauthorized" };

    const weights = await db.query.weightTable.findMany({
      where: (table) => eq(table.userId, user.id),
      orderBy: [asc(weightTable.date)],
    });

    return {
      success: true,
      data: weights,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const getWeightsForSpecificUser = async (userId: string) => {
  try {
    const weights = await db.query.weightTable.findMany({
      where: (table) => eq(table.userId, userId),
    });

    return {
      success: true,
      data: weights,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const updateWeight = async (
  id: string,
  values: z.infer<typeof WeightSchema>
) => {
  try {
    const { user } = await validateRequest();

    if (!user) return { error: "Unauthorized" };

    const weight = await db.query.weightTable.findFirst({
      where: (table) => eq(table.id, id),
    });

    if (!weight) return { error: "Weight not found" };

    if (weight.userId !== user.id) return { error: "Unauthorized" };

    await db
      .update(weightTable)
      .set({
        weight: values.weight.toString(),
        date: new Date(values.date),
      })
      .where(eq(weightTable.id, id));

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

export const deleteWeight = async (id: string) => {
  try {
    const { user } = await validateRequest();

    if (!user) return { error: "Unauthorized" };

    const weight = await db.query.weightTable.findFirst({
      where: (table) => eq(table.id, id),
    });

    if (!weight) return { error: "Weight not found" };

    if (weight.userId !== user.id) return { error: "Unauthorized" };

    await db.delete(weightTable).where(eq(weightTable.id, id));

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};
