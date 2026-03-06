import prisma from "@/lib/db/client";

export async function GET(request: Request) {
  const links = await prisma.link.findMany({ orderBy: { created_at: "desc" } });

  return Response.json({ links });
}
