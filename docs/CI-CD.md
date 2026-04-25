# CI/CD Pipeline Documentation

## Overview

This project uses GitHub Actions for CI/CD with automated deployments to Vercel.

## Pipeline Architecture

```
┌─────────────────┐
│   Developer     │
│  Push/PR Code   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  GitHub Actions │────▶│     Vercel      │────▶│   Production    │
│   CI Pipeline   │     │   Deployment    │     │   Environment   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Test Suite    │
│ Lint/Build/Test │
└─────────────────┘
```

## Workflows

### 1. Continuous Integration (CI)

**File**: `.github/workflows/ci.yml`
**Triggers**: Push to main/develop/phase4, Pull Requests

**Jobs**:
- **Lint**: Code quality checks with ESLint
- **Build**: Next.js build validation
- **Test**: Unit and integration tests with PostgreSQL
- **Security**: npm audit and vulnerability scanning
- **Lighthouse**: Performance auditing

### 2. Production Deployment

**File**: `.github/workflows/deploy-production.yml`
**Triggers**: Push to main branch, Manual dispatch

**Process**:
1. Build application with Vercel CLI
2. Deploy to Vercel production
3. Run database migrations
4. Execute post-deployment tests
5. Send notifications

### 3. Preview Deployments

**File**: `.github/workflows/preview.yml`
**Triggers**: Pull Request events

**Features**:
- Automatic preview URLs for each PR
- Lighthouse scores in PR comments
- Temporary environments
- Automatic cleanup on PR close

## Setup Instructions

### 1. Vercel Setup

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link your project:
   ```bash
   vercel link
   ```

3. Get your Vercel credentials:
   ```bash
   # Get token from https://vercel.com/account/tokens
   # Find ORG_ID and PROJECT_ID in .vercel/project.json
   ```

### 2. GitHub Configuration

1. Add repository secrets (Settings > Secrets):
   ```
   VERCEL_TOKEN
   VERCEL_ORG_ID
   VERCEL_PROJECT_ID
   DATABASE_URL
   NEXTAUTH_SECRET
   ```

2. Create environments:
   - `production`: Protected, requires approval
   - `preview`: Automatic for PRs

### 3. Database Setup

Ensure your production database supports migrations:

```bash
# Test migrations locally
npx prisma migrate dev

# Create production migration
npx prisma migrate deploy
```

## Development Workflow

### Feature Development

1. Create feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Push code:
   ```bash
   git push origin feature/your-feature
   ```

3. Open Pull Request:
   - CI pipeline runs automatically
   - Preview deployment created
   - Review Lighthouse scores

4. Merge to main:
   - Production deployment triggered
   - Database migrations run
   - Post-deployment tests execute

### Hotfix Process

1. Create hotfix branch from main:
   ```bash
   git checkout -b hotfix/critical-fix main
   ```

2. Fast-track deployment:
   ```bash
   # Manual deployment via GitHub Actions
   # Go to Actions > Deploy to Production > Run workflow
   ```

## Monitoring

### Build Status

Check workflow runs at:
```
https://github.com/[your-username]/[repo-name]/actions
```

### Deployment Status

Monitor deployments at:
```
https://vercel.com/[your-username]/[project-name]/deployments
```

### Performance Metrics

Lighthouse reports available in:
- PR comments for preview deployments
- Action artifacts for production deployments

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check logs
   npm run build

   # Validate TypeScript
   npx tsc --noEmit
   ```

2. **Database Connection**
   ```bash
   # Test connection
   npx prisma db pull

   # Reset migrations
   npx prisma migrate reset
   ```

3. **Vercel Deployment**
   ```bash
   # Check Vercel CLI
   vercel --version

   # Re-link project
   vercel link --yes
   ```

### Debug Mode

Enable debug logging:
```yaml
env:
  ACTIONS_RUNNER_DEBUG: true
  ACTIONS_STEP_DEBUG: true
```

## Best Practices

1. **Branch Protection**
   - Require PR reviews
   - Require status checks
   - Enforce linear history

2. **Commit Messages**
   ```
   feat: add user authentication
   fix: resolve memory leak in sidebar
   docs: update CI/CD documentation
   ```

3. **PR Guidelines**
   - Keep PRs small and focused
   - Include tests for new features
   - Update documentation
   - Review preview deployments

4. **Security**
   - Rotate secrets regularly
   - Use environment-specific variables
   - Limit production access
   - Enable 2FA on GitHub

## Rollback Procedure

### Vercel Rollback

1. Go to Vercel Dashboard
2. Select deployment to rollback to
3. Click "Promote to Production"

### Database Rollback

```bash
# Create backup first
pg_dump $DATABASE_URL > backup.sql

# Rollback migration
npx prisma migrate resolve --rolled-back

# Or restore from backup
psql $DATABASE_URL < backup.sql
```

## Performance Optimization

### Build Caching

- Node modules cached automatically
- Next.js build cache preserved
- Prisma client regenerated only on schema changes

### Parallel Execution

- Jobs run in parallel when possible
- Tests split across multiple runners
- Independent checks don't block each other

## Maintenance

### Weekly Tasks

- Review and merge Dependabot PRs
- Check for security vulnerabilities
- Monitor build times
- Clean up old deployments

### Monthly Tasks

- Rotate secrets
- Review and update dependencies
- Audit workflow performance
- Update documentation

## Contact

For CI/CD issues or questions:
- Create an issue in the repository
- Check GitHub Actions logs
- Review Vercel deployment logs

---

Last updated: December 2024