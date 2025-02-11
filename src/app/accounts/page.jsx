"use client";

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";


import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { 
    Home, 
    Wallet, 
    CreditCard, 
    PlusCircle, 
    Loader2, 
    Hash, 
    User, 
    EuroIcon, 
    Pencil, 
    Trash2,
    FileEdit,
    FilePlus,
    X,
    Save,
    Plus
  } from 'lucide-react'
  import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
  import { Badge } from "@/components/ui/badge"
  import { Label } from "@/components/ui/label"

const AccountsList = () => {
    const [comptes, setComptes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentCompte, setCurrentCompte] = useState(null);
    const [formData, setFormData] = useState({
      numero: '',
      nomclient: '',
      solde: ''
    });
    
    const fetchComptes = async () => {
      try {
        const response = await fetch('/api/accounts');
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors du chargement des comptes');
        }
        const data = await response.json();
        setComptes(data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    useEffect(() => {
      fetchComptes();
    }, []);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const url = currentCompte 
          ? `/api/accounts/${currentCompte.numero}`
          : '/api/accounts';
        const method = currentCompte ? 'PUT' : 'POST';
    
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            solde: parseFloat(formData.solde)
          })
        });
    
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la sauvegarde');
        }
        
        toast({
          title: "Succès",
          description: currentCompte 
            ? "Compte mis à jour avec succès"
            : "Compte créé avec succès"
        });
        
        setOpenDialog(false);
        fetchComptes();
      } catch (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive"
        });
      }
    };
    
    const handleDelete = async (numero) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) return;
      
      try {
        const response = await fetch(`/api/accounts/${numero}`, {
          method: 'DELETE'
        });
    
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la suppression');
        }
        
        toast({
          title: "Succès",
          description: "Compte supprimé avec succès"
        });
        
        fetchComptes();
      } catch (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive"
        });
      }
    };
    
    const openEditDialog = (compte) => {
      setCurrentCompte(compte);
      setFormData({
        numero: compte.numero,
        nomclient: compte.nomclient,
        solde: compte.solde.toString()
      });
      setOpenDialog(true);
    };
    
    const openCreateDialog = () => {
      setCurrentCompte(null);
      setFormData({
        numero: '',
        nomclient: '',
        solde: ''
      });
      setOpenDialog(true);
    };

    return (
        <SidebarProvider>
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
                          <Wallet className="mr-2 h-4 w-4 inline" />
                          Gestion des Comptes
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
                      <CreditCard className="mr-2 h-6 w-6" />
                      Gestion des Comptes
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Gérez tous vos comptes bancaires en un seul endroit
                    </p>
                  </div>
                  <Button onClick={openCreateDialog} className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Nouveau Compte
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">
                              <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4" />
                                Numéro
                              </div>
                            </TableHead>
                            <TableHead>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Nom Client
                              </div>
                            </TableHead>
                            <TableHead>
                              <div className="flex items-center gap-2">
                                <EuroIcon className="h-4 w-4" />
                                Solde
                              </div>
                            </TableHead>
                            <TableHead className="w-[200px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {comptes.map((compte) => (
                            <TableRow key={compte.numero}>
                              <TableCell className="font-mono">
                                {compte.numero}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={`https://avatar.vercel.sh/${compte.nomclient}.png`}
                                      alt={compte.nomclient}
                                    />
                                    <AvatarFallback>
                                      {compte.nomclient.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  {compte.nomclient}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={compte.solde >= 0 ? "success" : "destructive"} className="font-mono">
                                  {compte.solde.toLocaleString('fr-FR', {
                                    style: 'currency',
                                    currency: 'EUR'
                                  })}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => openEditDialog(compte)}
                                    className="h-8 w-8"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(compte.numero)}
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
                  )}
      
                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {currentCompte ? (
                            <>
                              <FileEdit className="h-5 w-5" />
                              Modifier le Compte
                            </>
                          ) : (
                            <>
                              <FilePlus className="h-5 w-5" />
                              Nouveau Compte
                            </>
                          )}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="numero" className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Numéro de Compte
                          </Label>
                          <Input
                            id="numero"
                            value={formData.numero}
                            onChange={(e) => setFormData({...formData, numero: e.target.value})}
                            required
                            disabled={currentCompte}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nomclient" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Nom du Client
                          </Label>
                          <Input
                            id="nomclient"
                            value={formData.nomclient}
                            onChange={(e) => setFormData({...formData, nomclient: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="solde" className="flex items-center gap-2">
                            <EuroIcon className="h-4 w-4" />
                            Solde
                          </Label>
                          <Input
                            id="solde"
                            type="number"
                            value={formData.solde}
                            onChange={(e) => setFormData({...formData, solde: e.target.value})}
                            required
                            step="0.01"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpenDialog(false)}
                            className="flex items-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            Annuler
                          </Button>
                          <Button 
                            type="submit"
                            className="flex items-center gap-2"
                          >
                            {currentCompte ? (
                              <>
                                <Save className="h-4 w-4" />
                                Mettre à jour
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4" />
                                Créer
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </SidebarProvider>
      );
};

export default AccountsList;