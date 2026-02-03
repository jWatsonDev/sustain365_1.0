import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/habits/[id] - Toggle habit completion
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { completed } = await req.json();

    // Verify ownership through the chain: habit -> day -> week -> user
    const habit = await prisma.habitCompletion.findUnique({
      where: { id: params.id },
      include: {
        day: {
          include: {
            week: true,
          },
        },
      },
    });

    if (!habit || habit.day.week.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.habitCompletion.update({
      where: { id: params.id },
      data: { completed },
    });

    return NextResponse.json({ habit: updated });
  } catch (error) {
    console.error("Update habit error:", error);
    return NextResponse.json({ error: "Failed to update habit" }, { status: 500 });
  }
}
