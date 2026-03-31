import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cedula, nombre, apellido, telefono, correo, profesion, cargo } = body;

    if (!cedula || !nombre || !apellido || !telefono || !correo || !profesion || !cargo) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const existing = await db.attendee.findUnique({
      where: { cedula },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un registro con esta cédula" },
        { status: 409 }
      );
    }

    const attendee = await db.attendee.create({
      data: {
        cedula,
        nombre,
        apellido,
        telefono,
        correo,
        profesion,
        cargo,
      },
      include: { payment: true },
    });

    return NextResponse.json({ success: true, attendee }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
