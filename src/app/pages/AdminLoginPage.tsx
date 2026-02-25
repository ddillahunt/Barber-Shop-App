import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Lock } from "lucide-react";
import { toast } from "sonner";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (username === "admin" && password === "admin123") {
      sessionStorage.setItem("adminAuth", "true");
      navigate("/admin");
    } else {
      toast.error("Invalid username or password");
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
          <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
            <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Demo Credentials</p>
            <p className="text-slate-300 text-sm">User: <span className="text-amber-400 font-semibold">admin</span></p>
            <p className="text-slate-300 text-sm">Password: <span className="text-amber-400 font-semibold">admin123</span></p>
          </div>
          <p className="text-slate-500 text-xs text-center mt-4">Powered by GDI Digital Solutions</p>
        </CardContent>
      </Card>
    </div>
  );
}
