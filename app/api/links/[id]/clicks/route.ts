import prisma from "@/lib/db/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      return Response.json({ error: "Link not found" }, { status: 404 });
    }

    return Response.json({ clicks: link.clicks });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to fetch clicks" }, { status: 500 });
  }
}
