import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

/**
 * This table stores users. Users are created in Clerk, then Clerk calls a
 * webhook at /api/webhook/clerk to inform this application a user was created.
 */
export const Users = pgTable('users', {
  // The ID will be the user's ID from Clerk
  id: text('id').primaryKey().notNull(),

  // Time user was created in Clerk
  clerkCreateTs: timestamp('clerk_create_ts').notNull(),

  // Time when user was created in our database. 
  createTs: timestamp('create_ts').defaultNow().notNull()
});

export const Elements = pgTable('element', {
  name: text('name').notNull(),
  symbol: varchar('symbol', { length: 3 }).notNull(),
  atomicNumber: integer('atomic_number').notNull().primaryKey(),
});

export const ElementVotes = pgTable('element_votes', {
  elementId: integer('element_id').references(() => Elements.atomicNumber).notNull(),
  userId: text('user_id').references(() => Users.id, { onDelete: 'cascade' }).unique().notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull()
});

export type User = typeof Users.$inferSelect;
export type Element = typeof Elements.$inferSelect;
export type ElementVote = typeof ElementVotes.$inferSelect;
