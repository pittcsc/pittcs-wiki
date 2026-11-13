import { NextResponse } from "next/server"
import { buildSearchIndex } from "@/utils/search-index"

// The index only changes when the site is rebuilt, so prerender it
export const dynamic = "force-static"

export async function GET() {
  const index = await buildSearchIndex()
  return NextResponse.json(index, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  })
}
