import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/weeks/[id]/cheat-meal - Toggle cheat meal used
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cheatMealUsed } = await req.json();

    // Verify ownership
    const week = await prisma.week.findUnique({
      where: { id: params.id },
    });

    if (!week || week.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.week.update({
      where: { id: params.id },
      data: { cheatMealUsed },
    });

    return NextResponse.json({ week: updated });
  } catch (error) {
    console.error("Update cheat meal error:", error);
    return NextResponse.json({ error: "Failed to update cheat meal" }, { status: 500 });
  }
}
