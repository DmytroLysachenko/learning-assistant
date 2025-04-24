CREATE TABLE "server_state" (
	"id" text PRIMARY KEY NOT NULL,
	"locked" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now()
);
