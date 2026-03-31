"use client";

import { useState, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  Stethoscope,
  UserPlus,
  CreditCard,
  CheckCircle2,
  Upload,
  AlertCircle,
  Camera,
  ShieldCheck,
  Phone,
  Mail,
  CalendarDays,
  MapPin,
  Clock,
  ImageIcon,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Award,
  BookOpen,
  CircleDollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types
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

// Professions with pricing tiers
type PrecioCategoria = "BACHILLER" | "GENERAL" | "ESPECIALISTA";

const PROFESIONES: { value: string; label: string; precio: PrecioCategoria }[] = [
  { value: "Bachiller", label: "Bachiller", precio: "BACHILLER" },
  { value: "Medico General", label: "Medico General / Residente", precio: "GENERAL" },
  { value: "Medico Especialista", label: "Medico Especialista", precio: "ESPECIALISTA" },
  { value: "Enfermero/a", label: "Enfermero/a", precio: "GENERAL" },
  { value: "Farmaceutico/a", label: "Farmaceutico/a", precio: "GENERAL" },
  { value: "Odontologo/a", label: "Odontologo/a", precio: "GENERAL" },
  { value: "Psicologo/a", label: "Psicologo/a", precio: "GENERAL" },
  { value: "Nutricionista", label: "Nutricionista", precio: "GENERAL" },
  { value: "Fisioterapeuta", label: "Fisioterapeuta", precio: "GENERAL" },
  { value: "Bioanalista", label: "Bioanalista", precio: "GENERAL" },
  { value: "Estudiante de Salud", label: "Estudiante de Salud (Residente)", precio: "GENERAL" },
  { value: "Otro", label: "Otro", precio: "GENERAL" },
];

const PRECIOS: Record<PrecioCategoria, { monto: string; label: string }> = {
  BACHILLER: { monto: "10 €", label: "Bachilleres" },
  GENERAL: { monto: "15 €", label: "Medicos generales, residentes y enfermeria" },
  ESPECIALISTA: { monto: "25 €", label: "Especialistas" },
};

const BANCOS = [
  { value: "Banco de Venezuela (BDV)", label: "Banco de Venezuela (BDV)" },
  { value: "Banco Mercantil", label: "Banco Mercantil" },
  { value: "Banco Provincial (BBVA)", label: "Banco Provincial (BBVA)" },
  { value: "Banesco", label: "Banesco" },
  { value: "BNC", label: "Banco Nacional de Credito (BNC)" },
  { value: "Banco Bicentenario", label: "Banco Bicentenario" },
  { value: "Bancamiga", label: "Bancamiga" },
  { value: "Banco del Tesoro", label: "Banco del Tesoro" },
  { value: "Banco Fondo Comun", label: "Banco Fondo Comun" },
  { value: "Otro", label: "Otro" },
];

const PAGO_MOVIL_INFO = {
  banco: "0105 - Banco de Venezuela",
  cedula: "V-21395851",
  telefono: "0424-5421151",
};

function getPrecio(profesion: string): { monto: string; label: string } {
  const found = PROFESIONES.find((p) => p.value === profesion);
  if (!found) return PRECIOS.GENERAL;
  return PRECIOS[found.precio];
}

// Inner component that uses useSearchParams
function CongressPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("registro");

  // Registration
  const [regForm, setRegForm] = useState({ cedula: "", nombre: "", apellido: "", telefono: "", correo: "", profesion: "", cargo: "" });
  const [regLoading, setRegLoading] = useState(false);
  const [registeredAttendee, setRegisteredAttendee] = useState<Attendee | null>(null);

  // Payment
  const [payForm, setPayForm] = useState({ attendeeId: "", referencia: "", telefonoEmisor: "", bancoEmisor: "" });
  const [payCapture, setPayCapture] = useState<string>("");
  const [payLoading, setPayLoading] = useState(false);

  const currentPrecio = regForm.profesion ? getPrecio(regForm.profesion) : null;

  const handleRegChange = (field: string, value: string) => {
    setRegForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegistration = async () => {
    if (!regForm.cedula || !regForm.nombre || !regForm.apellido || !regForm.telefono || !regForm.correo || !regForm.profesion || !regForm.cargo) {
      toast({ title: "Campos incompletos", description: "Complete todos los campos.", variant: "destructive" });
      return;
    }
    setRegLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Error en el registro", description: data.error, variant: "destructive" });
        return;
      }
      setRegisteredAttendee(data.attendee);
      setPayForm((prev) => ({ ...prev, attendeeId: data.attendee.id }));
      setRegForm({ cedula: "", nombre: "", apellido: "", telefono: "", correo: "", profesion: "", cargo: "" });
      toast({ title: "Registro exitoso!", description: `${data.attendee.nombre} ${data.attendee.apellido} ha sido registrado.` });
      // Auto-switch to payment tab
      setTimeout(() => setActiveTab("pago"), 800);
    } catch {
      toast({ title: "Error de conexion", variant: "destructive" });
    } finally {
      setRegLoading(false);
    }
  };

  const goToPayment = () => {
    setActiveTab("pago");
  };

  const handleCaptureChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Archivo muy grande", description: "Maximo 5MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPayCapture(reader.result as string);
    reader.readAsDataURL(file);
  }, [toast]);

  const handlePayment = async () => {
    if (!payForm.attendeeId || !payForm.referencia || !payForm.telefonoEmisor || !payForm.bancoEmisor || !payCapture) {
      toast({ title: "Campos incompletos", description: "Complete todos los campos incluyendo la captura.", variant: "destructive" });
      return;
    }
    if (payForm.referencia.length !== 4) {
      toast({ title: "Referencia invalida", description: "Debe tener exactamente 4 digitos.", variant: "destructive" });
      return;
    }
    setPayLoading(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payForm, capture: payCapture }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Error al registrar pago", description: data.error, variant: "destructive" });
        return;
      }
      toast({ title: "Pago registrado!", description: "Su comprobante ha sido enviado. Sera verificado." });
      setPayForm({ attendeeId: "", referencia: "", telefonoEmisor: "", bancoEmisor: "" });
      setPayCapture("");
      setRegisteredAttendee(null);
      setRegForm({ cedula: "", nombre: "", apellido: "", telefono: "", correo: "", profesion: "", cargo: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setActiveTab("registro");
    } catch {
      toast({ title: "Error de conexion", variant: "destructive" });
    } finally {
      setPayLoading(false);
    }
  };

  const registeredPrecio = registeredAttendee ? getPrecio(registeredAttendee.profesion) : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg bg-white/10 flex-shrink-0">
                  <img src="/congress-logo.jpeg" alt="Logo" className="w-full h-full object-contain p-0.5" />
                </div>
                <div>
                  <span className="text-emerald-200 font-medium tracking-wide uppercase text-xs">XXIV Promocion Puericultura y Pediatria</span>
                  <p className="text-emerald-300/80 text-xs">IVSS - UCV, 2026</p>
                </div>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-2">
                I Jornada de Egresados
              </h1>
              <p className="text-emerald-200 text-lg md:text-xl font-medium italic mb-4">
                &ldquo;Dra. Analiese Cordero&rdquo;
              </p>
              <p className="text-emerald-100/90 text-sm md:text-base mb-6 max-w-lg leading-relaxed">
                Encuentro academico de alto nivel disenado para fortalecer los pilares de la atencion infantil.
                Mas de 10 ponentes expertos en subespecialidades pediatricas con destacada trayectoria.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2">
                  <CalendarDays className="size-4 text-emerald-200" />
                  <span>Sabado, 16 de Mayo 2026</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2">
                  <MapPin className="size-4 text-emerald-200" />
                  <span>Club Social Canario, Acarigua</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Clock className="size-4 text-emerald-200" />
                  <span>7:30 am - 6:00 pm</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-sm font-semibold text-emerald-200 uppercase tracking-wider mb-4">Inversion</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="size-4 text-emerald-200" />
                      <span className="text-sm">Bachilleres</span>
                    </div>
                    <span className="text-lg font-bold">10 &euro;</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="size-4 text-emerald-200" />
                      <span className="text-sm">Med. Generales, Residentes y Enfermeria</span>
                    </div>
                    <span className="text-lg font-bold">15 &euro;</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Award className="size-4 text-emerald-200" />
                      <span className="text-sm">Especialistas</span>
                    </div>
                    <span className="text-lg font-bold">25 &euro;</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-emerald-200/70 text-center">
                  Avalado por la Sociedad Venezolana de Puericultura y Pediatria, filial Portuguesa
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex mb-8 h-auto p-1">
            <TabsTrigger value="registro" className="flex items-center gap-2 py-2.5 px-4 text-sm">
              <UserPlus className="size-4" />
              <span className="hidden sm:inline">Registro</span>
            </TabsTrigger>
            <TabsTrigger value="pago" className="flex items-center gap-2 py-2.5 px-4 text-sm">
              <CreditCard className="size-4" />
              <span className="hidden sm:inline">Pago Movil</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== REGISTRO TAB ===== */}
          <TabsContent value="registro">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Stethoscope className="size-5 text-emerald-600" />
                    Formulario de Registro
                  </CardTitle>
                  <CardDescription>
                    Complete sus datos para inscribirse a la I Jornada de Egresados &ldquo;Dra. Analiese Cordero&rdquo;.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cedula">Cedula de Identidad</Label>
                      <Input id="cedula" placeholder="V-12345678" value={regForm.cedula} onChange={(e) => handleRegChange("cedula", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="correo">Correo Electronico</Label>
                      <Input id="correo" type="email" placeholder="correo@ejemplo.com" value={regForm.correo} onChange={(e) => handleRegChange("correo", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input id="nombre" placeholder="Juan" value={regForm.nombre} onChange={(e) => handleRegChange("nombre", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input id="apellido" placeholder="Perez" value={regForm.apellido} onChange={(e) => handleRegChange("apellido", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Telefono</Label>
                      <Input id="telefono" placeholder="0412-1234567" value={regForm.telefono} onChange={(e) => handleRegChange("telefono", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profesion">Profesion</Label>
                      <Select value={regForm.profesion} onValueChange={(v) => handleRegChange("profesion", v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione su profesion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Profesion</SelectLabel>
                            {PROFESIONES.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                <span className="flex items-center gap-2">
                                  {p.label}
                                  <span className="text-xs text-muted-foreground ml-auto">({PRECIOS[p.precio].monto})</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="cargo">Cargo / Especialidad</Label>
                      <Input id="cargo" placeholder="Ej: Medico Cirujano General, Enfermero Jefe de UCI..." value={regForm.cargo} onChange={(e) => handleRegChange("cargo", e.target.value)} />
                    </div>
                  </div>

                  {/* Dynamic price display */}
                  {currentPrecio && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <CircleDollarSign className="size-4 text-emerald-600" />
                        <span className="text-emerald-800">Monto a pagar:</span>
                      </div>
                      <span className="text-xl font-bold text-emerald-700">{currentPrecio.monto}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {!registeredAttendee ? (
                    <Button onClick={handleRegistration} disabled={regLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer" size="lg">
                      {regLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Registrando...
                        </span>
                      ) : (
                        <>
                          <UserPlus className="size-4 mr-2" />
                          Registrarme
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={goToPayment} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-base" size="lg">
                      <CreditCard className="size-5 mr-2" />
                      Continuar al Pago
                      <ArrowRight className="size-5 ml-2" />
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Sidebar Info */}
              <div className="space-y-4">
                {registeredAttendee ? (
                  <Card className="border-emerald-200 bg-emerald-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 className="size-5" />
                        Registro Exitoso!
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <UserPlus className="size-4 text-emerald-600" />
                          <span className="font-medium">{registeredAttendee.nombre} {registeredAttendee.apellido}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="size-4 text-emerald-600" />
                          <span>C.I.: {registeredAttendee.cedula}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="size-4 text-emerald-600" />
                          <span>{registeredAttendee.correo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="size-4 text-emerald-600" />
                          <span>{registeredAttendee.profesion} - {registeredAttendee.cargo}</span>
                        </div>
                        {registeredPrecio && (
                          <div className="flex items-center gap-2 pt-2 border-t border-emerald-200">
                            <CircleDollarSign className="size-4 text-emerald-600" />
                            <span className="font-semibold text-emerald-700">Inversion: {registeredPrecio.monto}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={goToPayment} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-base" size="lg">
                        <CreditCard className="size-5 mr-2" />
                        Continuar al Pago
                        <ArrowRight className="size-5 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Sparkles className="size-5 text-emerald-600" />
                          Por que asistir?
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <BookOpen className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Actualizacion Integral</p>
                              <p className="text-xs text-muted-foreground">Abordaje de multiples subespecialidades en un solo dia.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <BookOpen className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Networking</p>
                              <p className="text-xs text-muted-foreground">Conecta con colegas y referentes de la region.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Award className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Reconocimiento</p>
                              <p className="text-xs text-muted-foreground">Espacio dedicado a la trayectoria de la Dra. Cordero.</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t space-y-1.5">
                          <ul className="text-xs text-muted-foreground space-y-1.5">
                            <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-500" />Mas de 10 ponentes expertos</li>
                            <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-500" />Certificado de asistencia</li>
                            <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-500" />Avalado por SVPP filial Portuguesa</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6">
                        <p className="text-sm font-medium mb-2">Mas informacion:</p>
                        <div className="space-y-1.5 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2"><Phone className="size-3.5" />0424-5421151</div>
                          <div className="flex items-center gap-2"><Phone className="size-3.5" />0412-7819023</div>
                          <div className="flex items-center gap-2"><Mail className="size-3.5" />@promoxxipediatria</div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ===== PAGO MOVIL TAB ===== */}
          <TabsContent value="pago">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Phone className="size-5 text-emerald-600" />
                    Datos del Pago Movil
                  </CardTitle>
                  <CardDescription>
                    Realice la transferencia por pago movil a los siguientes datos:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Banco Receptor</span>
                        <span className="font-semibold text-emerald-700">{PAGO_MOVIL_INFO.banco}</span>
                      </div>
                      <div className="border-t border-emerald-100 pt-3" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cedula / RIF</span>
                        <span className="font-mono font-semibold text-lg">{PAGO_MOVIL_INFO.cedula}</span>
                      </div>
                      <div className="border-t border-emerald-100 pt-3" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Telefono</span>
                        <span className="font-mono font-semibold text-lg">{PAGO_MOVIL_INFO.telefono}</span>
                      </div>
                      <div className="border-t border-emerald-100 pt-3" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Monto a Pagar</span>
                        <span className="text-2xl font-bold text-emerald-700">
                          {registeredPrecio ? registeredPrecio.monto : payForm.attendeeId ? "---" : "---"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="size-4 text-amber-600 mt-0.5 shrink-0" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium">Importante</p>
                          <p className="text-amber-700 mt-1">
                            Tome captura de pantalla del comprobante de pago. La necesitará para completar el registro.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Upload className="size-5 text-emerald-600" />
                    Registrar Comprobante de Pago
                  </CardTitle>
                  <CardDescription>Suba su comprobante y complete los datos de la transferencia.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="payCedula">Cedula Registrada</Label>
                      <Input id="payCedula" placeholder="V-12345678" value={payForm.attendeeId ? registeredAttendee?.cedula || "" : ""} disabled />
                      {!payForm.attendeeId && (
                        <p className="text-xs text-muted-foreground">Primero debe registrarse en la pestana &quot;Registro&quot;</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referencia">Referencia (ultimos 4 digitos)</Label>
                      <Input id="referencia" placeholder="1234" maxLength={4} value={payForm.referencia} onChange={(e) => setPayForm((prev) => ({ ...prev, referencia: e.target.value.replace(/\D/g, "").slice(0, 4) }))} disabled={!payForm.attendeeId} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tlfEmisor">Numero de Telefono del Emisor</Label>
                      <Input id="tlfEmisor" placeholder="0414-7654321" value={payForm.telefonoEmisor} onChange={(e) => setPayForm((prev) => ({ ...prev, telefonoEmisor: e.target.value }))} disabled={!payForm.attendeeId} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bancoEmisor">Banco del Emisor</Label>
                      <Select value={payForm.bancoEmisor} onValueChange={(v) => setPayForm((prev) => ({ ...prev, bancoEmisor: v }))} disabled={!payForm.attendeeId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione el banco emisor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Bancos</SelectLabel>
                            {BANCOS.map((b) => (
                              <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Captura del Comprobante</Label>
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${payCapture ? "border-emerald-300 bg-emerald-50/50" : "border-muted-foreground/25 hover:border-emerald-300"} ${!payForm.attendeeId ? "opacity-50 pointer-events-none" : ""}`}
                        onClick={() => { if (payForm.attendeeId) fileInputRef.current?.click(); }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && payForm.attendeeId) fileInputRef.current?.click(); }}
                      >
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCaptureChange} />
                        {payCapture ? (
                          <div className="space-y-2">
                            <div className="flex justify-center">
                              <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                                <img src={payCapture} alt="Vista previa" className="w-full h-full object-cover cursor-pointer" onClick={(e) => { e.stopPropagation(); setImagePreview({ open: true, src: payCapture, name: "Comprobante de pago" }); }} />
                              </div>
                            </div>
                            <p className="text-sm text-emerald-600 font-medium">Comprobante cargado</p>
                            <p className="text-xs text-muted-foreground">Clic en la imagen para ampliar</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Camera className="size-8 text-muted-foreground/50 mx-auto" />
                            <p className="text-sm text-muted-foreground">Haga clic para subir la captura</p>
                            <p className="text-xs text-muted-foreground/70">JPG, PNG (max. 5MB)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handlePayment} disabled={payLoading || !payForm.attendeeId} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer" size="lg">
                    {payLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      <>
                        <CreditCard className="size-4 mr-2" />
                        Enviar Comprobante
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md overflow-hidden border bg-white/10 flex-shrink-0">
                <img src="/congress-logo.jpeg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-medium">XXIV Promocion Puericultura y Pediatria IVSS-UCV</span>
            </div>
            <p className="text-xs text-muted-foreground">
              I Jornada de Egresados &ldquo;Dra. Analiese Cordero&rdquo; - Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return <CongressPage />;
}
