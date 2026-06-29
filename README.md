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
- **Email** : `admin@facturart.com`
- **Mot de passe** : `Admin123!`

---
## 🎨 Design System
L'application utilise une palette de couleurs professionnelle axée sur les artisans :
- **Principal** : Vert sombre (#0D3D2E)
- **Accent** : Vert émeraude (#2ECC8E)
- Support complet du mode sombre (Dark Mode).
