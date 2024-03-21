ALTER TABLE "element" RENAME COLUMN "atomicNumber" TO "atomic_number";--> statement-breakpoint
ALTER TABLE "element_votes" DROP CONSTRAINT "element_votes_element_id_element_atomicNumber_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "element_votes" ADD CONSTRAINT "element_votes_element_id_element_atomic_number_fk" FOREIGN KEY ("element_id") REFERENCES "element"("atomic_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
