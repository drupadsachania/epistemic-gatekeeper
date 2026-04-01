# Quick Start Guide - Production Deployment

## 🚀 Fast Track to Production

Follow this guide to deploy the Kairos ECL application to production quickly.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Docker installed (for containerized deployment)
- GitHub account with repository access
- Domain with DNS access
- SSL certificates (or auto-generate with Let's Encrypt)

## Step 1: Local Setup (5 minutes)

```bash
# Clone repository
git clone <repository-url>
cd kairos-site-restruct/epistemic-gatekeeper

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.production

# Edit with your values
nano .env.production
```

### Required `.env.production` Values

```env
VITE_API_URL=https://api.kairos-ecl.com
VITE_SENTRY_DSN=https://your-key@sentry.io/project-id
VITE_ANALYTICS_ID=UA-XXXXXXXXX-X
VITE_SERVICE_WORKER_ENABLED=true
VITE_DEBUG_MODE=false
```

## Step 2: Build Verification (2 minutes)

```bash
# Build for production
npm run build

# Verify build output
ls -lah dist/assets/

# Should see: index-*.js, vendor-*.js, section-*.js files
```

## Step 3: Docker Setup (5 minutes)

### Option A: Build Locally

```bash
# Build Docker image
docker build -t kairos-ecl:latest .

# Test locally
docker run -p 3000:3000 kairos-ecl:latest

# Visit http://localhost:3000
```

### Option B: Use Docker Compose

```bash
# Create production environment file
cat > .env.docker << EOF
VITE_API_URL=https://api.kairos-ecl.com
VITE_SENTRY_DSN=https://your-key@sentry.io/project-id
EOF

# Start with docker-compose
docker-compose up -d

# Check status
docker-compose ps
```

## Step 4: Configure GitHub Actions (3 minutes)

Go to your GitHub repository → Settings → Secrets and add:

```
DOCKER_USERNAME          = your-docker-username
DOCKER_PASSWORD          = your-docker-token
STAGING_DEPLOY_KEY       = (SSH private key)
STAGING_DEPLOY_HOST      = staging-server-ip
STAGING_DEPLOY_PATH      = /home/deploy/kairos
STAGING_URL              = https://staging.kairos-ecl.com
PROD_DEPLOY_KEY          = (SSH private key)
PROD_DEPLOY_HOST         = production-server-ip
PROD_DEPLOY_PATH         = /home/deploy/kairos
```

## Step 5: Configure Production Server (10 minutes)

### On Production Server

```bash
# Create deploy directory
mkdir -p /home/deploy/kairos
cd /home/deploy/kairos

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  app:
    image: your-registry/kairos-ecl:latest
    ports:
      - "3000:3000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 3s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped
EOF

# Create nginx directory
mkdir -p ssl

# Place your SSL certificates
# cp your-cert.pem ssl/cert.pem
# cp your-key.pem ssl/key.pem

# Copy nginx configuration
cp nginx.conf ./

# Start services
docker-compose up -d
```

## Step 6: Deploy (2 minutes)

### Option A: GitHub Actions (Automated)

```bash
# Push to main branch
git add .
git commit -m "Deploy: Production v1.0.0"
git push origin main

# GitHub Actions will:
# 1. Run tests
# 2. Build Docker image
# 3. Push to registry
# 4. Deploy to staging
# 5. Deploy to production
# 6. Run smoke tests
```

### Option B: Manual Deployment

```bash
# Push image to registry
docker tag kairos-ecl:latest your-registry/kairos-ecl:latest
docker push your-registry/kairos-ecl:latest

# SSH to production server
ssh user@production-server

# Pull and restart
cd /home/deploy/kairos
docker-compose pull
docker-compose up -d

# Verify
docker-compose logs -f
```

## Step 7: Verify Production (5 minutes)

```bash
# Test web server
curl -I https://kairos-ecl.com

# Expected response: HTTP/2 200

# Check Service Worker
curl https://kairos-ecl.com/service-worker.js

# Verify health endpoint
curl https://api.kairos-ecl.com/api/health

# Check Sentry dashboard
# Visit https://sentry.io and trigger a test error
```

## Monitoring & Maintenance

### Check Application Status

```bash
# View logs
docker-compose logs -f app

# Check health
curl http://localhost:3000/health

# Monitor resources
docker stats kairos-ecl-app
```

### Common Commands

```bash
# Restart application
docker-compose restart app

# Update to latest version
docker-compose pull
docker-compose up -d

# View recent errors
docker-compose logs -f --tail=100

# Stop application
docker-compose down

# Clean up
docker system prune -a
```

### Health Monitoring

Access health endpoint from browser console:
```javascript
// Check application health
const health = await window.__kairosHealth();
console.log(health);
// Shows: status, uptime, checks, metrics
```

## Troubleshooting

### 1. Application Won't Start

```bash
# Check logs
docker-compose logs app

# Check port availability
netstat -an | grep 3000

# Verify image exists
docker images | grep kairos

# Rebuild if needed
docker-compose up --build
```

### 2. Service Worker Not Working

```javascript
// In browser console:
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
// Then hard refresh: Ctrl+Shift+R
```

### 3. API Connection Issues

```bash
# Test API endpoint
curl -v https://api.kairos-ecl.com/api/health

# Check CORS headers
curl -I -X OPTIONS https://api.kairos-ecl.com/api/health

# Verify firewall rules
telnet api.kairos-ecl.com 443
```

### 4. High Memory Usage

```bash
# Check container limits
docker inspect kairos-ecl-app | grep -i memory

# Restart container
docker-compose restart app

# Clear caches
curl http://localhost:3000/clear-cache
```

## Security Checklist

- [ ] SSL/TLS certificates installed
- [ ] Security headers configured (CSP, etc.)
- [ ] Rate limiting enabled in nginx
- [ ] Firewall rules configured
- [ ] Database credentials secured
- [ ] API keys not in source code
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured

## Performance Checklist

- [ ] Gzip compression enabled
- [ ] Service Worker enabled
- [ ] Cache headers configured
- [ ] CDN configured (optional)
- [ ] Images optimized
- [ ] Database indexed
- [ ] Load balancer configured (if applicable)
- [ ] Performance metrics being collected

## Scaling Considerations

### Horizontal Scaling
```bash
# Multiple app instances with load balancer
docker-compose up -d --scale app=3
```

### Vertical Scaling
```bash
# Increase container memory
# Edit docker-compose.yml
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

### Database Scaling
```bash
# Use managed database service
# Connect via VITE_API_URL environment variable
```

## Rollback Procedure

### If Deployment Fails

```bash
# Option 1: Rollback image
docker-compose down
docker pull your-registry/kairos-ecl:previous-tag
docker-compose up -d

# Option 2: Rollback git
git revert <commit-hash>
git push origin main
# GitHub Actions will redeploy

# Option 3: Quick fix
docker-compose restart app
```

## Next Steps

1. **Set up monitoring**
   - Configure Sentry alerts
   - Set up Google Analytics
   - Configure uptime monitoring

2. **Configure backups**
   - Database backups
   - Log aggregation
   - Disaster recovery plan

3. **Team training**
   - Deployment procedures
   - Incident response
   - Monitoring procedures

4. **Continuous improvement**
   - Monitor performance metrics
   - Gather user feedback
   - Plan for improvements

## Support Resources

- **Documentation**: See `DEPLOYMENT_GUIDE.md`
- **Project Summary**: See `PROJECT_COMPLETION_SUMMARY.md`
- **Phase Details**: See `PHASE_7_SUMMARY.md`
- **Checklist**: See `PHASE_7_CHECKLIST.md`

## Quick Reference

| Task | Command |
|------|---------|
| Build locally | `npm run build` |
| Build Docker | `docker build -t kairos-ecl .` |
| Test locally | `docker run -p 3000:3000 kairos-ecl` |
| Start services | `docker-compose up -d` |
| View logs | `docker-compose logs -f` |
| Stop services | `docker-compose down` |
| Deploy via CI/CD | `git push origin main` |
| Check health | `curl https://kairos-ecl.com/health` |
| View errors | `docker-compose logs --tail=50` |

---

## Estimated Time

- First-time setup: **30-45 minutes**
- Subsequent deployments: **2-5 minutes**
- Troubleshooting: **5-30 minutes** (depending on issue)

---

**Last Updated**: 2026-04-01
**Status**: ✅ Production Ready
