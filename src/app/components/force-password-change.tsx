import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { hashPassword, getUsers, saveUsers, clearSession, type AuthSession } from '@/app/lib/auth-utils';
import { Loader2, Check, X } from 'lucide-react';
import logoImage from '@/assets/51bd7988429b8271130dad268ae7b18b150f0caf.png';

interface ForcePasswordChangeProps {
  session: AuthSession;
  onPasswordChanged: (updatedSession: AuthSession) => void;
  onSignOut: () => void;
}

const requirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export function ForcePasswordChange({ session, onPasswordChanged, onSignOut }: ForcePasswordChangeProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const allMet = requirements.every(r => r.test(newPassword));
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = allMet && passwordsMatch && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);

    try {
      const hash = await hashPassword(newPassword);
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === session.userId);

      if (userIndex === -1) {
        setError('User account not found. Please sign in again.');
        setLoading(false);
        return;
      }

      users[userIndex].passwordHash = hash;
      users[userIndex].mustChangePassword = false;
      saveUsers(users);

      const updatedSession: AuthSession = {
        ...session,
        mustChangePassword: false,
      };
      onPasswordChanged(updatedSession);
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    clearSession();
    onSignOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="flex flex-col items-center mb-6">
            <img
              src={logoImage}
              alt="K&R POWERWASHING Logo"
              className="w-20 h-20 object-contain mb-4"
            />
            <h1 className="text-xl font-bold text-gray-900">Change Your Password</h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              You must set a new password before continuing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={loading}
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-600 mt-1">Passwords do not match.</p>
              )}
            </div>

            {/* Requirements checklist */}
            <div className="space-y-1 rounded-md border px-3 py-2 bg-gray-50">
              <p className="text-xs font-medium text-gray-600 mb-1">Password requirements:</p>
              {requirements.map((req) => {
                const met = req.test(newPassword);
                return (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    {met ? (
                      <Check className="size-3.5 text-green-600 shrink-0" />
                    ) : (
                      <X className="size-3.5 text-gray-400 shrink-0" />
                    )}
                    <span className={met ? 'text-green-700' : 'text-gray-500'}>{req.label}</span>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Updating password...
                </>
              ) : (
                'Set New Password'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Sign out instead
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
