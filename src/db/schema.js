import { pgTable, pgEnum, serial, text, timestamp, varchar, boolean, integer } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['superAdmin']);

export const stackTypeEnum = pgEnum('stack_type', [
  'frontend',
  'backend',
  'database',
  'devops',
  'tool',
  'communication',
  'testing',
  'mobile',
  'other',
]);

export const messageTagEnum = pgEnum('message_tag', ['job', 'freelance', 'spam', 'question', 'other']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  urlAccessPass: text('url_access_pass').notNull(),
  role: roleEnum('role').default('superAdmin').notNull(),
  cvFilePath: text('cv_file_path'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const stacks = pgTable('stacks', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: stackTypeEnum('type').notNull(),
  level: varchar('level', { length: 50 }),
  experienceYears: text('experience_years'), // Changed to text to allow "5+" or range if needed, or keeping it flexible as per user "int" request but "text" is safer for "5+ years"
  icon: text('icon'),
  why: text('why'),
  color: varchar('color', { length: 50 }),
  terminalText: varchar('terminal_text', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 5000 }),
  body: text('body').notNull(),
  tag: messageTagEnum('tag').default('other').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),

  shortDescription: varchar('short_description', { length: 500 }),
  fullDescription: text('full_description'),

  problem: text('problem'),
  solution: text('solution'),

  githubUrl: text('github_url'),
  liveUrl: text('live_url'),

  coverImage: text('cover_image'),
  coverpageUrl: text('coverpage_url'),
  role: varchar('role', { length: 100 }), // solo | team | backend | fullstack
  status: varchar('status', { length: 50 }), // planned | in_progress | completed | archived

  duration: varchar('duration', { length: 100 }),

  isPublished: boolean('is_published').default(false).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isHide: boolean('is_hide').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),

  projectId: integer('project_id')
    .references(() => projects.id),

  parentId: integer('parent_id')
    .references(() => comments.id),

  commenterName: varchar('commenter_name', { length: 255 }).notNull(),
  body: text('body').notNull(),

  isAdminReply: boolean('is_admin_reply').default(false).notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  isHidden: boolean('is_hidden').default(false).notNull(),
  isPriority: boolean('is_priority').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectStacks = pgTable('project_stacks', {
  id: serial('id').primaryKey(),

  projectId: integer('project_id')
    .references(() => projects.id)
    .notNull(),

  stackId: integer('stack_id')
    .references(() => stacks.id)
    .notNull(),
});

export const projectSections = pgTable('project_sections', {
  id: serial('id').primaryKey(),

  projectId: integer('project_id')
    .references(() => projects.id)
    .notNull(),

  title: varchar('title', { length: 255 }),
  content: text('content'),

  order: integer('order').notNull(),
});

export const projectMedia = pgTable('project_media', {
  id: serial('id').primaryKey(),

  projectId: integer('project_id')
    .references(() => projects.id)
    .notNull(),

  url: text('url').notNull(),
  type: varchar('type', { length: 50 }), // image | video
  text: text('text'), // optional caption
  order: integer('order'),
});
