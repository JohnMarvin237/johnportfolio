# GitHub Secrets Configuration

This document lists all the secrets and environment variables needed for the CI/CD pipeline.

## Required GitHub Secrets

### Vercel Secrets
- `VERCEL_TOKEN`: Your Vercel API token
  - Get it from: https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: Your Vercel organization ID
  - Find it in: Project Settings > General
- `VERCEL_PROJECT_ID`: Your Vercel project ID
  - Find it in: Project Settings > General

### Database Secrets
- `DATABASE_URL`: PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database?sslmode=require`

### Authentication Secrets
- `NEXTAUTH_SECRET`: Random string for NextAuth.js
  - Generate with: `openssl rand -base64 32`

### Email Secrets (for contact form)
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASSWORD`: SMTP password
- `EMAIL_FROM`: Sender email address
- `EMAIL_TO`: Recipient email address

### Optional Secrets
- `SLACK_WEBHOOK_URL`: Slack webhook for deployment notifications
- `SENTRY_AUTH_TOKEN`: Sentry authentication token for error tracking
- `GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID

## GitHub Environment Variables

### Production Environment
- `NEXT_PUBLIC_APP_URL`: https://your-domain.com
- `PROD_URL`: https://your-domain.com

### Preview Environment
- `NEXT_PUBLIC_APP_URL`: Dynamic preview URL
- `NEXT_PUBLIC_IS_PREVIEW`: true

## How to Add Secrets

1. Go to your GitHub repository
2. Click on Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each secret with its name and value

## Environment Setup

Create environments in GitHub:
1. Go to Settings > Environments
2. Create "production" environment with:
   - Required reviewers (optional)
   - Deployment branches: main only
3. Create "preview" environment with:
   - No restrictions

## Local Development

For local development, create a `.env.local` file:

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@example.com"
EMAIL_TO="admin@example.com"

# Vercel (for local testing)
VERCEL_TOKEN="..."
VERCEL_ORG_ID="..."
VERCEL_PROJECT_ID="..."
```

## Security Notes

- Never commit secrets to the repository
- Rotate secrets regularly
- Use strong, randomly generated values
- Limit access to production secrets
- Use environment-specific secrets when possible