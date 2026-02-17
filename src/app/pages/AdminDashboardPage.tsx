import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getAppointments, deleteAppointment, saveAppointment, getMessages, deleteMessage, type Appointment, type Message } from "../lib/appointments";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Scissors, LogOut, CalendarDays, Users, RefreshCw, Trash2, MessageSquare, Plus, X } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const barbers = [
  { id: "1", name: "Carlos Martinez", specialty: "Classic Cuts" },
  { id: "2", name: "Miguel Rodriguez", specialty: "Modern Styles" },
  { id: "3", name: "Juan Hernandez", specialty: "Beard Specialist" },
  { id: "4", name: "Diego Santos", specialty: "All-Around Master" },
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM",
];

const services = [
  "Classic Haircut",
  "Premium Cut & Style",
  "Beard Trim & Shape",
  "Full Grooming Package",
];

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAppt, setNewAppt] = useState({
    name: "", email: "", phone: "", barber: "", service: "", date: "", time: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        fetchAppointments();
        fetchMessages();
      } else {
        navigate("/admin/login");
      }
    });
    return unsubscribe;
  }, [navigate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch {
      toast.error("Failed to load messages");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.success("Appointment deleted");
    } catch {
      toast.error("Failed to delete appointment");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.name || !newAppt.phone || !newAppt.date) {
      toast.error("Name, phone, and date are required");
      return;
    }
    setCreating(true);
    try {
      await saveAppointment({ ...newAppt, source: "en" });

      // Send confirmation email to customer if email provided
      if (newAppt.email) {
        try {
          await emailjs.send(
            "service_grandesligas",
            "template_yqpkz9e",
            {
              to_email: newAppt.email,
              to_name: newAppt.name,
              name: newAppt.name,
              email: newAppt.email,
              phone: newAppt.phone,
              barber: newAppt.barber,
              service: newAppt.service,
              date: newAppt.date,
              time: newAppt.time,
            },
            "byZkVrNvtLJutxIt5"
          );
        } catch {
          console.error("Customer email failed");
        }
      }

      toast.success(newAppt.email ? "Appointment created & confirmation email sent" : "Appointment created");
      setNewAppt({ name: "", email: "", phone: "", barber: "", service: "", date: "", time: "" });
      setShowCreateForm(false);
      fetchAppointments();
    } catch {
      toast.error("Failed to create appointment");
    } finally {
      setCreating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  if (!authenticated) return null;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayCount = appointments.filter((a) => a.date === todayStr).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-slate-900 to-black border-b-2 border-amber-500/50 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg">
              <Scissors className="size-5 text-black" />
            </div>
            <span className="font-bold italic text-lg bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Grandes Ligas Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => { fetchAppointments(); fetchMessages(); }}
              className="bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-bold hover:from-amber-600 hover:to-yellow-700"
            >
              <RefreshCw className="size-4 mr-1" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={handleSignOut}
              className="bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-bold hover:from-amber-600 hover:to-yellow-700"
            >
              <LogOut className="size-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-amber-500/30 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-500">Total Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CalendarDays className="size-5 text-amber-500" />
                <span className="text-3xl font-bold text-slate-900">{appointments.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-500">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="size-5 text-amber-500" />
                <span className="text-3xl font-bold text-slate-900">{todayCount}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-500">Booking Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                  EN: {appointments.filter((a) => a.source === "en").length}
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  ES: {appointments.filter((a) => a.source === "es").length}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-500">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageSquare className="size-5 text-amber-500" />
                <span className="text-3xl font-bold text-slate-900">{messages.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Appointment */}
        {showCreateForm && (
          <Card className="border-amber-500/30 bg-white mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-slate-900">New Appointment</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="new-name">Full Name *</Label>
                  <Input id="new-name" value={newAppt.name} onChange={(e) => setNewAppt({ ...newAppt, name: e.target.value })} placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-phone">Phone *</Label>
                  <Input id="new-phone" type="tel" value={newAppt.phone} onChange={(e) => setNewAppt({ ...newAppt, phone: formatPhone(e.target.value) })} placeholder="(508) 872-5556" maxLength={14} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-email">Email</Label>
                  <Input id="new-email" type="email" value={newAppt.email} onChange={(e) => setNewAppt({ ...newAppt, email: e.target.value })} placeholder="john@example.com" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-barber">Barber</Label>
                  <Select value={newAppt.barber} onValueChange={(v) => setNewAppt({ ...newAppt, barber: v })}>
                    <SelectTrigger id="new-barber"><SelectValue placeholder="Select a barber" /></SelectTrigger>
                    <SelectContent>
                      {barbers.map((b) => (
                        <SelectItem key={b.id} value={`${b.name} - ${b.specialty}`}>{b.name} - {b.specialty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-service">Service</Label>
                  <Select value={newAppt.service} onValueChange={(v) => setNewAppt({ ...newAppt, service: v })}>
                    <SelectTrigger id="new-service"><SelectValue placeholder="Select a service" /></SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-date">Date *</Label>
                  <Input id="new-date" type="date" value={newAppt.date} onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-time">Time</Label>
                  <Select value={newAppt.time} onValueChange={(v) => setNewAppt({ ...newAppt, time: v })}>
                    <SelectTrigger id="new-time"><SelectValue placeholder="Select a time" /></SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={creating} className="w-full bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-bold hover:from-amber-600 hover:to-yellow-700">
                    {creating ? "Creating..." : "Create Appointment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Appointments Table */}
        <Card className="border-amber-500/30 bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-slate-900">All Appointments</CardTitle>
            {!showCreateForm && (
              <Button size="sm" onClick={() => setShowCreateForm(true)} className="bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-bold hover:from-amber-600 hover:to-yellow-700">
                <Plus className="size-4 mr-1" />
                New Appointment
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-slate-500 py-8">Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No appointments yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Barber</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appt) => (
                      <TableRow key={appt.id}>
                        <TableCell className="font-medium">{appt.name}</TableCell>
                        <TableCell>{appt.phone}</TableCell>
                        <TableCell>{appt.email || "—"}</TableCell>
                        <TableCell>{appt.barber || "—"}</TableCell>
                        <TableCell>{appt.service || "—"}</TableCell>
                        <TableCell>{appt.date}</TableCell>
                        <TableCell>{appt.time || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{appt.source?.toUpperCase() || "EN"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(appt.id!)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Messages Table */}
        <Card className="border-amber-500/30 bg-white mt-8">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No messages yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((msg) => (
                      <TableRow key={msg.id}>
                        <TableCell className="font-medium">{msg.name}</TableCell>
                        <TableCell>{msg.phone || "—"}</TableCell>
                        <TableCell>{msg.email}</TableCell>
                        <TableCell className="max-w-md truncate">{msg.message}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{msg.source?.toUpperCase() || "EN"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMessage(msg.id!)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
