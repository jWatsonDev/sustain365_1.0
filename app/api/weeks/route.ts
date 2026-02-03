import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMonday, addDays, formatDate } from "@/lib/habits";
import { Habit } from "@prisma/client";

const ALL_HABITS: Habit[] = ["PRAYER", "BIBLE", "READ_NONFICTION", "WORKOUT", "WATER", "DIET"];

// GET /api/weeks - Get current week or specific week
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    const targetDate = dateParam ? new Date(dateParam) : new Date();
    const weekStart = getMonday(targetDate);

    const week = await prisma.week.findUnique({
      where: {
        userId_weekStartDate: {
          userId: session.user.id,
          weekStartDate: weekStart,
        },
      },
      include: {
        days: {
          include: {
            habits: true,
          },
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });

    return NextResponse.json({ week, weekStartDate: formatDate(weekStart) });
  } catch (error) {
    console.error("Get week error:", error);
    return NextResponse.json({ error: "Failed to fetch week" }, { status: 500 });
  }
}

// POST /api/weeks - Create a new week
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const targetDate = body.date ? new Date(body.date) : new Date();
    const weekStart = getMonday(targetDate);

    // Check if week already exists
    const existing = await prisma.week.findUnique({
      where: {
        userId_weekStartDate: {
          userId: session.user.id,
          weekStartDate: weekStart,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Week already exists for this date" },
        { status: 400 }
      );
    }

    // Create week with 7 days and all habit completions
    const week = await prisma.week.create({
      data: {
        userId: session.user.id,
        weekStartDate: weekStart,
        days: {
          create: Array.from({ length: 7 }, (_, i) => ({
            date: addDays(weekStart, i),
            dayOfWeek: i,
            habits: {
              create: ALL_HABITS.map((habit) => ({
                habit,
                completed: false,
              })),
            },
          })),
        },
      },
      include: {
        days: {
          include: {
            habits: true,
          },
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });

    return NextResponse.json({ week });
  } catch (error) {
    console.error("Create week error:", error);
    return NextResponse.json({ error: "Failed to create week" }, { status: 500 });
  }
}
