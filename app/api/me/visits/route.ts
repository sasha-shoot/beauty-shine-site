import { NextRequest, NextResponse } from "next/server";
import { getVisitsByUser } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  console.log(`[/api/me/visits] requested for user_id="${userId}"`);

  if (!userId) return NextResponse.json({ visits: [] });
  try {
    const visits = await getVisitsByUser(userId);
    console.log(`[/api/me/visits] found ${visits.length} visits for user_id="${userId}"`);
    return NextResponse.json({ visits });
  } catch (e) {
    console.error("/api/me/visits error:", e);
    return NextResponse.json({ visits: [] });
  }
}
