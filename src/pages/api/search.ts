import { database } from "@lib/database";

export async function GET({ url }) {
  const q = url.searchParams.get('q')?.trim() ?? ''
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100)
  const page = Math.max(parseInt(url.searchParams.get('page') ?? '0'), 0)

  if (!q) {
    return new Response(JSON.stringify({ data: [], count: 0 }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { data, count, error } = await database
    .from('APODs')
    .select('*', { count: 'exact' })
    .textSearch('fts', q, { type: 'websearch', config: 'english' })
    .order('date', { ascending: false })
    .range(page * limit, page * limit + limit - 1)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ data, count, page, limit }), {
    headers: { 'Content-Type': 'application/json' }
  })
}