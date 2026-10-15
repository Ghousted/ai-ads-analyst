// Database schema. Neon Auth keeps its own tables in the neon_auth schema of the same database;
// users.authUserId links a person here to their Neon Auth account.
import { boolean, index, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const ROLES = ['owner', 'admin', 'member'] as const;
export const roleEnum = pgEnum('member_role', ROLES);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  authUserId: text('auth_user_id').notNull(),
  email: text('email').notNull(),
  name: text('name').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [uniqueIndex('users_auth_user_id_idx').on(t.authUserId)]);

// One agency per workspace. Sample mode shows the built-in sample clients until the agency switches to its own data.
export const agencies = pgTable('agencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  teamSize: text('team_size'),
  reportFreq: text('report_freq').notNull().default('Every Monday'),
  reportTone: text('report_tone').notNull().default('Friendly'),
  sampleMode: boolean('sample_mode').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const agencyMembers = pgTable('agency_members', {
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull().default('member'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [primaryKey({ columns: [t.agencyId, t.userId] }), index('agency_members_user_idx').on(t.userId)]);

// A teammate invited by email. They join the agency the first time they sign in with that email.
export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: roleEnum('role').notNull().default('member'),
  invitedBy: uuid('invited_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
}, t => [uniqueIndex('invitations_agency_email_idx').on(t.agencyId, t.email)]);

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  contactName: text('contact_name').notNull().default(''),
  email: text('email').notNull().default(''),
  industry: text('industry').notNull().default(''),
  tone: text('tone').notNull().default('Friendly'),
  schedule: text('schedule').notNull().default('Mondays, 8:00am'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('clients_agency_idx').on(t.agencyId)]);
