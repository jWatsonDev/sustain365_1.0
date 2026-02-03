import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/days/[id]/cheat-meal - Set/unset cheat meal
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isCheatMeal } = await req.json();

    // Verify ownership
    const day = await prisma.day.findUnique({
      where: { id: params.id },
      include: { week: true },
    });

    if (!day || day.week.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.day.update({
      where: { id: params.id },
      data: { isCheatMeal },
    });

    return NextResponse.json({ day: updated });
  } catch (error) {
    console.error("Update cheat meal error:", error);
    return NextResponse.json({ error: "Failed to update cheat meal" }, { status: 500 });
  }
}
