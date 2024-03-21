ALTER TABLE "element_votes" DROP CONSTRAINT "element_votes_element_id_element_atomicNumber_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "element_votes" ADD CONSTRAINT "element_votes_element_id_element_atomicNumber_fk" FOREIGN KEY ("element_id") REFERENCES "element"("atomicNumber") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
