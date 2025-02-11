/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from "next/link";
import { ArrowRight, BarChart2, Shield, Database, Moon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card className="bg-gray-800 border-gray-700">
    <CardHeader>
      <Icon className="h-8 w-8 text-blue-400 mb-2" />
      <CardTitle className="text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-gray-300">{description}</CardDescription>
    </CardContent>
  </Card>
);

export default function Home() {
  const features = [
    {
      icon: BarChart2,
      title: "Analyse Avancée",
      description: "Visualisez et analysez vos données bancaires avec des outils de pointe"
    },
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Protection de vos données avec les dernières technologies de cryptage"
    },
    {
      icon: Database,
      title: "Gestion Centralisée",
      description: "Gérez toutes vos bases de données depuis une interface unique"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex flex-col">
      <header className="sticky top-0 backdrop-blur-lg bg-gray-900/80 py-4 px-6 flex justify-between items-center shadow-lg z-50">
        <div className="flex items-center gap-2">
          <Moon className="h-8 w-8 text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Audit Bank
          </h1>
        </div>
        
        <nav className="flex items-center gap-8">
          <Link 
            href="/login" 
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            Se connecter
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </header>
      
      <main className="flex flex-col items-center gap-20 px-6 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-6xl font-extrabold">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Révolutionnez
            </span>{" "}
            vos audits bancaires
          </h2>
          <p className="text-gray-300 text-xl">
            Une plateforme intelligente qui simplifie l'analyse et la gestion de vos données bancaires
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Link 
              href="/login" 
              className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 flex items-center gap-2"
            >
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="#" 
              className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105"
            >
              En savoir plus
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </main>
      
      <footer className="mt-auto w-full bg-gray-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Moon className="h-6 w-6 text-blue-400" />
            <span className="text-gray-400">Audit Bank</span>
          </div>
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Audit Bank. Tous droits réservés.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              Mentions légales
            </Link>
            <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}