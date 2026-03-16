import prisma from "@/lib/db/client";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.link.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting link:", error);
    return Response.json({ error: "Failed to delete link" }, { status: 500 });
  }

  return Response.json(
    { message: "Link deleted successfully" },
    { status: 200 },
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { title, url, slug, expiresAt } = await request.json();

  try {
    const link = await prisma.link.update({
      where: { id },
      data: { title, url, slug, expiresAt },
    });
    return Response.json({ link }, { status: 200 });
  } catch (error) {
    console.error("Error updating link:", error);
    return Response.json({ message: "Failed to update link" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { status } = await request.json();

  try {
    const link = await prisma.link.update({
      where: { id },
      data: { expiresAt: status === "Inactive" ? new Date() : null },
    });
    return Response.json({ link }, { status: 200 });
  } catch (error) {
    console.error("Error updating link:", error);
    return Response.json({ message: "Failed to update link" }, { status: 500 });
  }
}
