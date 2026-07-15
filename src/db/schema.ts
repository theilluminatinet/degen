import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const tierEnum = pgEnum("tier_enum", [
  "S",
  "A",
  "B",
  "C",
  "D",
  "F",
]);

export const casinos = pgTable("casinos", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  tier: tierEnum("tier").notNull().default("B"),
  referralLink: text("referral_link").notNull(),
  logoUrl: text("logo_url"),
  promoValue: varchar("promo_value", { length: 255 }),
  freeScDaily: boolean("free_sc_daily").default(false),
  dailyAmount: varchar("daily_amount", { length: 100 }),
  cashRedeem: boolean("cash_redeem").default(true),
  giftCard: boolean("gift_card").default(false),
  crypto: boolean("crypto").default(false),
  vip: boolean("vip").default(false),
  sportsbook: boolean("sportsbook").default(false),
  liveDealer: boolean("live_dealer").default(false),
  parentCompany: varchar("parent_company", { length: 255 }),
  location: varchar("location", { length: 255 }),
  establishedYear: varchar("established_year", { length: 10 }),
  notes: text("notes"),
  featured: boolean("featured").default(false),
  greylisted: boolean("greylisted").default(false),
  bannedStates: text("banned_states"), // comma-separated state codes: "WA,ID,NV,MI"
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const strategies = pgTable("strategies", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  icon: varchar("icon", { length: 10 }),
  sortOrder: integer("sort_order").default(0),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  author: varchar("author", { length: 100 }).default("Degen Central"),
  tags: text("tags"),
  published: boolean("published").default(false),
  featured: boolean("featured").default(false),
  sortOrder: integer("sort_order").default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }).default("General"),
  sortOrder: integer("sort_order").default(0),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User management tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: varchar("display_name", { length: 100 }),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  state: varchar("state", { length: 2 }), // User's state for filtering casinos
  emailVerified: boolean("email_verified").default(false),
  isActive: boolean("is_active").default(true),
  role: varchar("role", { length: 20 }).default("user"), // user, vip, moderator
  favoriteCasinos: text("favorite_casinos"), // comma-separated casino IDs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Casino = typeof casinos.$inferSelect;
export type NewCasino = typeof casinos.$inferInsert;
export type Strategy = typeof strategies.$inferSelect;
export type NewStrategy = typeof strategies.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type Faq = typeof faqs.$inferSelect;
export type NewFaq = typeof faqs.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
