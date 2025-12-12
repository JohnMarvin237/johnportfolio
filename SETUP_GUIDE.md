# Guide de Configuration Complet - Portfolio John

Ce guide vous aidera à configurer tous les services nécessaires pour votre portfolio.

## 1. Configuration de la Base de Données PostgreSQL (Supabase)

### Création du compte Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec votre compte GitHub
4. Cliquez sur **"New project"**
5. Remplissez les informations :
   - **Organization**: Votre organisation (ou créez-en une)
   - **Project name**: `johnportfolio`
   - **Database Password**: Cliquez sur "Generate a password" et **NOTEZ-LE**
   - **Region**: Sélectionnez "North America (N. Virginia)" ou la plus proche
   - **Pricing Plan**: Free tier (0$/mois)
6. Cliquez sur **"Create new project"** et attendez ~2 minutes

### Récupération de l'URL de connexion
1. Une fois le projet créé, allez dans **Settings** (icône engrenage)
2. Cliquez sur **Database** dans le menu de gauche
3. Scrollez jusqu'à **Connection string**
4. Copiez l'URL sous **"URI"** qui ressemble à :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```

## 2. Configuration de l'Envoi d'Emails (Gmail)

### Prérequis
- Un compte Gmail
- La vérification en 2 étapes activée

### Création d'un mot de passe d'application
1. Connectez-vous à votre compte Google
2. Allez sur [myaccount.google.com/security](https://myaccount.google.com/security)
3. Activez la **vérification en 2 étapes** si ce n'est pas déjà fait
4. Une fois activée, allez sur [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
5. Dans **"Select app"**, choisissez **"Mail"**
6. Dans **"Select device"**, choisissez **"Other (Custom name)"**
7. Entrez **"Portfolio"** comme nom
8. Cliquez sur **"Generate"**
9. **COPIEZ LE MOT DE PASSE À 16 CARACTÈRES** (sans les espaces)
   - Il ressemble à : `abcd efgh ijkl mnop`
   - Vous l'utiliserez comme : `abcdefghijklmnop`

## 3. Configuration des Clés de Sécurité

J'ai généré pour vous des clés sécurisées :

- **JWT_SECRET**: `2yhEa4m3jTQBEaDyHFxaut3+SHS6uhs+yFCe1vmfSYA=`
- **SESSION_SECRET**: `pczzhlIO36fUDQImxc/3z11xAIRJ7Hz6AWrjLjUF3pk=`

## 4. Votre Fichier .env Complet

Voici votre fichier `.env` avec toutes les configurations :

```bash
# ====================
# DATABASE - SUPABASE
# ====================
# Remplacez [YOUR-PASSWORD] par le mot de passe généré à l'étape 1
# Remplacez xxxxxxxxxxxx par votre identifiant de projet Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres"

# ====================
# AUTHENTICATION
# ====================
# Clés de sécurité générées (NE PAS CHANGER)
JWT_SECRET="2yhEa4m3jTQBEaDyHFxaut3+SHS6uhs+yFCe1vmfSYA="
JWT_EXPIRES_IN="30d"

# ====================
# EMAIL CONFIGURATION - GMAIL
# ====================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
# Remplacez par votre email Gmail
SMTP_USER="votre.email@gmail.com"
# Remplacez par le mot de passe d'application de l'étape 2 (sans espaces)
SMTP_PASSWORD="abcdefghijklmnop"

# Adresses email
EMAIL_FROM="Portfolio John <votre.email@gmail.com>"
# Email qui recevra les notifications de contact
EMAIL_TO="votre.email@gmail.com"

# ====================
# NEXT.JS CONFIGURATION
# ====================
NODE_ENV="development"
NEXT_PUBLIC_URL="http://localhost:3000"

# ====================
# OPTIONAL CONFIGURATIONS
# ====================
ENABLE_EMAIL_NOTIFICATIONS="true"
RATE_LIMIT_PER_MINUTE="60"
SESSION_SECRET="pczzhlIO36fUDQImxc/3z11xAIRJ7Hz6AWrjLjUF3pk="
```

## 5. Instructions d'Installation Finale

1. **Copiez les configurations** :
   ```bash
   # Remplacez le fichier .env existant
   cp SETUP_GUIDE.md .
   # Éditez .env avec vos vraies valeurs
   ```

2. **Testez la connexion à la base de données** :
   ```bash
   npx prisma db push
   ```

3. **Créez les tables dans la base** :
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Créez un utilisateur admin initial** :
   ```bash
   npx prisma db seed
   ```

5. **Lancez le projet** :
   ```bash
   npm run dev
   ```

## 6. Vérification

- **Base de données** : Allez sur Supabase Dashboard → Table Editor pour voir vos tables
- **Email** : Le formulaire de contact enverra un email à `EMAIL_TO`
- **Admin** : Connectez-vous à `/admin` avec :
  - Email : `admin@portfolio.com`
  - Mot de passe : `ChangeMe123!`

## 7. Informations Importantes

### Limites Gratuites
- **Supabase** : 500 MB de stockage, 2GB de transfert/mois
- **Gmail** : 500 emails/jour

### Sécurité
- Ne partagez JAMAIS votre fichier `.env`
- Changez le mot de passe admin après la première connexion
- Les clés JWT sont uniques et sécurisées

### Support
Si vous rencontrez des problèmes :
1. Vérifiez que toutes les valeurs dans `.env` sont correctes
2. Assurez-vous que la vérification en 2 étapes est activée sur Gmail
3. Vérifiez les logs avec `npm run dev`

## Prochaines Étapes

Une fois tout configuré :
1. Changez le mot de passe admin
2. Ajoutez votre contenu via le dashboard admin
3. Personnalisez le design selon vos besoins
4. Déployez sur Vercel