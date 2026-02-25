import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Lock } from "lucide-react";
import { toast } from "sonner";

// SHA-256 hash comparison to avoid plaintext credentials in source
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Pre-computed SHA-256 hashes (update these when changing credentials)
const VALID_USER_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // hash of "admin"
const VALID_PASS_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"; // hash of "admin123"

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limit: lock after 5 failed attempts for 30 seconds
    if (Date.now() < lockedUntil) {
      const secondsLeft = Math.ceil((lockedUntil - Date.now()) / 1000);
      toast.error(`Too many attempts. Try again in ${secondsLeft} seconds.`);
      return;
    }

    setLoading(true);
    try {
      const userHash = await sha256(username.trim());
      const passHash = await sha256(password);

      if (userHash === VALID_USER_HASH && passHash === VALID_PASS_HASH) {
        setAttempts(0);
        sessionStorage.setItem("adminAuth", "true");
        navigate("/admin");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 5) {
          setLockedUntil(Date.now() + 30000);
          setAttempts(0);
          toast.error("Too many failed attempts. Locked for 30 seconds.");
        } else {
          toast.error("Invalid username or password");
        }
      }
    } catch {
      toast.error("Login error. Please try again.");
    }
    setLoading(false);
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
              <Label htmlFor="admin-username" className="text-slate-300">Username</Label>
              <Input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                maxLength={50}
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
                maxLength={100}
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
          <p className="text-slate-500 text-xs text-center mt-4">Powered by GDI Digital Solutions</p>
        </CardContent>
      </Card>
    </div>
  );
}
