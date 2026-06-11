import { NextRequest, NextResponse } from "next/server";
import { getOrdersByUser } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  console.log(`[/api/me/orders] requested for user_id="${userId}"`);

  if (!userId) {
    console.log(`[/api/me/orders] empty user_id, returning []`);
    return NextResponse.json({ orders: [] });
  }
  try {
    const orders = await getOrdersByUser(userId);
    console.log(`[/api/me/orders] found ${orders.length} orders for user_id="${userId}"`);
    return NextResponse.json({ orders });
  } catch (e) {
    console.error("/api/me/orders error:", e);
    return NextResponse.json({ orders: [] });
  }
}
