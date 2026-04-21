CREATE TABLE "comments" (
  "id" serial PRIMARY KEY NOT NULL,
  "project_id" integer,
  "parent_id" integer,
  "commenter_name" varchar(255) NOT NULL,
  "body" text NOT NULL,
  "is_admin_reply" boolean DEFAULT false NOT NULL,
  "is_read" boolean DEFAULT false NOT NULL,
  "is_hidden" boolean DEFAULT false NOT NULL,
  "is_priority" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "comments_project_id_projects_id_fk"
    FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE set null ON UPDATE no action,
  CONSTRAINT "comments_parent_id_comments_id_fk"
    FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE cascade ON UPDATE no action
);

CREATE UNIQUE INDEX "comments_single_admin_reply_per_root_idx"
  ON "comments" ("parent_id")
  WHERE "is_admin_reply" = true AND "parent_id" IS NOT NULL;

CREATE INDEX "comments_roots_created_idx"
  ON "comments" ("created_at")
  WHERE "parent_id" IS NULL;
