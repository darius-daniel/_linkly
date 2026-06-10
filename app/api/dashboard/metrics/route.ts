import prisma from "@/lib/db/client";
import { computeClickMetrics } from "@/lib/stats/click-metrics";

export async function GET() {
  try {
    const [links, visits] = await Promise.all([
      prisma.link.findMany({
        select: { id: true, createdAt: true, expiresAt: true },
      }),
      prisma.visit.findMany({
        select: { linkID: true, createdAt: true },
      }),
    ]);

    const metrics = computeClickMetrics(visits, links);

    return Response.json({ metrics });
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    return Response.json(
      { error: "Failed to fetch dashboard metrics" },
      { status: 500 },
    );
  }
}
