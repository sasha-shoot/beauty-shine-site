import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { getUserByTgId } from "@/lib/airtable";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) return NextResponse.json({ user: null });

  const session = verifySession(cookie);
  if (!session) return NextResponse.json({ user: null });

  // Тягнемо актуальні дані з Airtable (бонуси можуть змінитись)
  const user = await getUserByTgId(session.tg_user_id);
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: {
      id: user.tg_user_id,
      name: `${user.first_name} ${user.last_name}`.trim() || user.username || "Користувач",
      username: user.username ? `@${user.username}` : "",
      phone: user.phone,
      city: user.city,
      bonus: user.bonus,
      picture: user.picture,
      method: "tg",
    },
  });
}
