"use client";

import { LoginForm } from "@/components/login-form";
import { Moon, ArrowLeft } from 'lucide-react';
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="sticky top-0 backdrop-blur-lg bg-gray-900/80 py-4 px-6 flex items-center gap-4 shadow-lg z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour
        </Link>
        <div className="flex items-center gap-2">
          <Moon className="h-8 w-8 text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Audit Bank
          </h1>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-76px)] flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm className="animate-in fade-in-50 slide-in-from-bottom-6" />
        </div>
      </main>
    </div>
  );
}