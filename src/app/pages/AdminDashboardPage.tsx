import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { deleteAppointment, saveAppointment, updateAppointment, deleteMessage, subscribeToAppointments, subscribeToMessages, saveBarber, updateBarber, deleteBarber, subscribeToBarbers, uploadBarberImage, type Appointment, type Message, type Barber } from "../lib/appointments";
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
import { Scissors, LogOut, CalendarDays, Users, User, RefreshCw, Trash2, MessageSquare, Plus, X, Pencil, ChevronLeft, ChevronRight, Check, Bell } from "lucide-react";
import { toast } from "sonner";
import { sendEmail, sendSMS } from "../lib/email";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from "date-fns";

const defaultBarbers = [
  { id: "1", name: "Yorki", phone: "(774) 244-2984" },
  { id: "2", name: "Maestro", phone: "(774) 204-1098" },
  { id: "3", name: "El Menor", phone: "(774) 219-1098" },
  { id: "4", name: "Yefri", phone: "(774) 303-8891" },
  { id: "5", name: "Joel", phone: "(774) 522-9135" },
  { id: "6", name: "Montro", phone: "(508) 371-5827" },
  { id: "7", name: "Jairo", phone: "(347) 374-9866" },
  { id: "8", name: "Jose", phone: "(774) 279-2881" },
  { id: "9", name: "Darrell Dillahunt", phone: "(774) 279-4008" },
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [barbersSeeded, setBarbersSeeded] = useState(false);
  const [showAddBarber, setShowAddBarber] = useState(false);
  const [newBarber, setNewBarber] = useState({ name: "", phone: "", imageUrl: "" });
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [editBarberForm, setEditBarberForm] = useState({ name: "", phone: "", imageUrl: "" });
  const [newBarberImage, setNewBarberImage] = useState<File | null>(null);
  const [editBarberImage, setEditBarberImage] = useState<File | null>(null);

  useEffect(() => {
    let unsubAppts: (() => void) | undefined;
    let unsubMsgs: (() => void) | undefined;
    let unsubBarbers: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        unsubAppts = subscribeToAppointments((data) => {
          setAppointments(data);
          setLoading(false);
        });
        unsubMsgs = subscribeToMessages(setMessages);
        unsubBarbers = subscribeToBarbers((data) => {
          setBarbers(data);
          // Seed default barbers into Firestore on first load if collection is empty
          if (data.length === 0 && !barbersSeeded) {
            setBarbersSeeded(true);
            defaultBarbers.forEach((b) => saveBarber({ name: b.name, phone: b.phone }));
          }
        });
      } else {
        navigate("/admin/login");
      }
    });

    return () => {
      unsubAuth();
      unsubAppts?.();
      unsubMsgs?.();
      unsubBarbers?.();
    };
  }, [navigate, barbersSeeded]);

  const handleAddBarber = async () => {
    if (!newBarber.name || !newBarber.phone) {
      toast.error("Name and phone are required");
      return;
    }
    try {
      const docRef = await saveBarber({ name: newBarber.name, phone: newBarber.phone });
      if (newBarberImage) {
        const imageUrl = await uploadBarberImage(newBarberImage, docRef.id);
        await updateBarber(docRef.id, { imageUrl });
      }
      toast.success(`${newBarber.name} added`);
      setNewBarber({ name: "", phone: "", imageUrl: "" });
      setNewBarberImage(null);
      setShowAddBarber(false);
    } catch {
      toast.error("Failed to add barber");
    }
  };

  const handleEditBarberOpen = (barber: Barber) => {
    setEditingBarber(barber);
    setEditBarberForm({ name: barber.name, phone: barber.phone, imageUrl: barber.imageUrl || "" });
  };

  const handleEditBarberSave = async () => {
    if (!editingBarber?.id) return;
    if (!editBarberForm.name || !editBarberForm.phone) {
      toast.error("Name and phone are required");
      return;
    }
    try {
      let imageUrl = editBarberForm.imageUrl || "";
      if (editBarberImage) {
        imageUrl = await uploadBarberImage(editBarberImage, editingBarber.id);
      }
      await updateBarber(editingBarber.id, { name: editBarberForm.name, phone: editBarberForm.phone, imageUrl });
      toast.success(`${editBarberForm.name} updated`);
      setEditBarberImage(null);
      setEditingBarber(null);
    } catch (err) {
      console.error("Failed to update barber:", err);
      toast.error("Failed to update barber");
    }
  };

  const handleDeleteBarber = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from barbers?`)) return;
    try {
      await deleteBarber(id);
      toast.success(`${name} removed`);
    } catch {
      toast.error("Failed to remove barber");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    const appt = appointments.find((a) => a.id === id);
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.success("Appointment deleted");
    } catch {
      toast.error("Failed to delete appointment");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} appointment${selectedIds.size > 1 ? "s" : ""}?`)) return;
    try {
      await Promise.all(Array.from(selectedIds).map((id) => deleteAppointment(id)));
      setAppointments((prev) => prev.filter((a) => !selectedIds.has(a.id!)));
      toast.success(`${selectedIds.size} appointment${selectedIds.size > 1 ? "s" : ""} deleted`);
      setSelectedIds(new Set());
    } catch {
      toast.error("Failed to delete some appointments");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === appointments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(appointments.map((a) => a.id!)));
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

  const handleToggleCompleted = async (appt: Appointment) => {
    const newCompleted = !appt.completed;
    try {
      await updateAppointment(appt.id!, { completed: newCompleted });
      setAppointments((prev) =>
        prev.map((a) => a.id === appt.id ? { ...a, completed: newCompleted } : a)
      );
    } catch {
      toast.error("Failed to update appointment");
    }
  };

  const handleSendReminder = async (appt: Appointment) => {
    if (!appt.email && !appt.phone) {
      toast.error("No email or phone on file for " + appt.name);
      return;
    }
    const reminderMsg = `This is a reminder for your upcoming appointment on ${appt.date}${appt.time ? ` at ${appt.time}` : ""}${appt.barber ? ` with ${appt.barber.split(" - ")[0]}` : ""}. We look forward to seeing you!`;
    try {
      if (appt.email) {
        await sendEmail("reminder", {
          name: appt.name,
          email: appt.email,
          phone: appt.phone,
          barber: appt.barber,
          service: appt.service,
          date: appt.date,
          time: appt.time,
          message: reminderMsg,
        });
      }
      if (appt.phone) {
        await sendSMS(appt.phone, `Hi ${appt.name}, ${reminderMsg} - Grandes Ligas Barber`);
      }
      toast.success("Reminder sent to " + (appt.email || appt.phone));
    } catch (err) {
      toast.error("Failed to send reminder: " + (err instanceof Error ? err.message : String(err)));
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
    if (newAppt.barber && newAppt.time && newAppt.date) {
      const conflict = appointments.find(
        (a) => a.date === newAppt.date && a.time === newAppt.time && a.barber === newAppt.barber
      );
      if (conflict) {
        toast.error(`${newAppt.barber.split(" - ")[0]} is already booked at ${newAppt.time} on ${newAppt.date}`);
        return;
      }
    }
    setCreating(true);
    try {
      await saveAppointment({ ...newAppt, source: "en" });

      // Send notification email to owner
      try {
        await sendEmail("shop_notification", {
          name: newAppt.name,
          email: newAppt.email,
          phone: newAppt.phone,
          barber: newAppt.barber,
          service: newAppt.service,
          date: newAppt.date,
          time: newAppt.time,
          notes: newAppt.notes,
        });
      } catch {
        console.error("Owner email failed");
      }

      // Send confirmation email to customer if email provided
      if (newAppt.email) {
        try {
          await sendEmail("customer_confirmation", {
            name: newAppt.name,
            email: newAppt.email,
            phone: newAppt.phone,
            barber: newAppt.barber,
            service: newAppt.service,
            date: newAppt.date,
            time: newAppt.time,
            notes: newAppt.notes,
          });
        } catch {
          console.error("Customer email failed");
        }
      }

      // Send SMS confirmation to customer
      if (newAppt.phone) {
        try {
          await sendSMS(
            newAppt.phone,
            `Hi ${newAppt.name}, your appointment at Grandes Ligas Barber is confirmed for ${newAppt.date} at ${newAppt.time}${newAppt.barber ? ` with ${newAppt.barber.split(" - ")[0]}` : ""}. See you then!`
          );
        } catch {
          console.error("SMS failed");
        }
      }

      toast.success("Appointment created & notifications sent");
      setNewAppt({ name: "", email: "", phone: "", barber: "", service: "", date: "", time: "", notes: "" });
      setShowCreateForm(false);
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

  const bookedTimesForDate = newAppt.date && newAppt.barber
    ? appointments.filter((a) => a.date === newAppt.date && a.barber === newAppt.barber).map((a) => a.time).filter(Boolean)
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
              onClick={() => { toast.info("Dashboard updates automatically in real-time"); }}
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
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-slate-900">Individual Barber Appointments</h2>
          <Button
            size="sm"
            onClick={() => setShowAddBarber(true)}
            className="h-8 px-3 text-xs bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-bold hover:from-amber-600 hover:to-yellow-700"
          >
            <Plus className="size-3 mr-1" />
            Add Barber
          </Button>
        </div>

        {/* Add Barber Dialog */}
        <Dialog open={showAddBarber} onOpenChange={setShowAddBarber}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Barber</DialogTitle>
              <DialogDescription>Select from the list or enter a new barber.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="barber-name">Name *</Label>
                <Input id="barber-name" value={newBarber.name} onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })} placeholder="Barber name" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="barber-phone">Phone *</Label>
                <Input id="barber-phone" type="tel" value={newBarber.phone} onChange={(e) => setNewBarber({ ...newBarber, phone: formatPhone(e.target.value) })} placeholder="(508) 555-1234" maxLength={14} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="barber-image">Photo</Label>
                <Input id="barber-image" type="file" accept="image/*" onChange={(e) => setNewBarberImage(e.target.files?.[0] || null)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddBarber(false)}>Cancel</Button>
              <Button onClick={handleAddBarber} className="bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-bold hover:from-amber-600 hover:to-yellow-700">
                Add Barber
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Barber Dialog */}
        <Dialog open={!!editingBarber} onOpenChange={(open) => { if (!open) setEditingBarber(null); }}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit Barber</DialogTitle>
              <DialogDescription>Update barber information.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="edit-barber-name">Name *</Label>
                <Input id="edit-barber-name" value={editBarberForm.name} onChange={(e) => setEditBarberForm({ ...editBarberForm, name: e.target.value })} placeholder="Barber name" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-barber-phone">Phone *</Label>
                <Input id="edit-barber-phone" type="tel" value={editBarberForm.phone} onChange={(e) => setEditBarberForm({ ...editBarberForm, phone: formatPhone(e.target.value) })} placeholder="(508) 555-1234" maxLength={14} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-barber-image">Photo</Label>
                <Input id="edit-barber-image" type="file" accept="image/*" onChange={(e) => setEditBarberImage(e.target.files?.[0] || null)} />
                {editBarberForm.imageUrl && !editBarberImage && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-green-600">Current photo set</p>
                    <button type="button" onClick={() => setEditBarberForm({ ...editBarberForm, imageUrl: "" })} className="text-xs text-red-500 hover:text-red-700 underline">Remove photo</button>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingBarber(null)}>Cancel</Button>
              <Button onClick={handleEditBarberSave} className="bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-bold hover:from-amber-600 hover:to-yellow-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                className={`border-amber-500/30 bg-white cursor-pointer transition-all hover:shadow-lg hover:border-amber-500/60 ${isExpanded ? "ring-2 ring-amber-500" : ""} relative`}
              >
                <div className="absolute top-1 right-1 flex items-center gap-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditBarberOpen(barber); }}
                    className="p-0.5 rounded-full text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    title={`Edit ${barber.name}`}
                  >
                    <Pencil className="size-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteBarber(barber.id!, barber.name); }}
                    className="p-0.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title={`Remove ${barber.name}`}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
                <CardContent className="p-4 text-center flex flex-col items-center">
                  {barber.imageUrl ? (
                    <img src={barber.imageUrl} alt={barber.name} className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/50 mb-2" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center mb-2">
                      <User className="size-6 text-black" />
                    </div>
                  )}
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
                        className={`p-4 rounded-lg border transition-colors ${appt.completed ? "border-green-300 bg-green-50/50" : "border-slate-200 hover:border-amber-500/50 hover:bg-amber-50/50"}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleCompleted(appt)}
                              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${appt.completed ? "bg-green-500 border-green-500 text-white" : "border-slate-300 hover:border-amber-500"}`}
                            >
                              {appt.completed && <Check className="size-3" />}
                            </button>
                            <div className={`font-semibold ${appt.completed ? "text-slate-400 line-through" : "text-slate-900"}`}>{appt.name}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{appt.source?.toUpperCase() || "EN"}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendReminder(appt)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-7 w-7 p-0"
                              title="Send Reminder"
                            >
                              <Bell className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditOpen(appt)}
                              className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 h-7 w-7 p-0"
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(appt.id!)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                            >
                              <Trash2 className="size-3.5" />
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
                  <Select value={newAppt.barber} onValueChange={(v) => setNewAppt({ ...newAppt, barber: v, time: "" })}>
                    <SelectTrigger id="new-barber"><SelectValue placeholder="Select a barber" /></SelectTrigger>
                    <SelectContent>
                      {barbers.map((b) => (
                        <SelectItem key={b.id} value={`${b.name} - ${b.phone}`}>{b.name} - {b.phone}</SelectItem>
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
                    {selectedIds.size > 0 && (
                      <div className="flex items-center gap-3 mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <span className="text-sm font-medium text-slate-700">{selectedIds.size} selected</span>
                        <Button size="sm" variant="outline" onClick={() => setSelectedIds(new Set())} className="h-7 px-2 text-xs">
                          Clear
                        </Button>
                        <Button size="sm" onClick={handleBulkDelete} className="h-7 px-3 text-xs bg-red-500 hover:bg-red-600 text-white font-bold">
                          <Trash2 className="size-3 mr-1" />
                          Delete Selected
                        </Button>
                      </div>
                    )}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">
                            <input
                              type="checkbox"
                              checked={appointments.length > 0 && selectedIds.size === appointments.length}
                              onChange={toggleSelectAll}
                              className="size-4 accent-amber-500 cursor-pointer"
                            />
                          </TableHead>
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
                          <TableRow key={appt.id} className={selectedIds.has(appt.id!) ? "bg-amber-50/50" : ""}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedIds.has(appt.id!)}
                                onChange={() => toggleSelect(appt.id!)}
                                className="size-4 accent-amber-500 cursor-pointer"
                              />
                            </TableCell>
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
                    <SelectItem key={b.id} value={`${b.name} - ${b.phone}`}>{b.name} - {b.phone}</SelectItem>
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
