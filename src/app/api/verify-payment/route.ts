import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, status, notes } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "Se requiere el ID del pago y el estado" },
        { status: 400 }
      );
    }

    if (!["VERIFIED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Estado no válido. Use VERIFIED o REJECTED" },
        { status: 400 }
      );
    }

    const payment = await db.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Pago no encontrado" },
        { status: 404 }
      );
    }

    const updated = await db.payment.update({
      where: { id: paymentId },
      data: {
        status,
        verifiedAt: new Date(),
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, payment: updated });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
