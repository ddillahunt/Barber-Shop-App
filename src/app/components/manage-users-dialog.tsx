import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/app/components/ui/alert-dialog';
import { Badge } from '@/app/components/ui/badge';
import { Shield, Plus, Edit, Trash2 } from 'lucide-react';
import { getUsers, saveUsers, hashPassword, type User } from '@/app/lib/auth-utils';

interface ManageUsersDialogProps {
  currentUserId: string;
}

export function ManageUsersDialog({ currentUserId }: ManageUsersDialogProps) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPassword, setResetPassword] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    password: '',
  });

  // Load users when dialog opens
  useEffect(() => {
    if (open) {
      setUsers(getUsers());
    }
  }, [open]);

  // Listen for external user updates
  useEffect(() => {
    const handler = () => {
      if (open) setUsers(getUsers());
    };
    window.addEventListener('kr-users-updated', handler);
    return () => window.removeEventListener('kr-users-updated', handler);
  }, [open]);

  const resetForm = () => {
    setFormData({ displayName: '', username: '', email: '', role: 'user', password: '' });
    setResetPassword(false);
  };

  const handleAddUser = async () => {
    if (!formData.displayName || !formData.username || !formData.email || !formData.password) return;

    // Check for duplicate username
    if (users.some(u => u.username.toLowerCase() === formData.username.toLowerCase())) {
      alert('A user with that username already exists.');
      return;
    }

    const hash = await hashPassword(formData.password);
    const newUser: User = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      displayName: formData.displayName,
      username: formData.username,
      email: formData.email,
      role: formData.role,
      passwordHash: hash,
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };

    const updated = [...users, newUser];
    saveUsers(updated);
    setUsers(updated);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    const updated = users.map(u => {
      if (u.id !== editingUser.id) return u;
      const changes: Partial<User> = {
        displayName: formData.displayName,
        email: formData.email,
        role: formData.role,
      };
      return { ...u, ...changes };
    });

    // If resetting password, hash it and set mustChangePassword
    if (resetPassword && formData.password) {
      const hash = await hashPassword(formData.password);
      const idx = updated.findIndex(u => u.id === editingUser.id);
      if (idx !== -1) {
        updated[idx].passwordHash = hash;
        updated[idx].mustChangePassword = true;
      }
    }

    saveUsers(updated);
    setUsers(updated);
    setEditingUser(null);
    resetForm();
    setIsEditDialogOpen(false);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      displayName: user.displayName,
      username: user.username,
      email: user.email,
      role: user.role,
      password: '',
    });
    setResetPassword(false);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    const updated = users.filter(u => u.id !== userId);
    saveUsers(updated);
    setUsers(updated);
  };

  const canDelete = (user: User) => {
    return user.id !== 'default-admin' && user.id !== currentUserId;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white hover:bg-gray-50">
          <Shield className="size-4 mr-2" />
          Users
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] w-full max-h-[90vh] overflow-hidden flex flex-col resize overflow-auto" style={{ minWidth: '800px', minHeight: '500px' }}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Manage Users</DialogTitle>
          <DialogDescription>
            Manage user accounts and access control.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1">
          {/* Summary Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-purple-900">{users.length}</div>
                  <p className="text-xs text-purple-700 mt-1">Total Users</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={(val) => { setIsAddDialogOpen(val); if (!val) resetForm(); }}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                      <Plus className="size-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add User</DialogTitle>
                      <DialogDescription>
                        Create a new user account. They will be required to change their password on first login.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="add-displayName">Display Name</Label>
                        <Input
                          id="add-displayName"
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="add-username">Username</Label>
                        <Input
                          id="add-username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          placeholder="johndoe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="add-email">Email</Label>
                        <Input
                          id="add-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@krpowerwashing.org"
                        />
                      </div>
                      <div>
                        <Label htmlFor="add-role">Role</Label>
                        <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val as 'admin' | 'user' })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="add-password">Temporary Password</Label>
                        <Input
                          id="add-password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Set a temporary password"
                        />
                      </div>
                      <Button onClick={handleAddUser} className="w-full" disabled={!formData.displayName || !formData.username || !formData.email || !formData.password}>
                        Add User
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent className="pt-6">
              {users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.displayName}</TableCell>
                        <TableCell className="text-gray-600">{user.username}</TableCell>
                        <TableCell className="text-gray-600">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.mustChangePassword ? (
                            <span className="text-xs text-amber-600 font-medium">Must change password</span>
                          ) : (
                            <span className="text-xs text-green-600 font-medium">Active</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(user)}>
                              <Edit className="size-4" />
                            </Button>
                            {canDelete(user) ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="size-4 text-red-600" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the account for {user.displayName} ({user.username}). This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-red-600 hover:bg-red-700">
                                      Delete User
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <Button variant="ghost" size="sm" disabled>
                                <Trash2 className="size-4 text-gray-300" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">No users found</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(val) => { setIsEditDialogOpen(val); if (!val) { resetForm(); setEditingUser(null); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user account information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-displayName">Display Name</Label>
                <Input
                  id="edit-displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val as 'admin' | 'user' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="edit-reset-pw"
                  checked={resetPassword}
                  onCheckedChange={(val) => setResetPassword(val === true)}
                />
                <Label htmlFor="edit-reset-pw" className="text-sm font-normal cursor-pointer">
                  Reset password
                </Label>
              </div>
              {resetPassword && (
                <div>
                  <Label htmlFor="edit-password">New Temporary Password</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Set a new temporary password"
                  />
                </div>
              )}
              <Button onClick={handleEditUser} className="w-full" disabled={resetPassword && !formData.password}>
                Update User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
