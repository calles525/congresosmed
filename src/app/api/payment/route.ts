import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { generateRegistrationEmail } from "@/lib/email-template";

const PRECIOS: Record<string, string> = {
  Bachiller: "10 \u20ac",
  "Medico General": "15 \u20ac",
  "Medico Especialista": "25 \u20ac",
  "Enfermero/a": "15 \u20ac",
  "Farmaceutico/a": "15 \u20ac",
  "Odontologo/a": "15 \u20ac",
  "Psicologo/a": "15 \u20ac",
  Nutricionista: "15 \u20ac",
  Fisioterapeuta: "15 \u20ac",
  Bioanalista: "15 \u20ac",
  "Estudiante de Salud": "15 \u20ac",
  Otro: "15 \u20ac",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attendeeId, referencia, telefonoEmisor, bancoEmisor, capture } = body;

    if (!attendeeId || !referencia || !telefonoEmisor || !bancoEmisor || !capture) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const attendee = await db.attendee.findUnique({ where: { id: attendeeId } });
    if (!attendee) {
      return NextResponse.json({ error: "Asistente no encontrado" }, { status: 404 });
    }

    const existingPayment = await db.payment.findUnique({ where: { attendeeId } });
    if (existingPayment) {
      return NextResponse.json({ error: "Ya existe un registro de pago para este asistente" }, { status: 409 });
    }

    const payment = await db.payment.create({
      data: { attendeeId, referencia, telefonoEmisor, bancoEmisor, capture, status: "PENDING" },
    });

    // Send confirmation email
    const precio = PRECIOS[attendee.profesion] || "15 \u20ac";
    const htmlContent = generateRegistrationEmail({
      nombre: attendee.nombre,
      apellido: attendee.apellido,
      correo: attendee.correo,
      cedula: attendee.cedula,
      profesion: attendee.profesion,
      cargo: attendee.cargo,
      telefono: attendee.telefono,
      precio,
      referencia,
    });

    sendEmail(
      attendee.correo,
      `Confirmacion de Registro - I Jornada de Egresados "Dra. Analiese Cordero"`,
      htmlContent
    );

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
