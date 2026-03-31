import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const attendees = await db.attendee.findMany({
      include: { payment: true },
      orderBy: { registeredAt: "desc" },
    });

    return NextResponse.json({ attendees });
  } catch (error) {
    console.error("Fetch attendees error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
