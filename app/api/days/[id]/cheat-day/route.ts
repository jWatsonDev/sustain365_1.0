import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/days/[id]/cheat-day - Set/unset cheat day
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isCheatDay } = await req.json();

    // Verify ownership
    const day = await prisma.day.findUnique({
      where: { id: params.id },
      include: { week: true },
    });

    if (!day || day.week.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // If setting as cheat day, first unset any existing cheat day in this week
    if (isCheatDay) {
      await prisma.day.updateMany({
        where: {
          weekId: day.weekId,
          isCheatDay: true,
        },
        data: { isCheatDay: false },
      });
    }

    const updated = await prisma.day.update({
      where: { id: params.id },
      data: { isCheatDay },
    });

    return NextResponse.json({ day: updated });
  } catch (error) {
    console.error("Update cheat day error:", error);
    return NextResponse.json({ error: "Failed to update cheat day" }, { status: 500 });
  }
}
