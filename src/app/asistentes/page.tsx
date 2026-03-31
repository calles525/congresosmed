"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ShieldCheck,
  Phone,
  Mail,
  Stethoscope,
  ImageIcon,
  ChevronDown,
  ArrowLeft,
  RefreshCw,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Attendee {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  profesion: string;
  cargo: string;
  registeredAt: string;
  payment?: Payment | null;
}

interface Payment {
  id: string;
  attendeeId: string;
  referencia: string;
  telefonoEmisor: string;
  bancoEmisor: string;
  capture: string;
  status: string;
  submittedAt: string;
  verifiedAt: string | null;
  notes: string | null;
}

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

export default function AsistentesPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [verifyDialog, setVerifyDialog] = useState<{ open: boolean; payment: Payment | null; attendee: Attendee | null }>({ open: false, payment: null, attendee: null });
  const [verifyAction, setVerifyAction] = useState<"VERIFIED" | "REJECTED">("VERIFIED");
  const [verifyNotes, setVerifyNotes] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState<{ open: boolean; src: string; name: string }>({ open: false, src: "", name: "" });

  const loadAttendees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/attendees");
      const data = await res.json();
      if (res.ok) setAttendees(data.attendees);
    } catch {
      toast({ title: "Error", description: "No se pudo cargar la lista.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendees();
  }, []);

  const handleVerify = async () => {
    if (!verifyDialog.payment) return;
    setVerifyLoading(true);
    try {
      const res = await fetch("/api/verify-payment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: verifyDialog.payment.id, status: verifyAction, notes: verifyNotes }),
      });
      const data = await res.json();
      if (!res.ok) { toast({ title: "Error", description: data.error, variant: "destructive" }); return; }
      toast({ title: verifyAction === "VERIFIED" ? "Pago verificado!" : "Pago rechazado" });
      setVerifyDialog({ open: false, payment: null, attendee: null });
      setVerifyNotes("");
      loadAttendees();
    } catch {
      toast({ title: "Error de conexion", variant: "destructive" });
    } finally {
      setVerifyLoading(false);
    }
  };

  const filtered = attendees.filter((a) => {
    const match = `${a.nombre} ${a.apellido} ${a.cedula} ${a.correo}`.toLowerCase().includes(searchTerm.toLowerCase());
    const status = statusFilter === "ALL" ||
      (statusFilter === "PENDING" && (!a.payment || a.payment.status === "PENDING")) ||
      (statusFilter === "VERIFIED" && a.payment?.status === "VERIFIED") ||
      (statusFilter === "REJECTED" && a.payment?.status === "REJECTED") ||
      (statusFilter === "NO_PAYMENT" && !a.payment);
    return match && status;
  });

  const totalRecaudado = attendees
    .filter((a) => a.payment?.status === "VERIFIED")
    .reduce((sum, a) => {
      const precio = PRECIOS[a.profesion] || "15 \u20ac";
      const monto = parseFloat(precio.replace(/\D/g, ""));
      return sum + monto;
    }, 0);

  const getStatusBadge = (a: Attendee) => {
    if (!a.payment) return <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50"><Clock className="size-3 mr-1" />Sin pago</Badge>;
    switch (a.payment.status) {
      case "VERIFIED": return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-100"><CheckCircle2 className="size-3 mr-1" />Verificado</Badge>;
      case "REJECTED": return <Badge variant="destructive"><XCircle className="size-3 mr-1" />Rechazado</Badge>;
      default: return <Badge variant="outline" className="border-blue-400 text-blue-600 bg-blue-50"><Clock className="size-3 mr-1" />Pendiente</Badge>;
    }
  };

  const exportCSV = () => {
    const headers = ["Nombre", "Apellido", "Cedula", "Telefono", "Correo", "Profesion", "Cargo", "Estado Pago", "Referencia", "Fecha Registro"];
    const rows = filtered.map((a) => [
      a.nombre, a.apellido, a.cedula, a.telefono, a.correo, a.profesion, a.cargo,
      a.payment?.status || "Sin pago", a.payment?.referencia || "",
      new Date(a.registeredAt).toLocaleDateString("es-VE"),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `asistentes_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Top bar */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="cursor-pointer">
              <ArrowLeft className="size-4 mr-1" /> Volver
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Users className="size-5 text-emerald-600" />
              <h1 className="font-semibold text-lg">Panel de Asistentes</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV} className="cursor-pointer">
              <Download className="size-4 mr-1" /> Exportar CSV
            </Button>
            <Button variant="outline" size="sm" onClick={loadAttendees} disabled={loading} className="cursor-pointer">
              <RefreshCw className={`size-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Actualizar
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card className="p-4">
            <p className="text-2xl font-bold">{attendees.length}</p>
            <p className="text-xs text-muted-foreground">Total Registrados</p>
          </Card>
          <Card className="p-4 bg-emerald-50 border-emerald-200">
            <p className="text-2xl font-bold text-emerald-700">{attendees.filter((a) => a.payment?.status === "VERIFIED").length}</p>
            <p className="text-xs text-emerald-600">Verificados</p>
          </Card>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-2xl font-bold text-blue-700">{attendees.filter((a) => a.payment?.status === "PENDING").length}</p>
            <p className="text-xs text-blue-600">Pendientes</p>
          </Card>
          <Card className="p-4 bg-amber-50 border-amber-200">
            <p className="text-2xl font-bold text-amber-700">{attendees.filter((a) => !a.payment).length}</p>
            <p className="text-xs text-amber-600">Sin pago</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-200 col-span-2 md:col-span-1">
            <p className="text-2xl font-bold text-emerald-800">{totalRecaudado} &euro;</p>
            <p className="text-xs text-emerald-700">Recaudado (verificados)</p>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Lista de Asistentes</CardTitle>
            <CardDescription>Gestiona registros y verifica pagos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Buscar por nombre, cedula o correo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <ChevronDown className="size-4" />
                  <SelectValue placeholder="Filtrar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="VERIFIED">Verificados</SelectItem>
                    <SelectItem value="PENDING">Pendientes</SelectItem>
                    <SelectItem value="NO_PAYMENT">Sin pago</SelectItem>
                    <SelectItem value="REJECTED">Rechazados</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <span className="size-8 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin block mx-auto" />
                <p className="text-muted-foreground mt-4">Cargando asistentes...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Users className="size-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No se encontraron resultados.</p>
              </div>
            ) : (
              <div className="max-h-[600px] overflow-y-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-8">#</TableHead>
                      <TableHead>Asistente</TableHead>
                      <TableHead className="hidden md:table-cell">Cedula</TableHead>
                      <TableHead className="hidden lg:table-cell">Profesion</TableHead>
                      <TableHead className="hidden md:table-cell">Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((a, i) => (
                      <TableRow key={a.id}>
                        <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{a.nombre} {a.apellido}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{a.cedula}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-sm">{a.cedula}</TableCell>
                        <TableCell className="hidden lg:table-cell"><Badge variant="secondary" className="text-xs">{a.profesion}</Badge></TableCell>
                        <TableCell className="hidden md:table-cell text-sm font-semibold">{PRECIOS[a.profesion] || "15 \u20ac"}</TableCell>
                        <TableCell>{getStatusBadge(a)}</TableCell>
                        <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{new Date(a.registeredAt).toLocaleDateString("es-VE")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {a.payment && (
                              <Button size="sm" variant="ghost" className="h-8 cursor-pointer" onClick={() => setImagePreview({ open: true, src: a.payment!.capture, name: `${a.nombre} ${a.apellido}` })}>
                                <ImageIcon className="size-3.5" />
                              </Button>
                            )}
                            {a.payment?.status === "PENDING" && (
                              <Button size="sm" variant="ghost" className="text-emerald-600 hover:bg-emerald-50 h-8 cursor-pointer" onClick={() => setVerifyDialog({ open: true, payment: a.payment!, attendee: a })}>
                                <ShieldCheck className="size-3.5" />
                              </Button>
                            )}
                            <a href={`mailto:${a.correo}`} className="inline-flex items-center justify-center size-8 rounded-md hover:bg-muted cursor-pointer">
                              <Mail className="size-3.5 text-muted-foreground" />
                            </a>
                            <a href={`tel:${a.telefono}`} className="inline-flex items-center justify-center size-8 rounded-md hover:bg-muted cursor-pointer">
                              <Phone className="size-3.5 text-muted-foreground" />
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-4 text-right">
              Mostrando {filtered.length} de {attendees.length} asistentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Verify Dialog */}
      <Dialog open={verifyDialog.open} onOpenChange={(open) => !open && setVerifyDialog({ open: false, payment: null, attendee: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldCheck className="size-5 text-emerald-600" />Verificar Pago</DialogTitle>
            <DialogDescription>
              {verifyDialog.attendee && <>Asistente: <span className="font-medium text-foreground">{verifyDialog.attendee.nombre} {verifyDialog.attendee.apellido}</span></>}
            </DialogDescription>
          </DialogHeader>
          {verifyDialog.payment && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Referencia:</span><span className="font-mono font-medium">{verifyDialog.payment.referencia}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tlf. Emisor:</span><span className="font-mono">{verifyDialog.payment.telefonoEmisor}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Banco:</span><span>{verifyDialog.payment.bancoEmisor}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Fecha:</span><span>{new Date(verifyDialog.payment.submittedAt).toLocaleString("es-VE")}</span></div>
              </div>
              <div className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setImagePreview({ open: true, src: verifyDialog.payment!.capture, name: "Comprobante" })}>
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img src={verifyDialog.payment.capture} alt="Comprobante" className="w-full h-full object-contain" />
                </div>
                <div className="p-2 text-center text-xs text-muted-foreground">Clic para ampliar</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notas (opcional)</label>
                <Textarea placeholder="Notas sobre la verificacion..." value={verifyNotes} onChange={(e) => setVerifyNotes(e.target.value)} rows={2} />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer" onClick={() => { setVerifyAction("VERIFIED"); handleVerify(); }} disabled={verifyLoading}>
                  {verifyLoading && verifyAction === "VERIFIED" ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="size-4 mr-1.5" />}
                  Verificar
                </Button>
                <Button variant="destructive" className="flex-1 cursor-pointer" onClick={() => { setVerifyAction("REJECTED"); handleVerify(); }} disabled={verifyLoading}>
                  {verifyLoading && verifyAction === "REJECTED" ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <XCircle className="size-4 mr-1.5" />}
                  Rechazar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview */}
      <Dialog open={imagePreview.open} onOpenChange={(open) => setImagePreview((p) => ({ ...p, open }))}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
          <div className="bg-black relative">
            <img src={imagePreview.src} alt={imagePreview.name} className="w-full max-h-[80vh] object-contain" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-sm font-medium">{imagePreview.name}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-xs text-muted-foreground text-center">Panel de Administracion - I Jornada de Egresados &ldquo;Dra. Analiese Cordero&rdquo;</p>
        </div>
      </footer>
    </div>
  );
}
