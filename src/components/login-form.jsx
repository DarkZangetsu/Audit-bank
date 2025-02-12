import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'La connexion a échoué');
      }

      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      router.push('/accounts');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-gray-800 border-gray-700 overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white">Bienvenue</h1>
                <p className="text-balance text-gray-400">
                  Connectez-vous à votre compte Audit Bank
                </p>
              </div>
              {error && (
                <div className="text-red-400 text-center bg-red-900/20 p-3 rounded-lg">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-gray-200">Identifiant</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Entrez votre identifiant" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-gray-200">Mot de passe</Label>
                  <a href="#" className="ml-auto text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Entrez votre mot de passe" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Se connecter
              </Button>
            </div>
          </form>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20" />
            <img
              src="login.webp"
              alt="Login"
              className="absolute inset-0 h-full w-full object-cover brightness-50 grayscale" 
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-gray-400">
        En continuant, vous acceptez nos{" "}
        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">
          Conditions d&apos;utilisation
        </a>{" "}
        et notre{" "}
        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">
          Politique de confidentialité
        </a>
        .
      </div>
    </div>
  );
}