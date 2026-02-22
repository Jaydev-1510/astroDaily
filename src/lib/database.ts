import { createClient } from "@supabase/supabase-js";
import { type Database } from "./types/database";
import { config } from "./types/env.d";

const ANON_KEY = config.SUPABASE_KEY;
const URL = config.SUPABASE_URL;

export const database = createClient<Database>(URL, ANON_KEY);
