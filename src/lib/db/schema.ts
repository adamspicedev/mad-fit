import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique().notNull(),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  hashedPassword: text("hashed_password"),
  profilePictureUrl: text("profile_picture_url"),
  role: roleEnum("role").notNull().default("USER"),
});

export const oauthAccountTable = pgTable("oauth_account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  provider: text("provider").notNull(), // google, github
  providerUserId: text("provider_user_id").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }),
});

export const emailVerificationTable = pgTable("email_verification", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  code: text("code").notNull(),
  sentAt: timestamp("sent_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const weightTable = pgTable("weight", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  weight: text("weight").notNull(),
  date: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const testResultsTable = pgTable("test_results", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  pressUps: text("pressups"),
  parkLap: text("park_lap"),
  stepUp: text("step_up"),
  sledPush: text("sled_push"),
  chestPress: text("chest_press"),
  plank: text("plank"),
  date: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
