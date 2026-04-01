# Kairos ECL - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Kairos ECL application to production environments.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Local Testing](#local-testing)
4. [Docker Deployment](#docker-deployment)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Rollback Procedures](#rollback-procedures)

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing: `npm run test`
- [ ] No linting errors: `npm run lint`
- [ ] No console errors in development: `npm run dev`
- [ ] Bundle size acceptable (< 1.5 MB gzipped)
- [ ] All dependencies up to date: `npm audit`

### Security
- [ ] All security headers configured in `.env.production`
- [ ] Sentry DSN configured for error tracking
- [ ] CORS origin set correctly
- [ ] API keys not committed to repository
- [ ] Service worker properly configured
- [ ] CSP headers tested

### Performance
- [ ] Code splitting verified: Check `dist/assets/` folder
- [ ] Service worker enabled in production
- [ ] Cache strategies configured correctly
- [ ] Images optimized
- [ ] Bundle analyzed: `npm run build`

### Documentation
- [ ] README updated
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment steps verified

## Environment Setup

### 1. Create Environment Files

Create `.env.production`:
```bash
cp .env.example .env.production
```

Edit `.env.production` with production values:
```env
VITE_API_URL=https://api.kairos-ecl.com
VITE_SENTRY_DSN=https://your-key@sentry.io/project-id
VITE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

### 2. Install Dependencies

```bash
npm ci  # Use ci for production installs
```

### 3. Build Project

```bash
npm run build
```

Verify build output in `dist/` directory:
```bash
ls -la dist/assets/
```

Expected output structure:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js (main bundle)
│   ├── index-[hash].css (main styles)
│   ├── section-research-[hash].js (lazy loaded)
│   ├── section-adoption-[hash].js (lazy loaded)
│   ├── vendor-react-[hash].js
│   ├── vendor-radix-[hash].js
│   └── ...
└── service-worker.js
```

## Local Testing

### 1. Preview Build

```bash
npm run preview
```

Access at `http://localhost:4173`

### 2. Test Service Worker

- Open DevTools (F12)
- Go to Application > Service Workers
- Verify worker is registered
- Check Cache Storage for cached assets
- Test offline mode

### 3. Test Error Tracking

Trigger a test error:
```javascript
// In browser console:
window.__test_error = () => { throw new Error('Test error'); };
__test_error();
```

Verify error appears in Sentry dashboard.

### 4. Test Performance

```bash
npm run build
npm run preview
```

Use Lighthouse in DevTools:
- Performance score should be > 90
- Accessibility score should be > 90
- Best Practices score should be > 90

## Docker Deployment

### 1. Build Docker Image

```bash
docker build -t kairos-ecl:latest .
```

### 2. Test Docker Image Locally

```bash
docker run -p 3000:3000 kairos-ecl:latest
```

Access at `http://localhost:3000`

### 3. Push to Docker Registry

```bash
docker tag kairos-ecl:latest your-registry/kairos-ecl:latest
docker push your-registry/kairos-ecl:latest
```

### 4. Deploy to Production Server

```bash
# SSH into production server
ssh user@production-server

# Pull latest image
docker pull your-registry/kairos-ecl:latest

# Stop old container
docker-compose down

# Update docker-compose.yml if needed
# Then start new container
docker-compose up -d

# Verify deployment
docker-compose logs -f
```

## CI/CD Pipeline

### GitHub Actions Setup

1. **Configure Secrets** in GitHub repository settings:
   - `DOCKER_USERNAME`: Docker Hub username
   - `DOCKER_PASSWORD`: Docker Hub password/token
   - `PROD_DEPLOY_KEY`: SSH private key
   - `PROD_DEPLOY_HOST`: Production server IP
   - `PROD_DEPLOY_PATH`: Path on server (e.g., `/home/deploy/kairos`)
   - `SLACK_WEBHOOK`: Slack webhook URL (optional)
   - `STAGING_*`: Staging environment secrets

2. **Push to Repository**:
   ```bash
   git add .
   git commit -m "Deploy: Production release v1.0.0"
   git push origin main
   ```

3. **Monitor Pipeline**:
   - Go to GitHub Actions tab
   - Watch CI/CD pipeline execution
   - Check build logs for errors

4. **Verify Deployment**:
   - Visit production URL: https://kairos-ecl.com
   - Check browser console for errors
   - Verify Service Worker is registered
   - Check Sentry for any errors

## Monitoring & Maintenance

### 1. Error Tracking (Sentry)

- Dashboard: https://sentry.io
- Set up alerts for critical errors
- Review error trends weekly
- Update app version in Sentry releases

### 2. Analytics

- Monitor user engagement
- Track page views and interactions
- Identify performance bottlenecks
- Review session duration and bounce rate

### 3. Uptime Monitoring

Set up external monitoring (e.g., Pingdom, UptimeRobot):
```
https://kairos-ecl.com/
https://kairos-ecl.com/framework
https://api.kairos-ecl.com/health
```

### 4. Log Aggregation

Configure centralized logging:
- Application logs → Logs service
- Error logs → Sentry
- Performance metrics → Analytics service
- Access logs → Web server logs

### 5. Database Backups

- Daily backups of production database
- Test backup restoration monthly
- Store backups in multiple geographic regions

## Rollback Procedures

### If Deployment Fails

```bash
# Option 1: Rollback Docker container
docker-compose down
docker pull your-registry/kairos-ecl:previous-tag
docker-compose up -d

# Option 2: Rollback git commits
git revert <commit-hash>
git push origin main
```

### Monitor After Rollback

- Check application status
- Verify Service Worker is functional
- Monitor error tracking for anomalies
- Notify team of rollback

### Post-Incident Review

1. Identify root cause
2. Document lesson learned
3. Update deployment checklist
4. Implement preventive measures

## Troubleshooting

### Service Worker Not Updating

```javascript
// In browser console:
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
// Then hard refresh: Ctrl+Shift+R
```

### High Bundle Size

```bash
npm run build
npm run analyze  # If analyzer configured
```

Check for:
- Unused dependencies
- Duplicate packages
- Large libraries that could be replaced

### API Connection Issues

1. Verify API endpoint in `.env.production`
2. Check CORS headers on API server
3. Monitor network tab in DevTools
4. Check Sentry for API errors

### Service Worker Cache Issues

Clear cache:
```javascript
// In service worker message handler:
if (event.data.action === 'clearCache') {
  caches.keys().then(names => {
    Promise.all(names.map(name => caches.delete(name)));
  });
}
```

Or manually in DevTools:
- Application > Cache Storage > Delete all

## Production URLs

- **Application**: https://kairos-ecl.com
- **API Server**: https://api.kairos-ecl.com
- **Staging**: https://staging.kairos-ecl.com
- **Error Tracking**: https://sentry.io/organizations/kairos
- **Status Page**: https://status.kairos-ecl.com

## Support & Escalation

For deployment issues:
1. Check deployment guide (this document)
2. Review CI/CD pipeline logs
3. Check application logs in production
4. Contact DevOps team
5. Escalate to infrastructure team if needed

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-01 | Initial deployment guide |

---

Last Updated: 2026-04-01
