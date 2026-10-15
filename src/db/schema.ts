// Database schema. Neon Auth keeps its own tables in the neon_auth schema of the same database;
// users.authUserId links a person here to their Neon Auth account.
import { boolean, date, doublePrecision, index, integer, jsonb, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

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
  // Report branding, applied to every report: a logo (data URL) and a brand colour.
  brandLogo: text('brand_logo'),
  brandColor: text('brand_color').notNull().default('#1f6be2'),
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
  // Data pulls: the last day stored, and the last error (quota, lost access) if the pull failed.
  dataThrough: date('data_through'),
  syncError: text('sync_error'),
  syncedAt: timestamp('synced_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [uniqueIndex('accounts_connection_external_idx').on(t.connectionId, t.externalId), index('accounts_client_idx').on(t.clientId)]);

// Daily numbers per account. dim is the breakdown ('total', 'channel', 'device', 'page', 'campaign') and dimValue its
// value ('' for totals). Metric names follow the platform, e.g. sessions, totalUsers, engagedSessions, keyEvents, adCost.
export const metricRows = pgTable('metric_rows', {
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  day: date('day').notNull(),
  dim: text('dim').notNull(),
  dimValue: text('dim_value').notNull().default(''),
  metric: text('metric').notNull(),
  value: doublePrecision('value').notNull(),
}, t => [primaryKey({ columns: [t.accountId, t.day, t.dim, t.dimValue, t.metric] }), index('metric_rows_account_day_idx').on(t.accountId, t.day)]);

// A client report. facts is the snapshot of numbers it was written from (so it never changes under the reader);
// content is the written report (headline, summary, sections, next steps), editable after Claude writes it.
export const REPORT_STATUS = ['draft', 'sent'] as const;
export const reportStatusEnum = pgEnum('report_status', REPORT_STATUS);

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  status: reportStatusEnum('status').notNull().default('draft'),
  facts: jsonb('facts').notNull(),
  content: jsonb('content').notNull(),
  model: text('model'),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  // Sending: who it went to, and the private link the client opens. Views of that link are counted.
  sentTo: text('sent_to'),
  shareToken: text('share_token'),
  viewCount: integer('view_count').notNull().default(0),
  firstViewedAt: timestamp('first_viewed_at', { withTimezone: true }),
  lastViewedAt: timestamp('last_viewed_at', { withTimezone: true }),
}, t => [index('reports_agency_idx').on(t.agencyId, t.createdAt), uniqueIndex('reports_share_token_idx').on(t.shareToken)]);

// Every paid AI call, for per-agency daily limits.
export const aiUsage = pgTable('ai_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  inputTokens: doublePrecision('input_tokens').notNull().default(0),
  outputTokens: doublePrecision('output_tokens').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('ai_usage_agency_idx').on(t.agencyId, t.createdAt)]);
