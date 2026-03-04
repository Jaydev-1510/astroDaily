import type { APIRoute } from "astro";
import { database } from "@lib/database";

export const GET: APIRoute = async () => {
  const start = new Date(1995, 6, 16);
  const end = new Date();

  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  )
    .toISOString()
    .split("T")[0];

  const { data, error } = await database
    .from("APODs")
    .select("*")
    .eq("date", randomDate)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
