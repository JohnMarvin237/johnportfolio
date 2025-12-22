# Configuration et utilisation du Dashboard Admin

## 🚀 Démarrage rapide

### 1. Configuration de l'environnement

Créez un fichier `.env.local` avec les variables suivantes:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

# JWT Authentication
JWT_SECRET="GENERATE-WITH-OPENSSL-RAND-BASE64-32"
JWT_EXPIRES_IN="30d"

# Email (pour les notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="Portfolio <noreply@yourdomain.com>"
EMAIL_TO="admin@example.com"

# Admin credentials (pour le seed initial)
ADMIN_EMAIL="admin@portfolio.com"
ADMIN_PASSWORD="ChangeMe123!"
ADMIN_NAME="Admin"
```

### 2. Installation et configuration de la base de données

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Créer les tables dans la base de données
npx prisma migrate dev

# Seed initial avec compte admin
npx prisma db seed
```

### 3. Démarrer l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔐 Accès au Dashboard Admin

1. Naviguer vers [http://localhost:3000/admin](http://localhost:3000/admin)
2. Vous serez redirigé vers la page de connexion
3. Utilisez les identifiants définis dans `.env.local`:
   - **Email**: `admin@portfolio.com` (ou celui défini dans ADMIN_EMAIL)
   - **Mot de passe**: `ChangeMe123!` (ou celui défini dans ADMIN_PASSWORD)

## 📋 Fonctionnalités du Dashboard

### Vue d'ensemble
- Statistiques globales (projets, expériences, messages, etc.)
- Messages récents avec indicateur de non-lus
- Projets récents
- Actions rapides pour créer du contenu

### Gestion du contenu

#### 1. **Projets** (`/admin/projects`)
- Liste de tous les projets avec filtrage
- Création de nouveaux projets
- Édition des projets existants
- Suppression de projets
- Marquage comme "Featured"
- Gestion des technologies et liens

#### 2. **Expériences** (`/admin/experiences`)
- Gestion des expériences professionnelles
- Support des postes actuels
- Gestion des réalisations (achievements)
- Liste des technologies utilisées

#### 3. **Messages** (`/admin/messages`)
- Consultation des messages reçus
- Indicateur de messages non lus
- Vue détaillée des messages
- Possibilité de répondre par email
- Suppression de messages

### Navigation
- Sidebar responsive avec menu burger sur mobile
- Indicateurs visuels pour la page active
- Liens rapides vers le site public
- Déconnexion sécurisée

## 🛠️ Utilisation des API

### Authentification
Toutes les routes API admin nécessitent un token JWT. Envoyez le token dans:
- Header: `Authorization: Bearer <token>`
- Ou via cookie (automatique après connexion)

### Endpoints principaux

```bash
# Auth
POST   /api/auth/login    # { email, password }
POST   /api/auth/logout
GET    /api/auth/verify

# Projects
GET    /api/projects
POST   /api/projects
GET    /api/projects/[id]
PUT    /api/projects/[id]
DELETE /api/projects/[id]

# Experiences
GET    /api/experiences
POST   /api/experiences
GET    /api/experiences/[id]
PUT    /api/experiences/[id]
DELETE /api/experiences/[id]

# Messages
GET    /api/contact       # Liste (admin)
POST   /api/contact       # Nouveau message (public)
GET    /api/contact/[id]
DELETE /api/contact/[id]
PATCH  /api/contact/[id]/read
```

## 🎨 Personnalisation

### Ajouter une nouvelle section

1. Créer le modèle dans `prisma/schema.prisma`
2. Créer le schema Zod dans `lib/schemas/`
3. Créer les API routes dans `app/api/`
4. Créer les pages admin dans `app/admin/`
5. Ajouter le lien dans la sidebar (`components/admin/Sidebar.tsx`)

### Modifier le thème

Les couleurs et styles sont définis dans:
- `app/globals.css`
- `tailwind.config.js`
- Composants individuels avec Tailwind classes

## ⚠️ Sécurité

1. **Changez immédiatement** le mot de passe admin par défaut
2. **Générez un JWT_SECRET sécurisé**: `openssl rand -base64 32`
3. **Utilisez HTTPS** en production
4. **Configurez les CORS** si nécessaire
5. **Sauvegardez régulièrement** votre base de données

## 🐛 Dépannage

### Erreur de connexion
- Vérifiez que les variables d'environnement sont correctes
- Assurez-vous que la base de données est accessible
- Vérifiez que le seed a bien créé l'utilisateur admin

### Token expiré
- Les tokens sont valides 30 jours par défaut
- Reconnectez-vous pour obtenir un nouveau token
- Modifiez `JWT_EXPIRES_IN` pour changer la durée

### Messages d'erreur
- Consultez les logs du serveur Next.js
- Vérifiez la console du navigateur
- Activez les logs Prisma en développement

## 📝 Notes

- Les images des projets doivent être hébergées externement (URL)
- Les technologies et réalisations utilisent des formats spécifiques:
  - Technologies: séparées par des virgules
  - Réalisations: une par ligne
- L'ordre d'affichage contrôle la position dans les listes publiques

## 🚀 Déploiement

Pour déployer en production:

1. Configurez les variables d'environnement sur votre plateforme
2. Exécutez les migrations: `npx prisma migrate deploy`
3. Seedez la base de données si nécessaire
4. Assurez-vous que `NODE_ENV=production`

---

Pour toute question ou problème, consultez la documentation du projet ou ouvrez une issue.