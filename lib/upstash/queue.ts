import { Client } from "@upstash/qstash";

export const queueClient = new Client({
  token: process.env.QSTASH_TOKEN!,
});
