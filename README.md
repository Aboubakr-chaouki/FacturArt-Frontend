# FacturArt Client (Frontend) 💻

Le frontend de FacturArt est une application web moderne et réactive construite avec React.

## 🛠 Technologies
- **Framework** : React 19
- **Build Tool** : Vite
- **Langage** : TypeScript
- **Styles** : Tailwind CSS & Shadcn/UI
- **Navigation** : React Router 7
- **Icônes** : Lucide-React
- **Graphiques** : Recharts
- **Requêtes HTTP** : Axios

## 📋 Prérequis
- Node.js 20+ installé

## 🚀 Installation & Lancement

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

3. **Compiler pour la production**
   ```bash
   npm run build
   ```

## 🏗 Structure du projet
- `src/app/` : Pages de l'application (auth, dashboard, admin).
- `src/components/` : Composants UI réutilisables (Shadcn + composants personnalisés).
- `src/hooks/` : Hooks React personnalisés pour la logique métier.
- `src/api/` : Services de communication avec le backend.
- `src/layouts/` : Layouts de structure (Sidebar, Header, Shell).
- `src/lib/` : Utilitaires et configurations (axios, formatters).

## 🔑 Identifiants de test (Admin)
Les identifiants de l'administrateur par défaut sont configurés dans le fichier `.env` du backend. Par défaut (si non modifiés), vous pouvez les retrouver dans le fichier `.env.example` pour le développement local.

- **Email** : `ADMIN_EMAIL` (voir .env)
- **Mot de passe** : `ADMIN_PASSWORD` (voir .env)

## 🚀 CI/CD & Docker

Ce dépôt inclut des pipelines pour GitHub Actions :
- **GitHub Actions** : `.github/workflows/frontend-ci.yml`

Fonctionnalités :
- **Lint & Build** : Automatique à chaque push/pull request.
- **Docker** : Génération d'une image Docker `facturart-web` avec Nginx.
- **Push** : Publication automatique sur GHCR lors d'un push sur `main`.

### Dockerisation
Pour construire l'image localement :
```bash
docker build -t facturart-web .
```

---
## 🎨 Design System
L'application utilise une palette de couleurs professionnelle axée sur les artisans :
- **Principal** : Vert sombre (#0D3D2E)
- **Accent** : Vert émeraude (#2ECC8E)
- Support complet du mode sombre (Dark Mode).
