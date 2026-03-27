import type { APIRoute } from "astro";
import { database } from "@lib/database";
import type { Database } from "@lib/types/database";

type ApodRow = Database["public"]["Tables"]["APODs"]["Row"];

const TABLE = "APODs" as const;
const APOD_START_DATE = "1995-06-16";
const MAX_LIMIT = 1000;
const DEFAULT_LIMIT = 10;

const ALL_FIELDS = [
  "date",
  "title",
  "explanation",
  "url",
  "hdurl",
  "media_type",
  "service_version",
  "copyright",
  "thumbnail_url",
] as const;

type Field = (typeof ALL_FIELDS)[number];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "X-API-Version": "1.0",
  "X-Powered-By": "astroDaily",
};

function isValidDate(d: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d));
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function jsonError(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function jsonOk(data: unknown, extra?: Record<string, string>) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json", ...CORS, ...extra },
  });
}

function pickFields(row: ApodRow, fields: Field[]) {
  return fields.reduce(
    (acc, f) => {
      if (f in row) acc[f] = row[f];
      return acc;
    },
    {} as Record<string, unknown>,
  );
}

export const GET: APIRoute = async ({ request }) => {
  const { searchParams } = new URL(request.url);

  const date = searchParams.get("date");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
  const countParam = searchParams.get("count");
  const thumbs = searchParams.get("thumbs") === "true";
  const hd = searchParams.get("hd") !== "false";
  const q = searchParams.get("q")?.trim();
  const mediaType = searchParams.get("media_type");
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";
  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month");
  const fieldsParam = searchParams.get("fields");

  let requestedFields: Field[] = [...ALL_FIELDS];
  if (fieldsParam) {
    const asked = fieldsParam.split(",").map((f) => f.trim()) as Field[];
    const invalid = asked.filter((f) => !ALL_FIELDS.includes(f));
    if (invalid.length > 0) {
      return jsonError(
        `Unknown field(s): ${invalid.join(", ")}. Valid fields: ${ALL_FIELDS.join(", ")}`,
      );
    }
    requestedFields = [...new Set(["date" as Field, ...asked])];
  }

  const activeFields = requestedFields.filter((f) => {
    if (f === "hdurl" && !hd) return false;
    if (f === "thumbnail_url" && !thumbs) return false;
    return true;
  });

  if (date && (startDate || endDate)) {
    return jsonError(
      "Cannot use 'date' together with 'start_date'/'end_date'.",
    );
  }

  if (date) {
    if (date !== "today" && !isValidDate(date)) {
      return jsonError(`Invalid date format: '${date}'. Use YYYY-MM-DD.`);
    }

    const resolvedDate = date === "today" ? today() : date;

    if (resolvedDate < APOD_START_DATE || resolvedDate > today()) {
      return jsonError(
        `Date must be between ${APOD_START_DATE} and ${today()}.`,
      );
    }

    const { data, error } = await database
      .from(TABLE)
      .select("*")
      .eq("date", resolvedDate)
      .single();

    if (error || !data)
      return jsonError(`No APOD entry found for ${resolvedDate}.`, 404);

    return jsonOk(pickFields(data, activeFields));
  }

  if (countParam !== null) {
    const n = parseInt(countParam, 10);
    if (isNaN(n) || n < 1 || n > 100) {
      return jsonError("'count' must be an integer between 1 and 100.");
    }

    const { data, error } = await database.rpc("get_random_apod", { n });

    if (error || !data)
      return jsonError("Failed to fetch random entries.", 500);

    return jsonOk(data.map((row) => pickFields(row, activeFields)));
  }

  let query = database.from(TABLE).select("*", { count: "exact" });

  if (startDate) {
    if (!isValidDate(startDate))
      return jsonError(`Invalid start_date: '${startDate}'.`);
    query = query.gte("date", startDate);
  }
  if (endDate) {
    if (!isValidDate(endDate))
      return jsonError(`Invalid end_date: '${endDate}'.`);
    query = query.lte("date", endDate);
  }
  if (startDate && endDate && startDate > endDate) {
    return jsonError("'start_date' must be before or equal to 'end_date'.");
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,explanation.ilike.%${q}%`);
  }

  if (mediaType) {
    if (!["image", "video"].includes(mediaType)) {
      return jsonError("'media_type' must be 'image' or 'video'.");
    }
    query = query.eq("media_type", mediaType);
  }

  if (yearParam) {
    const year = parseInt(yearParam, 10);
    if (isNaN(year) || year < 1995 || year > new Date().getFullYear()) {
      return jsonError(
        `'year' must be between 1995 and ${new Date().getFullYear()}.`,
      );
    }
    query = query.gte("date", `${year}-01-01`).lte("date", `${year}-12-31`);
  }

  if (monthParam) {
    const month = parseInt(monthParam, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      return jsonError("'month' must be between 1 and 12.");
    }
    const mm = String(month).padStart(2, "0");
    query = query.like("date", `____-${mm}-%`);
  }

  const limit = Math.min(
    parseInt(limitParam ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT,
    MAX_LIMIT,
  );
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order("date", { ascending: order === "asc" }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("[astroDaily API] Supabase error:", error);
    return jsonError("Internal server error.", 500);
  }

  const results = data.map((row) => pickFields(row, activeFields));

  if ( !date && !startDate && !endDate && !countParam && !q && !mediaType && !yearParam && !monthParam ) {
    if (results.length > 0) return jsonOk(results[0]);
    return jsonError("No APOD entry found for today.", 404);
  }

  const totalPages = count ? Math.ceil(count / limit) : null;

  return jsonOk({
    meta: {
      total: count ?? null,
      page,
      limit,
      total_pages: totalPages,
      order,
      ...(q && { query: q }),
    },
    results,
  });
};

export const OPTIONS: APIRoute = () =>
  new Response(null, { status: 204, headers: CORS });
