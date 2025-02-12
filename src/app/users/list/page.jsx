"use client"

import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Home,
  Users,
  UserCog,
  UserPlus,
  Shield,
  ShieldCheck,
  CircleUser,
  Key,
  Lock,
  Calendar,
  Hash,
  User,
  Plus,
  PencilLine,
  Trash,
  Pencil,
  Trash2,
  AlertCircle,
  X,
  Save
} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


export default function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "USER",
    permissions: {
      canInsert: false,
      canUpdate: false,
      canDelete: false
    }
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs')
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Erreur lors de l\'ajout de l\'utilisateur')

      await fetchUsers()
      setIsAddDialogOpen(false)
      resetForm()
      toast.success('Utilisateur créé avec succès', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  }

  const handleDeleteUser = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression')

      await fetchUsers()
      toast.success('Utilisateur supprimé avec succès', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  }


  const handleEditClick = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      role: user.role?.roleName || user.role,
      permissions: user.permissions || {
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    })
    setIsAddDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (editingUser) {
      await handleUpdateUser(editingUser.id)
    } else {
      await handleAddUser()
    }
  }

  const handleUpdateUser = async (id) => {
    try {
      const updateData = {
        username: formData.username,
        role: formData.role,
        permissions: formData.permissions
      }

      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) throw new Error('Erreur lors de la mise à jour')

      await fetchUsers()
      setIsAddDialogOpen(false)
      setEditingUser(null)
      resetForm()
      toast.success(`Les informations de ${updateData.username} ont été mises à jour`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  }

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      role: "USER",
      permissions: {
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    })
    setEditingUser(null)
  }

  const handleDialogClose = () => {
    setIsAddDialogOpen(false)
    resetForm()
  }

  return (
    <SidebarProvider>
       <ToastContainer />
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-4 px-4">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex flex-1 items-center justify-between space-x-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">
                      <Home className="mr-2 h-4 w-4 inline" />
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <Users className="mr-2 h-4 w-4 inline" />
                      Gestion des Utilisateurs
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <UserCog className="mr-2 h-6 w-6" />
                  Gestion des Utilisateurs
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Gérez les utilisateurs et leurs permissions dans votre système
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Nouvel Utilisateur
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          ID
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Utilisateur
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Rôle
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Permissions
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date de création
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono">{user.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://avatar.vercel.sh/${user.username}.png`}
                                alt={user.username}
                              />
                              <AvatarFallback>
                                {user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {user.username}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                            className="flex w-fit items-center gap-1"
                          >
                            {user.role === 'ADMIN' ? (
                              <>
                                <ShieldCheck className="h-3 w-3" />
                                Admin
                              </>
                            ) : (
                              <>
                                <CircleUser className="h-3 w-3" />
                                User
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.permissions?.canInsert && (
                              <Badge variant="outline" className="bg-green-50">
                                <Plus className="mr-1 h-3 w-3" />
                                Insert
                              </Badge>
                            )}
                            {user.permissions?.canUpdate && (
                              <Badge variant="outline" className="bg-blue-50">
                                <PencilLine className="mr-1 h-3 w-3" />
                                Update
                              </Badge>
                            )}
                            {user.permissions?.canDelete && (
                              <Badge variant="outline" className="bg-red-50">
                                <Trash className="mr-1 h-3 w-3" />
                                Delete
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditClick(user)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {editingUser ? (
                        <>
                          <UserCog className="h-5 w-5" />
                          Modifier l'utilisateur
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-5 w-5" />
                          Nouvel utilisateur
                        </>
                      )}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nom d'utilisateur
                      </Label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                      />
                    </div>

                    {!editingUser && (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Mot de passe
                        </Label>
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Rôle
                      </Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData({ ...formData, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4" />
                              Administrateur
                            </div>
                          </SelectItem>
                          <SelectItem value="USER">
                            <div className="flex items-center gap-2">
                              <CircleUser className="h-4 w-4" />
                              Utilisateur
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Permissions
                      </Label>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={formData.permissions.canInsert}
                            onCheckedChange={(checked) => setFormData({
                              ...formData,
                              permissions: { ...formData.permissions, canInsert: checked }
                            })}
                          />
                          <Plus className="h-4 w-4" />
                          Insertion
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={formData.permissions.canUpdate}
                            onCheckedChange={(checked) => setFormData({
                              ...formData,
                              permissions: { ...formData.permissions, canUpdate: checked }
                            })}
                          />
                          <PencilLine className="h-4 w-4" />
                          Modification
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={formData.permissions.canDelete}
                            onCheckedChange={(checked) => setFormData({
                              ...formData,
                              permissions: { ...formData.permissions, canDelete: checked }
                            })}
                          />
                          <Trash className="h-4 w-4" />
                          Suppression
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleDialogClose}>
                      <X className="mr-2 h-4 w-4" />
                      Annuler
                    </Button>
                    <Button onClick={handleSubmit}>
                      {editingUser ? (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Mettre à jour
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Créer
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}