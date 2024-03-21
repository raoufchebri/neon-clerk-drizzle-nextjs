CREATE TABLE IF NOT EXISTS "element_votes" (
	"element_id" integer,
	"user_id" text NOT NULL,
	"create_ts" timestamp DEFAULT now(),
	CONSTRAINT "element_votes_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "element" (
	"name" text NOT NULL,
	"symbol" varchar(3) NOT NULL,
	"atomicNumber" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "element_votes" ADD CONSTRAINT "element_votes_element_id_element_atomicNumber_fk" FOREIGN KEY ("element_id") REFERENCES "element"("atomicNumber") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "element_votes" ADD CONSTRAINT "element_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
