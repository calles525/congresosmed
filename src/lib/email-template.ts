interface EmailData {
  nombre: string;
  apellido: string;
  correo: string;
  cedula: string;
  profesion: string;
  cargo: string;
  telefono: string;
  precio: string;
  referencia?: string;
}

export function generateRegistrationEmail(data: EmailData): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Registro - I Jornada de Egresados</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', sans-serif;">
  
  <!-- Container -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        
        <!-- Main Card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #111111; border-radius: 16px; border: 1px solid #222222; overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d4f3c 0%, #065f46 50%, #047857 100%); padding: 40px 32px; text-align: center;">
              <div style="margin-bottom: 16px;">
                <span style="font-size: 13px; color: #6ee7b7; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">XXIV Promocion Puericultura y Pediatria IVSS-UCV</span>
              </div>
              <h1 style="margin: 0; font-size: 26px; color: #ffffff; font-weight: 800; line-height: 1.3;">
                I Jornada de Egresados
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 18px; color: #a7f3d0; font-style: italic; font-weight: 400;">
                &ldquo;Dra. Analiese Cordero&rdquo;
              </p>
            </td>
          </tr>

          <!-- Success Icon -->
          <tr>
            <td align="center" style="padding: 32px 32px 16px;">
              <div style="width: 72px; height: 72px; background-color: #052e16; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: 2px solid #10b981;">
                <i class="fa-solid fa-circle-check" style="font-size: 32px; color: #10b981;"></i>
              </div>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="padding: 0 32px 8px;">
              <h2 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 700;">
                Registro Completado
              </h2>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #9ca3af; line-height: 1.6;">
                Su registro y comprobante de pago han sido recibidos exitosamente. A continuacion le mostramos los detalles de su inscripcion.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 16px 32px 0;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #333333, transparent);"></div>
            </td>
          </tr>

          <!-- Attendee Info -->
          <tr>
            <td style="padding: 24px 32px 0;">
              <p style="margin: 0 0 16px; font-size: 12px; color: #6b7280; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">
                <i class="fa-solid fa-user" style="margin-right: 6px; color: #10b981;"></i>
                Datos del Participante
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border-radius: 12px; border: 1px solid #1f1f1f;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 4px 0;">
                          <span style="font-size: 12px; color: #6b7280;">Nombre Completo</span>
                        </td>
                        <td style="padding: 4px 0; text-align: right;">
                          <span style="font-size: 14px; color: #ffffff; font-weight: 600;">${data.nombre} ${data.apellido}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0;">
                          <span style="font-size: 12px; color: #6b7280;">Cedula</span>
                        </td>
                        <td style="padding: 4px 0; text-align: right;">
                          <span style="font-size: 14px; color: #ffffff; font-weight: 500;">${data.cedula}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0;">
                          <span style="font-size: 12px; color: #6b7280;">Profesion</span>
                        </td>
                        <td style="padding: 4px 0; text-align: right;">
                          <span style="font-size: 14px; color: #ffffff; font-weight: 500;">${data.profesion}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0;">
                          <span style="font-size: 12px; color: #6b7280;">Cargo / Especialidad</span>
                        </td>
                        <td style="padding: 4px 0; text-align: right;">
                          <span style="font-size: 14px; color: #ffffff; font-weight: 500;">${data.cargo}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Event & Payment Info -->
          <tr>
            <td style="padding: 24px 32px 0;">
              <p style="margin: 0 0 16px; font-size: 12px; color: #6b7280; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">
                <i class="fa-solid fa-calendar-check" style="margin-right: 6px; color: #10b981;"></i>
                Detalles del Evento y Pago
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border-radius: 12px; border: 1px solid #1f1f1f;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; width: 140px;">
                          <span style="font-size: 12px; color: #6b7280;">Evento</span>
                        </td>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 13px; color: #ffffff; font-weight: 500;">I Jornada de Egresados &ldquo;Dra. Analiese Cordero&rdquo;</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 12px; color: #6b7280;">Fecha</span>
                        </td>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 13px; color: #ffffff; font-weight: 500;">Sabado, 16 de Mayo 2026</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 12px; color: #6b7280;">Hora</span>
                        </td>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 13px; color: #ffffff; font-weight: 500;">7:30 am - 6:00 pm</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 12px; color: #6b7280;">Lugar</span>
                        </td>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 13px; color: #ffffff; font-weight: 500;">Club Social Canario, Acarigua</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 12px; color: #6b7280;">Inversion</span>
                        </td>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 16px; color: #10b981; font-weight: 700;">${data.precio}</span>
                        </td>
                      </tr>
                      ${data.referencia ? `
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 12px; color: #6b7280;">Referencia de Pago</span>
                        </td>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 14px; color: #fbbf24; font-weight: 700; font-family: monospace; background-color: #422006; padding: 2px 10px; border-radius: 6px;">${data.referencia}</span>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="padding: 24px 32px 0;">
              <div style="background: linear-gradient(135deg, #1e1b0f 0%, #1a1500 100%); border: 1px solid #854d0e; border-radius: 12px; padding: 20px 24px; text-align: center;">
                <i class="fa-solid fa-clock" style="font-size: 20px; color: #f59e0b; margin-bottom: 8px; display: block;"></i>
                <p style="margin: 0; font-size: 14px; color: #fde68a; font-weight: 600; margin-bottom: 4px;">
                  Pago en Verificacion
                </p>
                <p style="margin: 0; font-size: 12px; color: #d4a76a; line-height: 1.6;">
                  Su comprobante de pago ha sido recibido y se encuentra en proceso de verificacion. De haber alguna observacion con el pago, nos comunicaremos con usted personalmente al telefono ${data.telefono}.
                </p>
              </div>
            </td>
          </tr>

          <!-- Important Notice -->
          <tr>
            <td style="padding: 24px 32px 0;">
              <div style="background-color: #0a0a0a; border: 1px solid #1f1f1f; border-radius: 12px; padding: 20px 24px;">
                <p style="margin: 0 0 12px; font-size: 12px; color: #6b7280; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">
                  <i class="fa-solid fa-circle-info" style="margin-right: 6px; color: #3b82f6;"></i>
                  Informacion Importante
                </p>
                <ul style="margin: 0; padding-left: 0; list-style: none;">
                  <li style="padding: 4px 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">
                    <i class="fa-solid fa-check" style="color: #10b981; margin-right: 8px; font-size: 10px;"></i>
                    Guarde este correo como comprobante de su inscripcion
                  </li>
                  <li style="padding: 4px 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">
                    <i class="fa-solid fa-check" style="color: #10b981; margin-right: 8px; font-size: 10px;"></i>
                    Una vez verificado su pago, recibira un correo de confirmacion
                  </li>
                  <li style="padding: 4px 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">
                    <i class="fa-solid fa-check" style="color: #10b981; margin-right: 8px; font-size: 10px;"></i>
                    Avalado por la Sociedad Venezolana de Puericultura y Pediatria, filial Portuguesa
                  </li>
                  <li style="padding: 4px 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">
                    <i class="fa-solid fa-check" style="color: #10b981; margin-right: 8px; font-size: 10px;"></i>
                    Presente este correo el dia del evento
                  </li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding: 24px 32px 0;">
              <div style="text-align: center; padding: 16px; background-color: #0f0f0f; border-radius: 12px; border: 1px solid #1f1f1f;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #6b7280; letter-spacing: 1px; text-transform: uppercase;">Mas Informacion</p>
                <p style="margin: 0; font-size: 14px; color: #9ca3af;">
                  <i class="fa-solid fa-phone" style="color: #10b981; margin-right: 6px;"></i> 0424-5421151
                  <span style="margin: 0 12px; color: #333;">|</span>
                  <i class="fa-solid fa-phone" style="color: #10b981; margin-right: 6px;"></i> 0412-7819023
                </p>
                <p style="margin: 8px 0 0; font-size: 14px; color: #9ca3af;">
                  <i class="fa-brands fa-instagram" style="color: #10b981; margin-right: 6px;"></i> @promoxxipediatria
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #222222, transparent); margin-bottom: 24px;"></div>
              <p style="margin: 0; font-size: 12px; color: #4b5563; line-height: 1.6;">
                Este correo fue enviado automaticamente tras completar su registro en la plataforma.
              </p>
              <p style="margin: 8px 0 0; font-size: 11px; color: #374151;">
                &copy; 2026 XXIV Promocion de Puericultura y Pediatria IVSS-UCV. Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Main Card -->

        <!-- Nexo Logic Credit -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; margin-top: 16px;">
          <tr>
            <td align="center" style="padding: 0 32px;">
              <p style="margin: 0; font-size: 11px; color: #374151;">
                Desarrollado por 
                <a href="https://nexologic.dev" style="color: #10b981; text-decoration: none; font-weight: 600;">Nexo Logic</a>
                <span style="color: #333; margin: 0 4px;">|</span>
                <span style="color: #4b5563;">Ingenieria de Software</span>
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}
