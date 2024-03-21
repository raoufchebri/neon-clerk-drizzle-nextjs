ALTER TABLE "element_votes" ALTER COLUMN "element_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "element_votes" ALTER COLUMN "create_ts" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "create_ts" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_create_ts" timestamp NOT NULL;