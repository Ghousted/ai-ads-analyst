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

// One login to a platform. Google allows several per agency (each Google user sees different properties).
// Tokens are encrypted with TOKEN_ENCRYPTION_KEY before they are stored.
export const PROVIDERS = ['google', 'meta'] as const;
export const providerEnum = pgEnum('provider', PROVIDERS);
export const CONN_STATUS = ['ok', 'error'] as const;
export const connStatusEnum = pgEnum('connection_status', CONN_STATUS);

export const connections = pgTable('connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  provider: providerEnum('provider').notNull(),
  login: text('login').notNull(),
  connectedBy: uuid('connected_by').references(() => users.id, { onDelete: 'set null' }),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  status: connStatusEnum('status').notNull().default('ok'),
  error: text('error'),
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [uniqueIndex('connections_agency_login_idx').on(t.agencyId, t.provider, t.login)]);

// Something a connection can read: a GA4 property, a Meta ad account. Assigned to at most one client.
export const TOOLS = ['ga4', 'meta'] as const;
export const toolEnum = pgEnum('tool', TOOLS);

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  connectionId: uuid('connection_id').notNull().references(() => connections.id, { onDelete: 'cascade' }),
  tool: toolEnum('tool').notNull(),
  externalId: text('external_id').notNull(),
  name: text('name').notNull(),
  detail: text('detail').notNull().default(''),
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [uniqueIndex('accounts_connection_external_idx').on(t.connectionId, t.externalId), index('accounts_client_idx').on(t.clientId)]);
