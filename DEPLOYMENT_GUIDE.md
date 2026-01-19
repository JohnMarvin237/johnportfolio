# 🚀 Guide de Déploiement GitHub Actions + Vercel

## Configuration des Secrets GitHub

### Étape 1 : Obtenir les credentials Vercel

1. **Token Vercel** :
   - Allez sur https://vercel.com/account/tokens
   - Cliquez sur "Create Token"
   - Donnez un nom (ex: "GitHub Actions")
   - Copiez le token généré

2. **Organization ID et Project ID** :
   ```bash
   # Dans votre terminal local
   cd /Users/johnheliang/Documents/Projects/johnndekebitikportfolio
   
   # Connectez-vous à Vercel
   vercel login
   
   # Liez votre projet
   vercel link
   
   # Les IDs sont dans .vercel/project.json
   cat .vercel/project.json
   ```

### Étape 2 : Ajouter les secrets dans GitHub

Allez sur : `https://github.com/VOTRE_USERNAME/johnndekebitikportfolio/settings/secrets/actions`

Ajoutez ces secrets :

| Secret | Description | Où le trouver |
|--------|-------------|---------------|
| `VERCEL_TOKEN` | Token d'authentification | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | ID de votre organisation | `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | ID du projet | `.vercel/project.json` → `projectId` |
| `DATABASE_URL` | URL PostgreSQL production | Votre provider de DB (ex: Vercel Postgres, Supabase, Neon) |
| `NEXTAUTH_SECRET` | Secret pour l'authentification | Générer avec : `openssl rand -base64 32` |
| `JWT_SECRET` | Secret pour les JWT | Générer avec : `openssl rand -base64 32` |
| `ADMIN_USERNAME` | Nom d'utilisateur admin | Choisir un nom |
| `ADMIN_PASSWORD` | Mot de passe admin | Choisir un mot de passe sécurisé |
| `SMTP_HOST` | Serveur email | Ex: smtp.gmail.com |
| `SMTP_PORT` | Port SMTP | 587 (Gmail) |
| `SMTP_USER` | Email d'envoi | Votre email |
| `SMTP_PASSWORD` | Mot de passe email | App password pour Gmail |
| `EMAIL_FROM` | Email expéditeur | no-reply@yourdomain.com |

### Étape 3 : Créer les environnements GitHub

1. Allez dans `Settings → Environments`
2. Créez deux environnements :
   - **production** : Ajoutez une règle de protection (require approval)
   - **preview** : Pas de protection nécessaire

## 🔄 Workflows Disponibles

### 1. CI (Intégration Continue)
**Déclenché par** : Push sur `main`, `develop`, `phase4` ou Pull Request

**Actions** :
- ✅ Lint du code (ESLint)
- 🏗️ Build de l'application
- 🧪 Tests unitaires
- 🔒 Scan de sécurité
- 📊 Audit Lighthouse

### 2. Déploiement Production
**Déclenché par** : Push sur `main`

**Actions** :
- 🚀 Déploie sur Vercel Production
- 📦 Génère les artefacts
- 🗄️ Exécute les migrations Prisma
- ✅ Tests post-déploiement
- 📬 Notifications Slack (optionnel)

### 3. Déploiement Preview
**Déclenché par** : Pull Request

**Actions** :
- 🔍 Crée un environnement preview
- 🌐 Génère une URL unique pour chaque PR
- 💬 Commente la PR avec l'URL
- 📊 Affiche les scores Lighthouse

## 📦 Commandes pour Déploiement

### Premier déploiement

```bash
# 1. Assurez-vous d'être sur main
git checkout main

# 2. Vérifiez que tout est commité
git status

# 3. Poussez sur GitHub
git push origin main

# GitHub Actions va automatiquement :
# - Exécuter les tests
# - Builder l'application
# - Déployer sur Vercel
```

### Déploiement manuel (si nécessaire)

```bash
# Option 1 : Via GitHub Actions (manual dispatch)
# Allez sur GitHub → Actions → Deploy to Production → Run workflow

# Option 2 : Via Vercel CLI local
vercel --prod
```

### Déploiement de preview (PR)

```bash
# 1. Créez une branche
git checkout -b feature/ma-feature

# 2. Faites vos modifications
git add .
git commit -m "feat: nouvelle fonctionnalité"

# 3. Poussez la branche
git push origin feature/ma-feature

# 4. Créez une Pull Request sur GitHub
# → Un déploiement preview sera créé automatiquement
```

## 🗄️ Configuration de la Base de Données

### Option 1 : Vercel Postgres

```bash
# Sur Vercel Dashboard
vercel postgres create

# Liez à votre projet
vercel env pull .env.local

# Ajoutez DATABASE_URL dans les secrets GitHub
```

### Option 2 : Neon (Recommandé)

1. Créez un compte sur https://neon.tech
2. Créez une nouvelle base de données
3. Copiez la connection string
4. Ajoutez-la dans les secrets GitHub comme `DATABASE_URL`

### Option 3 : Supabase

1. Créez un projet sur https://supabase.com
2. Obtenez la connection string PostgreSQL
3. Ajoutez-la dans les secrets GitHub

## 🔧 Variables d'Environnement

Assurez-vous que Vercel a ces variables :

```bash
# Sur Vercel Dashboard → Settings → Environment Variables

DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
JWT_SECRET=...
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

## ✅ Checklist de Déploiement

- [ ] Secrets GitHub configurés
- [ ] Environnements GitHub créés
- [ ] Base de données provisionnée
- [ ] Variables Vercel configurées
- [ ] Tests passent localement
- [ ] Build réussit localement (`npm run build`)
- [ ] Migrations Prisma testées
- [ ] Code poussé sur GitHub
- [ ] Workflow CI réussi
- [ ] Déploiement production réussi

## 🐛 Dépannage

### Le build échoue

```bash
# Vérifiez les logs dans GitHub Actions
# Testez le build localement
npm run build
```

### Erreurs de base de données

```bash
# Vérifiez DATABASE_URL dans les secrets
# Testez la connexion localement
npx prisma db push
npx prisma studio
```

### Vercel CLI ne fonctionne pas

```bash
# Réinstallez et reconnectez
npm i -g vercel@latest
vercel login
vercel link --yes
```

### Variables d'environnement manquantes

```bash
# Vérifiez sur Vercel
vercel env ls

# Ajoutez-les si nécessaire
vercel env add DATABASE_URL production
```

## 📚 Ressources

- [Documentation GitHub Actions](https://docs.github.com/actions)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [CI/CD Documentation](docs/CI-CD.md)

## 🎯 Prochaines Étapes

1. Configurez un domaine personnalisé sur Vercel
2. Activez les notifications Slack (optionnel)
3. Configurez les tests E2E
4. Ajoutez le monitoring avec Sentry ou LogRocket
