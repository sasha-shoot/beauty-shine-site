import { NextRequest, NextResponse } from "next/server";
import { getOrdersByUser } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) return NextResponse.json({ orders: [] });
  try {
    const orders = await getOrdersByUser(userId);
    return NextResponse.json({ orders });
  } catch (e) {
    console.error("/api/me/orders error:", e);
    return NextResponse.json({ orders: [] });
  }
}
