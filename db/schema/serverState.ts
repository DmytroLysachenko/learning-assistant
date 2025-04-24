import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const serverState = pgTable("server_state", {
  id: text("id").primaryKey(),
  status: boolean("status").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});
