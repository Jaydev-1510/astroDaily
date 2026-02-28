import type { APIRoute } from "astro";
import { database } from "@lib/database";

export const GET: APIRoute = async ({ url }) => {
  const page = Number(url.searchParams.get("page") || "0");
  const pageSize = 20;
  const start = page * pageSize;
  const end = start + pageSize - 1;

  const { data, error } = await database
    .from("APODs")
    .select("date, title, url, hdurl")
    .not("url", "ilike", "%.youtube.com%")
    .not("url", "ilike", "%.vimeo.com%")
    .order("date", { ascending: false })
    .range(start, end);

  const imageExtensions = /\.(jpg|jpeg|png|webp|gif|avif)$/i;
  const filteredData =
    data?.filter((item) => imageExtensions.test(item.url)) || [];

  return new Response(JSON.stringify({ data: filteredData, error }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
