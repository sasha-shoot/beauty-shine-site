import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const all = await getAllProducts();
    // Лише потрібний мінімум для відображення в кабінеті
    const minimal = all.map((p) => ({
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      image: p.image,
      price_uah: p.price_uah,
      in_stock: p.in_stock,
    }));
    return NextResponse.json({ products: minimal });
  } catch (e) {
    console.error("/api/products error:", e);
    return NextResponse.json({ products: [] });
  }
}
