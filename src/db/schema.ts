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
  // Report schedules and alerts follow this time zone.
  timeZone: text('time_zone').notNull().default('America/New_York'),
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
  // Ask to connect: a private link the client opens to sign in to Google themselves. It works for 14 days after it
  // was sent, and what they connect is linked to this client only.
  connectToken: text('connect_token'),
  connectSentTo: text('connect_sent_to'),
  connectSentAt: timestamp('connect_sent_at', { withTimezone: true }),
  // The send time the last scheduled draft was written for, so a draft the agency deleted isn't written again.
  draftedFor: timestamp('drafted_for', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('clients_agency_idx').on(t.agencyId), uniqueIndex('clients_connect_token_idx').on(t.connectToken)]);

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
  // Set when the client connected it from their ask-to-connect link: its accounts belong to that client only.
  forClientId: uuid('for_client_id').references(() => clients.id, { onDelete: 'set null' }),
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
  // The account's own currency (ISO code, e.g. EUR) and time zone (e.g. America/New_York), read from the platform on
  // the first pull. Money is shown in the currency, and "yesterday" is the account's yesterday.
  currency: text('currency'),
  timeZone: text('time_zone'),
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
  // A draft written ahead of the client's schedule: when it is due to go out, and who approved it. Approved drafts
  // send themselves at scheduledFor; unapproved ones wait for the agency.
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  approvedBy: uuid('approved_by').references(() => users.id, { onDelete: 'set null' }),
}, t => [index('reports_agency_idx').on(t.agencyId, t.createdAt), uniqueIndex('reports_share_token_idx').on(t.shareToken), uniqueIndex('reports_client_scheduled_idx').on(t.clientId, t.scheduledFor)]);

// Every paid AI call, for per-agency daily limits.
export const aiUsage = pgTable('ai_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  inputTokens: doublePrecision('input_tokens').notNull().default(0),
  outputTokens: doublePrecision('output_tokens').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('ai_usage_agency_idx').on(t.agencyId, t.createdAt)]);

// A flagged client's latest AI analysis, and the flag the agency dismissed. signature is the data day plus the
// signals the analysis was written for, so a new day or a new signal asks for a fresh one. dismissedKeys hides the
// flag until its signals change.
export const clientFlags = pgTable('client_flags', {
  clientId: uuid('client_id').primaryKey().references(() => clients.id, { onDelete: 'cascade' }),
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  signature: text('signature'),
  analysis: jsonb('analysis'),
  model: text('model'),
  analyzedAt: timestamp('analyzed_at', { withTimezone: true }),
  dismissedKeys: text('dismissed_keys'),
}, t => [index('client_flags_agency_idx').on(t.agencyId)]);

// A client's targets: cost per lead (under), leads per week and conversion rate (at least), and the monthly ad
// budget. One of each type per client.
export const GOAL_TYPES = ['cpl', 'leads', 'conv', 'budget'] as const;
export const goalTypeEnum = pgEnum('goal_type', GOAL_TYPES);

export const clientGoals = pgTable('client_goals', {
  clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  type: goalTypeEnum('type').notNull(),
  target: doublePrecision('target').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [primaryKey({ columns: [t.clientId, t.type] }), index('client_goals_agency_idx').on(t.agencyId)]);

// A task on the Tasks board. assignees are user ids; items is the checklist. position orders the board (new tasks
// go to the top from the new-task form, to the bottom when added in a column).
export const TASK_STATUS = ['todo', 'doing', 'review', 'done'] as const;
export const taskStatusEnum = pgEnum('task_status', TASK_STATUS);

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  status: taskStatusEnum('status').notNull().default('todo'),
  due: date('due'),
  assignees: jsonb('assignees').$type<string[]>().notNull().default([]),
  items: jsonb('items').$type<{ label: string; done: boolean }[]>().notNull().default([]),
  position: doublePrecision('position').notNull().default(0),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('tasks_agency_idx').on(t.agencyId, t.position)]);

export const taskComments = pgTable('task_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('task_comments_task_idx').on(t.taskId, t.createdAt)]);

// A person's notification choices in one agency (Settings › Notifications). Missing keys use the defaults in
// lib/prefs.ts.
export const notificationPrefs = pgTable('notification_prefs', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  prefs: jsonb('prefs').$type<Record<string, boolean>>().notNull().default({}),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [primaryKey({ columns: [t.userId, t.agencyId] })]);

// Alerts already emailed, so each one goes out once. key is e.g. "sig:<client>:leads-drop", "risk:<client>",
// "conn:<connection>" or "weekly:2026-10-19". An alert whose cause clears is removed, so it can fire again later.
export const alertLog = pgTable('alert_log', {
  agencyId: uuid('agency_id').notNull().references(() => agencies.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [primaryKey({ columns: [t.agencyId, t.key] })]);
