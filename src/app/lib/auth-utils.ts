// Types
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  passwordHash: string;
  role: 'admin' | 'user';
  mustChangePassword: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export interface AuthSession {
  userId: string;
  username: string;
  displayName: string;
  role: 'admin' | 'user';
  mustChangePassword: boolean;
  loginAt: string;
}

// Pre-computed SHA-256 hash of "Password123!"
const DEFAULT_ADMIN_HASH = 'a109e36947ad56de1dca1cc49f0ef8ac9ad9a7b1aa0df41fb3c4cb73c1ff01ea';

const USERS_KEY = 'kr-users';
const SESSION_KEY = 'kr-auth-session';

// Hash a password using SHA-256 via Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get all users from localStorage; seeds default admin if empty
export function getUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) {
    try {
      const users = JSON.parse(raw) as User[];
      if (users.length > 0) return users;
    } catch {
      // Fall through to seed
    }
  }

  // Seed default admin
  const defaultAdmin: User = {
    id: 'default-admin',
    username: 'admin',
    email: 'admin@krpowerwashing.org',
    displayName: 'Administrator',
    passwordHash: DEFAULT_ADMIN_HASH,
    role: 'admin',
    mustChangePassword: false,
    createdAt: new Date().toISOString(),
    lastLogin: null,
  };
  saveUsers([defaultAdmin]);
  return [defaultAdmin];
}

// Save users to localStorage and dispatch update event
export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event('kr-users-updated'));
}

// Session CRUD
export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// Login: find user by username OR email (case-insensitive email), verify hash, create session
export async function login(usernameOrEmail: string, password: string): Promise<{ success: true; session: AuthSession } | { success: false; error: string }> {
  const users = getUsers();
  const inputLower = usernameOrEmail.toLowerCase().trim();

  const user = users.find(
    u => u.username.toLowerCase() === inputLower || u.email.toLowerCase() === inputLower
  );

  if (!user) {
    return { success: false, error: 'Invalid username or password.' };
  }

  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) {
    return { success: false, error: 'Invalid username or password.' };
  }

  // Update lastLogin
  user.lastLogin = new Date().toISOString();
  saveUsers(users);

  const session: AuthSession = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
    loginAt: new Date().toISOString(),
  };
  setSession(session);

  return { success: true, session };
}
