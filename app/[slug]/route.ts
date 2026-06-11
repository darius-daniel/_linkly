import prisma from "@/lib/db/client";

export async function GET(
  request: Request,
  params: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params.params;

  try {
    const link = await prisma.link.findUnique({ where: { slug } });
    if (!link) {
      return Response.json({ error: "Link not found" }, { status: 404 });
    }

    await prisma.link.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    });

    return Response.redirect(link.url);
  } catch (error) {
    console.error("Error fetching link:", error);
    return Response.json({ error: "Failed to fetch link" }, { status: 500 });
  }
}
