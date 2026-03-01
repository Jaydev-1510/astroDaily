import { database } from "@lib/database";
import { config } from "@lib/types/env.d";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

const API_URL: string = config.NASA_API_URL;

const latestApod: APISchema = await fetch(API_URL).then((r) => r.json());
const today: string = latestApod.date;

async function fetchApods(
  chunkMap: { startDate: string; endDate: string }[],
): Promise<APISchema[]> {
  console.log("• Fetching latest APODs...");
  let response: APISchema[] = [];
  for (let chunk of chunkMap) {
    const chunkResponse: APISchema[] = await fetch(
      `${API_URL}start_date=${chunk.startDate}&end_date=${chunk.endDate}`,
    ).then((r) => r.json());
    response = response.concat(chunkResponse);
  }
  for (let part of response) {
    part.created_at = String(new Date());
  }
  return response;
}

async function fetchLastDate() {
  console.log("• Fetching last date...");
  const { data } = await database
    .from("APODs")
    .select("date")
    .order("date", { ascending: false })
    .limit(1);

  if (data) {
    return data[0]?.date;
  } else {
    throw new Error("No data found");
  }
}

interface APISchema {
  copyright?: string | null;
  created_at?: string | null;
  date: string;
  error_flag?: boolean | null;
  error_message?: string | null;
  explanation?: string | null;
  hdurl?: string | null;
  media_type: string;
  title?: string | null;
  url?: string | null;
  service_version?: string | null;
}

function ApodsToFetch(date: string): number {
  const currentDate: Date = new Date(today);
  const lastDate: Date = new Date(date);
  const oneDay: number = 1000 * 60 * 60 * 24;
  const days: number = Math.floor(
    (currentDate.getTime() - lastDate.getTime()) / oneDay,
  );
  return days;
}

function addDays(date: string, days: number): any {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return formatDate(result);
}

function chunkify(date: string): { startDate: string; endDate: string }[] {
  console.log("• Preparing chunks...");
  const daysToFetch: number = ApodsToFetch(date);
  let chunkMap: { startDate: string; endDate: string }[] = [];
  if (daysToFetch > 30) {
    const chunks = Math.floor(daysToFetch / 30);
    const remainder: number = daysToFetch - 1 - chunks * 30;
    let startDate: string = date;
    let endDate: string = addDays(date, 30);
    for (let chunk = 0; chunk < chunks; chunk++) {
      chunkMap.push({
        startDate: startDate,
        endDate: endDate,
      });
      startDate = addDays(endDate, 1);
      endDate = addDays(startDate, 30);
    }
    chunkMap.push({
      startDate: addDays(endDate, -31),
      endDate: addDays(startDate, remainder),
    });
    return chunkMap;
  } else {
    chunkMap.push({
      startDate: date,
      endDate: addDays(date, daysToFetch),
    });
    return chunkMap;
  }
}

async function syncDatabase() {
  const lastDate = await fetchLastDate();
  if (lastDate === today) {
    console.log("Database is already up to the date");
  } else if (lastDate !== today) {
    console.log("• Syncing database...");
    const fetchMap: { startDate: string; endDate: string }[] = chunkify(
      addDays(lastDate, 1),
    );
    const newApods: APISchema[] = await fetchApods(fetchMap);
    const { error } = await database.from("APODs").upsert(newApods);
    if (error === null) {
      console.log("✓ Database synced.");
    } else {
      console.log("✕ Error syncing database.");
      throw new Error(error.message);
    }
  }
}

syncDatabase();
