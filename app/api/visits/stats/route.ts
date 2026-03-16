import prisma from "@/lib/db/client";
import { Prisma } from "@/app/generated/prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Math.max(1, parseInt(searchParams.get("days") ?? "90", 10));

  // Build the interval string safely outside of parameterized bindings
  const interval = Prisma.sql`${days} * INTERVAL '1 day'`;

  try {
    const rows = await prisma.$queryRaw<
      { date: string; clicks: bigint; unique: bigint }[]
    >`
      SELECT
        TO_CHAR(DATE("created_at"), 'YYYY-MM-DD') AS date,
        COUNT(*)                                   AS clicks,
        COUNT(DISTINCT country)                    AS unique
      FROM "Visit"
      WHERE "created_at" >= NOW() - ${interval}
      GROUP BY DATE("created_at")
      ORDER BY date ASC
    `;

    // Prisma returns BigInt from COUNT — serialize to plain numbers
    const data = rows.map((r) => ({
      date: r.date,
      clicks: Number(r.clicks),
      unique: Number(r.unique),
    }));

    return Response.json({ data });
  } catch (error) {
    console.error("Failed to fetch visit stats:", error);
    return Response.json(
      { error: "Failed to fetch visit stats" },
      { status: 500 },
    );
  }
}
