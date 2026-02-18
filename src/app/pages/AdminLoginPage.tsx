import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Lock } from "lucide-react";
import { toast } from "sonner";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-2 border-amber-500/30 shadow-2xl bg-slate-900">
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 p-6">
          <CardHeader className="p-0">
            <div className="flex items-center gap-3 text-black">
              <div className="p-2 bg-black/20 backdrop-blur-sm rounded-xl">
                <Lock className="size-6 text-black" />
              </div>
              <div>
                <CardTitle className="text-black text-2xl font-bold">Admin Login</CardTitle>
                <CardDescription className="text-slate-900 font-medium">Grandes Ligas Dashboard</CardDescription>
              </div>
            </div>
          </CardHeader>
        </div>
        <CardContent className="p-8 bg-gradient-to-br from-slate-900 to-black rounded-b-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-slate-300">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@grandesligas.com"
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-slate-300">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold shadow-lg shadow-amber-500/50 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full text-center text-sm text-amber-400 hover:text-yellow-500 transition-colors"
          >
            Back to website
          </button>
        </CardContent>
      </Card>
      <p className="text-slate-400 text-sm mt-6">Powered by GDI Digital Solutions</p>
    </div>
  );
}
