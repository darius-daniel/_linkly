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
    return new Response("Failed to delete link", { status: 500 });
  }

  return new Response("Success", { status: 200 });
}
