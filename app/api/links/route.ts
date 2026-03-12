import prisma from "@/lib/db/client";

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ links });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...rest } = body;

    if (!id) {
      return Response.json({ error: "Link ID is required" }, { status: 400 });
    }

    const updatedLink = await prisma.link.update({
      where: { id },
      data: { ...rest },
    });

    return Response.json({ link: updatedLink });
  } catch (error) {
    return Response.json({ error: "Failed to update link" }, { status: 500 });
  }
}
