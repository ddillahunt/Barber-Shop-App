import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getAppointments, deleteAppointment, getMessages, deleteMessage, type Appointment, type Message } from "../lib/appointments";
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
import { Scissors, LogOut, CalendarDays, Users, RefreshCw, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

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

        {/* Appointments Table */}
        <Card className="border-amber-500/30 bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">All Appointments</CardTitle>
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
