
# Gestion d'Audit de Comptes Bancaires  

Ce projet est une application de gestion d'audit de comptes bancaires construite avec [Next.js](https://nextjs.org), [Prisma](https://www.prisma.io/) pour la gestion de la base de données, et [PostgreSQL](https://www.postgresql.org) comme système de gestion de base de données relationnelle.

## Prérequis  

- Node.js v16 ou supérieur  
- PostgreSQL installé et configuré  
- Prisma CLI installé (`npm install prisma --save-dev`)  

---

## Installation  

1. Clonez ce dépôt :  
   ```bash  
   https://github.com/DarkZangetsu/Audit-bank.git  
   cd nom-du-repo  
   ```  

2. Installez les dépendances :  
   ```bash  
   npm install  
   # ou  
   yarn install  
   # ou  
   pnpm install  
   ```  

---

## Configuration  

1. Créez un fichier `.env` à la racine du projet en vous basant sur le fichier `.env.example`.  
   Exemple :  
   ```env  
   DATABASE_URL=postgresql://user:password@localhost:5432/nom_base_de_donnees  
   ```  

2. Mettez à jour le schéma Prisma si nécessaire :  
   ```bash  
   npx prisma migrate dev --name init  
   ```  

---

## Lancer le serveur  

Pour démarrer le serveur de développement :  

```bash  
npm run dev  
# ou  
yarn dev  
# ou  
pnpm dev  
```  

Accédez à [http://localhost:3000](http://localhost:3000) pour voir l'application. Les modifications sont automatiquement prises en compte grâce au rechargement à chaud.

---

## Structure des pages  

Vous pouvez commencer à éditer les pages en modifiant les fichiers sous `app/page.js` ou `app` selon vos besoins. Les changements sont automatiquement rechargés.

---

## Déploiement  

Le moyen le plus simple de déployer cette application est d'utiliser [Vercel](https://vercel.com). Suivez les étapes suivantes pour le déploiement :  

1. Connectez votre projet à Vercel.  
2. Ajoutez vos variables d'environnement dans le tableau de bord Vercel.  
3. Déployez l'application.  

Pour plus d'informations, consultez la [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying).

---

## Ressources utiles  

- [Documentation Next.js](https://nextjs.org/docs)  
- [Documentation Prisma](https://www.prisma.io/docs)  
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)  
- [Tutoriel interactif Next.js](https://nextjs.org/learn)  

---

## Contributions  

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une issue ou une pull request.  

