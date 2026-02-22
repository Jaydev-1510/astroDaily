import { z } from "zod";
import dotenv from "dotenv";
import type { NodeApp } from "astro/app/node";

dotenv.config();

const ENVSchema = z.object({
  NASA_API_URL: z.string(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string(),
});

export const config = ENVSchema.parse(process.env);
