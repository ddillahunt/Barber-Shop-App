import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getAppointments, deleteAppointment, saveAppointment, updateAppointment, getMessages, deleteMessage, type Appointment, type Message } from "../lib/appointments";
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
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Scissors, LogOut, CalendarDays, Users, RefreshCw, Trash2, MessageSquare, Plus, X, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from "date-fns";

const barbers = [
  { id: "1", name: "Yorki", specialty: "(774) 244-2984" },
  { id: "2", name: "Maestro", specialty: "(774) 204-1098" },
  { id: "3", name: "El Menor", specialty: "(774) 219-1098" },
  { id: "4", name: "Yefri", specialty: "(774) 303-8891" },
  { id: "5", name: "Joel", specialty: "(774) 522-9135" },
  { id: "6", name: "Montro", specialty: "(508) 371-5827" },
  { id: "7", name: "Jairo", specialty: "(347) 374-9866" },
  { id: "8", name: "Jose", specialty: "(774) 279-2881" },
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
    name: "", email: "", phone: "", barber: "", service: "", date: "", time: "", notes: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState({
    name: "", email: "", phone: "", barber: "", service: "", date: "", time: "", notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [expandedBarbers, setExpandedBarbers] = useState<string[]>([]);

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
    const appt = appointments.find((a) => a.id === id);
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));

      if (appt?.email) {
        try {
          await emailjs.send(
            "service_grandesligas",
            "template_yqpkz9e",
            {
              to_email: appt.email,
              to_name: appt.name,
              name: appt.name,
              email: appt.email,
              phone: appt.phone,
              barber: appt.barber,
              service: appt.service,
              date: appt.date,
              time: appt.time,
              message: `Your appointment on ${appt.date}${appt.time ? ` at ${appt.time}` : ""}${appt.barber ? ` with ${appt.barber}` : ""} has been cancelled. Please contact us if you have any questions or would like to reschedule.`,
            },
            "byZkVrNvtLJutxIt5"
          );
          toast.success("Appointment deleted & cancellation email sent to " + appt.email);
        } catch (err) {
          toast.error("Appointment deleted but email failed: " + (err instanceof Error ? err.message : String(err)));
        }
      } else {
        toast.success("Appointment deleted (no email on file)");
      }
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

  const handleEditOpen = (appt: Appointment) => {
    setEditingAppt(appt);
    setEditForm({
      name: appt.name || "",
      email: appt.email || "",
      phone: appt.phone || "",
      barber: appt.barber || "",
      service: appt.service || "",
      date: appt.date || "",
      time: appt.time || "",
      notes: appt.notes || "",
    });
  };

  const handleEditSave = async () => {
    if (!editingAppt?.id) return;
    if (!editForm.name || !editForm.phone || !editForm.date) {
      toast.error("Name, phone, and date are required");
      return;
    }
    setSaving(true);
    try {
      await updateAppointment(editingAppt.id, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        barber: editForm.barber,
        service: editForm.service,
        date: editForm.date,
        time: editForm.time,
        notes: editForm.notes,
      });
      setAppointments((prev) =>
        prev.map((a) => a.id === editingAppt.id ? { ...a, ...editForm } : a)
      );
      toast.success("Appointment updated");
      setEditingAppt(null);
    } catch {
      toast.error("Failed to update appointment");
    } finally {
      setSaving(false);
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

      // Send notification email to owner
      try {
        await emailjs.send(
          "service_grandesligas",
          "template_s4xq8bl",
          {
            to_email: "ddillahunt59@gmail.com",
            from_name: newAppt.name,
            name: newAppt.name,
            email: newAppt.email,
            phone: newAppt.phone,
            barber: newAppt.barber,
            service: newAppt.service,
            date: newAppt.date,
            time: newAppt.time,
            notes: newAppt.notes,
          },
          "byZkVrNvtLJutxIt5"
        );
      } catch {
        console.error("Owner email failed");
      }

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
              notes: newAppt.notes,
            },
            "byZkVrNvtLJutxIt5"
          );
        } catch {
          console.error("Customer email failed");
        }
      }

      toast.success("Appointment created & emails sent");
      setNewAppt({ name: "", email: "", phone: "", barber: "", service: "", date: "", time: "", notes: "" });
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

  const bookedTimesForDate = newAppt.date
    ? appointments.filter((a) => a.date === newAppt.date).map((a) => a.time).filter(Boolean)
    : [];
  const availableTimeSlots = timeSlots.filter((t) => !bookedTimesForDate.includes(t));

  const appointmentDates = appointments.reduce<Record<string, number>>((acc, appt) => {
    if (appt.date) acc[appt.date] = (acc[appt.date] || 0) + 1;
    return acc;
  }, {});
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const selectedDateAppointments = appointments.filter((a) => a.date === selectedDateStr);

  const editBookedTimes = editForm.date
    ? appointments.filter((a) => a.date === editForm.date && a.id !== editingAppt?.id).map((a) => a.time).filter(Boolean)
    : [];
  const editAvailableTimeSlots = timeSlots.filter((t) => !editBookedTimes.includes(t));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-slate-900 to-black border-b-2 border-amber-500/50 px-4 py-4">
        <div className="container mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg">
              <Scissors className="size-5 text-black" />
            </div>
            <span className="font-bold italic text-lg bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Grandes Ligas Admin Dashboard
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

        {/* Appointments by Barber */}
        <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">Individual Barber Appointments</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-2">
          {barbers.map((barber) => {
            const count = appointments.filter((a) => a.barber?.startsWith(barber.name)).length;
            const todayBarberCount = appointments.filter(
              (a) => a.barber?.startsWith(barber.name) && a.date === todayStr
            ).length;
            const isExpanded = expandedBarbers.includes(barber.name);
            return (
              <Card
                key={barber.id}
                onClick={() => setExpandedBarbers(isExpanded ? expandedBarbers.filter((b) => b !== barber.name) : [...expandedBarbers, barber.name])}
                className={`border-amber-500/30 bg-white cursor-pointer transition-all hover:shadow-lg hover:border-amber-500/60 ${isExpanded ? "ring-2 ring-amber-500" : ""}`}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-bold text-slate-900 text-sm mb-1">{barber.name}</div>
                  <div className="text-2xl font-bold text-amber-600">{count}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {todayBarberCount} today
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Expanded Barber Appointments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {expandedBarbers.map((barberName) => {
          const barberAppts = appointments.filter((a) => a.barber?.startsWith(barberName));
          return (
            <Card key={barberName} className="border-amber-500/30 bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg text-slate-900">{barberName}'s Appointments ({barberAppts.length})</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setExpandedBarbers(expandedBarbers.filter((b) => b !== barberName))}>
                  <X className="size-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {barberAppts.length === 0 ? (
                  <p className="text-slate-500 text-sm py-4 text-center">No appointments for {barberName}.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {barberAppts.map((appt) => (
                      <div
                        key={appt.id}
                        className="p-4 rounded-lg border border-slate-200 hover:border-amber-500/50 hover:bg-amber-50/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-slate-900">{appt.name}</div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{appt.source?.toUpperCase() || "EN"}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditOpen(appt)}
                              className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 h-7 w-7 p-0"
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                          <div className="text-slate-500">Date</div>
                          <div className="text-slate-800">{appt.date}</div>
                          <div className="text-slate-500">Time</div>
                          <div className="text-slate-800">{appt.time || "—"}</div>
                          <div className="text-slate-500">Phone</div>
                          <div className="text-slate-800">{appt.phone || "—"}</div>
                          <div className="text-slate-500">Email</div>
                          <div className="text-slate-800 truncate">{appt.email || "—"}</div>
                          <div className="text-slate-500">Service</div>
                          <div className="text-slate-800">{appt.service || "—"}</div>
                          {appt.notes && (
                            <>
                              <div className="text-slate-500">Notes</div>
                              <div className="text-slate-800 truncate">{appt.notes}</div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
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
                  <Input id="new-date" type="date" value={newAppt.date} onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value, time: "" })} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-time">Time</Label>
                  <Select value={newAppt.time} onValueChange={(v) => setNewAppt({ ...newAppt, time: v })}>
                    <SelectTrigger id="new-time"><SelectValue placeholder={availableTimeSlots.length === 0 && newAppt.date ? "No times available" : "Select a time"} /></SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="new-notes">Notes</Label>
                  <Textarea id="new-notes" value={newAppt.notes} onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })} placeholder="Any special requests or additional information" rows={2} />
                </div>
                <div className="flex items-end md:col-span-2">
                  <Button type="submit" disabled={creating} className="h-9 px-4 text-sm bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-bold hover:from-amber-600 hover:to-yellow-700">
                    {creating ? "Creating..." : "Create Appointment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Appointments Section with Tabs */}
        <Card className="border-amber-500/30 bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-slate-900">All Appointments</CardTitle>
            {!showCreateForm && (
              <Button size="sm" onClick={() => setShowCreateForm(true)} className="h-8 px-3 text-xs bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-bold hover:from-amber-600 hover:to-yellow-700">
                <Plus className="size-3 mr-1" />
                New Appointment
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>

              <TabsContent value="table">
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
                          <TableHead>Notes</TableHead>
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
                            <TableCell className="max-w-[150px] truncate">{appt.notes || "—"}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{appt.source?.toUpperCase() || "EN"}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleEditOpen(appt)} className="text-amber-600 hover:text-amber-800 hover:bg-amber-50">
                                  <Pencil className="size-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(appt.id!)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="calendar">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-4">
                  <Button variant="outline" size="sm" onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}>
                    <ChevronLeft className="size-4" />
                  </Button>
                  <h3 className="font-bold text-lg text-slate-900">
                    {format(calendarMonth, "MMMM yyyy")}
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 border-b border-slate-200">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="py-2 text-center text-sm font-semibold text-slate-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 border-l border-slate-200">
                  {(() => {
                    const monthStart = startOfMonth(calendarMonth);
                    const monthEnd = endOfMonth(calendarMonth);
                    const gridStart = startOfWeek(monthStart);
                    const gridEnd = endOfWeek(monthEnd);
                    const days: Date[] = [];
                    let d = gridStart;
                    while (d <= gridEnd) {
                      days.push(d);
                      d = addDays(d, 1);
                    }
                    return days.map((day) => {
                      const dateStr = format(day, "yyyy-MM-dd");
                      const dayAppts = appointments.filter((a) => a.date === dateStr);
                      const inMonth = isSameMonth(day, calendarMonth);
                      const today = isToday(day);
                      const selected = selectedDate && isSameDay(day, selectedDate);
                      return (
                        <div
                          key={dateStr}
                          onClick={() => setSelectedDate(day)}
                          className={`min-h-[120px] border-r border-b border-slate-200 p-1.5 cursor-pointer transition-colors ${
                            !inMonth ? "bg-slate-50/50" : "bg-white hover:bg-amber-50/30"
                          } ${selected ? "ring-2 ring-amber-500 ring-inset" : ""}`}
                        >
                          <div className={`text-xs font-medium mb-1 ${
                            today ? "bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center" :
                            !inMonth ? "text-slate-300" : "text-slate-700"
                          }`}>
                            {format(day, "d")}
                          </div>
                          <div className="space-y-1">
                            {dayAppts.slice(0, 3).map((appt) => (
                              <div
                                key={appt.id}
                                onClick={(e) => { e.stopPropagation(); handleEditOpen(appt); }}
                                className="text-xs p-1 rounded bg-amber-100 border border-amber-200 hover:bg-amber-200 cursor-pointer truncate transition-colors"
                                title={`${appt.time || ""} ${appt.name} - ${appt.barber || ""} - ${appt.service || ""} - ${appt.phone || ""}`}
                              >
                                <span className="font-semibold">{appt.time || "—"}</span>{" "}
                                <span className="text-slate-700">{appt.name}</span>
                              </div>
                            ))}
                            {dayAppts.length > 3 && (
                              <div className="text-xs text-amber-600 font-medium pl-1">
                                +{dayAppts.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Selected day detail panel */}
                {selectedDate && (
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <h3 className="font-semibold text-slate-900 mb-3 text-lg">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      <span className="text-sm font-normal text-slate-500 ml-2">
                        ({selectedDateAppointments.length} appointment{selectedDateAppointments.length !== 1 ? "s" : ""})
                      </span>
                    </h3>
                    {selectedDateAppointments.length === 0 ? (
                      <p className="text-slate-500 text-sm py-2">No appointments on this date.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedDateAppointments.map((appt) => (
                          <div
                            key={appt.id}
                            onClick={() => handleEditOpen(appt)}
                            className="p-4 rounded-lg border border-slate-200 hover:border-amber-500/50 hover:bg-amber-50/50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold text-slate-900 text-base">{appt.name}</div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge variant="outline">{appt.source?.toUpperCase() || "EN"}</Badge>
                                <Pencil className="size-4 text-amber-500" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                              <div className="text-slate-500">Time</div>
                              <div className="text-slate-800">{appt.time || "—"}</div>
                              <div className="text-slate-500">Phone</div>
                              <div className="text-slate-800">{appt.phone || "—"}</div>
                              <div className="text-slate-500">Email</div>
                              <div className="text-slate-800">{appt.email || "—"}</div>
                              <div className="text-slate-500">Barber</div>
                              <div className="text-slate-800">{appt.barber || "—"}</div>
                              <div className="text-slate-500">Service</div>
                              <div className="text-slate-800">{appt.service || "—"}</div>
                              <div className="text-slate-500">Notes</div>
                              <div className="text-slate-800">{appt.notes || "—"}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
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
        <p className="text-center text-slate-400 text-sm mt-8 mb-4">Powered by GDI Digital Solutions</p>
      </main>

      {/* Edit Appointment Dialog */}
      <Dialog open={!!editingAppt} onOpenChange={(open) => { if (!open) setEditingAppt(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>Update the appointment details below.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input id="edit-name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-phone">Phone *</Label>
              <Input id="edit-phone" type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: formatPhone(e.target.value) })} maxLength={14} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-barber">Barber</Label>
              <Select value={editForm.barber} onValueChange={(v) => setEditForm({ ...editForm, barber: v })}>
                <SelectTrigger id="edit-barber"><SelectValue placeholder="Select a barber" /></SelectTrigger>
                <SelectContent>
                  {barbers.map((b) => (
                    <SelectItem key={b.id} value={`${b.name} - ${b.specialty}`}>{b.name} - {b.specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-service">Service</Label>
              <Select value={editForm.service} onValueChange={(v) => setEditForm({ ...editForm, service: v })}>
                <SelectTrigger id="edit-service"><SelectValue placeholder="Select a service" /></SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-date">Date *</Label>
              <Input id="edit-date" type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value, time: "" })} />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="edit-time">Time</Label>
              <Select value={editForm.time} onValueChange={(v) => setEditForm({ ...editForm, time: v })}>
                <SelectTrigger id="edit-time">
                  <SelectValue placeholder={editAvailableTimeSlots.length === 0 && editForm.date ? "No times available" : "Select a time"} />
                </SelectTrigger>
                <SelectContent>
                  {editAvailableTimeSlots.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea id="edit-notes" value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} placeholder="Any special requests or additional information" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAppt(null)}>Cancel</Button>
            <Button onClick={handleEditSave} disabled={saving} className="bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-bold hover:from-amber-600 hover:to-yellow-700">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
