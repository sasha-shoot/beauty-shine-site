import { NextRequest, NextResponse } from "next/server";
import { getVisitsByUser } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) return NextResponse.json({ visits: [] });
  try {
    const visits = await getVisitsByUser(userId);
    return NextResponse.json({ visits });
  } catch (e) {
    console.error("/api/me/visits error:", e);
    return NextResponse.json({ visits: [] });
  }
}
