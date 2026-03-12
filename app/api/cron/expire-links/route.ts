import prisma from "@/lib/db/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await prisma.link.updateMany({
      where: {
        expiresAt: { lte: new Date() },
        isActive: true,
      },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      updated: result.count,
      message: `Expired ${result.count} links`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to expire links" },
      { status: 500 },
    );
  }
}
