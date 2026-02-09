# Deployment Guide

This guide covers various deployment options for the Al-Houda Mosque prayer times display system.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Docker Deployment](#docker-deployment)
- [Docker Compose](#docker-compose)
- [Vercel Deployment](#vercel-deployment)
- [Platform.sh Deployment](#platformsh-deployment)
- [Traditional VPS Deployment](#traditional-vps-deployment)
- [Environment Variables](#environment-variables)
- [Production Checklist](#production-checklist)

---

## Prerequisites

- Node.js 20+ (for local development)
- Docker & Docker Compose (for containerized deployment)
- Git (for cloning the repository)
- A domain name (optional, for production)

---

## Docker Deployment

### Quick Start

```bash
# Build the Docker image
pnpm docker:build

# Run the container
docker run -d \
  --name alhouda-mosque \
  --restart unless-stopped \
  -p 3000:3000 \
  alhouda-mosque:latest
```

### Using the Deployment Script

```bash
# Deploy to production
./deploy.sh deploy

# Check health
./deploy.sh health

# View logs
./deploy.sh logs

# Stop the application
./deploy.sh stop
```

### Manual Docker Commands

```bash
# Build the image
docker build -t alhouda-mosque:latest .

# Run with custom environment variables
docker run -d \
  --name alhouda-mosque \
  --restart unless-stopped \
  -p 3000:3000 \
  -e MOSQUE_NAME="Your Mosque Name" \
  -e LOCATION_LAT=40.7128 \
  -e LOCATION_LNG=-74.0060 \
  alhouda-mosque:latest

# Stop and remove
docker stop alhouda-mosque
docker rm alhouda-mosque

# View logs
docker logs -f alhouda-mosque
```

---

## Docker Compose

### Production Deployment

```bash
# Start production containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all containers
docker-compose down
```

### Development Environment

```bash
# Start development environment with hot reload
docker-compose --profile dev up -d

# View development logs
docker-compose logs -f dev

# Stop development containers
docker-compose down
```

### With Nginx Reverse Proxy

```bash
# Start with Nginx
docker-compose --profile with-nginx up -d
```

---

## Vercel Deployment

### Automatic Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and deploy

### Manual Deployment with CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Environment Variables in Vercel

Set these in your Vercel project settings:

- `NEXT_TELEMETRY_DISABLED`: `1`

---

## Platform.sh Deployment

1. Create a new project on [Platform.sh](https://platform.sh)
2. Link your repository
3. Push your code

Platform.sh will use the `.platform.app.yaml` configuration file.

---

## Traditional VPS Deployment

### Manual Setup on Ubuntu/Debian

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Clone repository
git clone https://github.com/your-username/alhouda-mosque.git
cd alhouda-mosque

# Install dependencies
pnpm install

# Build application
pnpm build

# Start with PM2 (recommended)
npm install -g pm2
pm2 start npm --name "alhouda-mosque" -- start
pm2 save
pm2 startup
```

### Using PM2 Process Manager

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'alhouda-mosque',
    script: 'npm',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

Then run:

```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## Environment Variables

### Required Variables

None required - the app works with default settings.

### Optional Variables

Create a `.env.local` file:

```bash
# Application
NODE_ENV=production
PORT=3000

# Mosque Configuration
MOSQUE_NAME=Al-Houda Mosque
MOSQUE_CITY=Mecca
MOSQUE_COUNTRY=Saudi Arabia

# Location
LOCATION_LAT=21.4225
LOCATION_LNG=39.8262

# Prayer Calculation
CALCULATION_METHOD=1
ASR_METHOD=1

# Iqama Adjustments (minutes)
IQAMA_FAJR=10
IQAMA_DHUHR=10
IQAMA_ASR=10
IQAMA_MAGHRIB=5
IQAMA_ISHA=10

# Sound Settings
SOUND_ENABLED=true
SOUND_VOLUME=0.8
SOUND_TYPE=adhan

# Theme
THEME_FONT=cairo
THEME_PRIMARY=#1DCD9F
```

---

## Production Checklist

Before deploying to production, ensure:

- [ ] Environment variables are configured
- [ ] Location coordinates are correct
- [ ] Prayer calculation method is appropriate for your region
- [ ] Iqama times are adjusted according to your mosque's schedule
- [ ] Background images are optimized
- [ ] Audio files are working
- [ ] SSL/TLS is configured (if using custom domain)
- [ ] Firewall rules allow port 3000 (or configured port)
- [ ] Backup strategy is in place
- [ ] Monitoring/logging is configured
- [ ] Health checks are working

---

## SSL/TLS Configuration

### Using Certbot with Nginx

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

### Manual Certificate Setup

1. Place certificates in `./ssl/` directory
2. Uncomment SSL section in `nginx.conf`
3. Update certificate paths

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs alhouda-mosque-app

# Check container status
docker ps -a

# Rebuild image
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Application Not Responding

```bash
# Check health
./deploy.sh health

# Or manually
curl http://localhost:3000
```

---

## Maintenance

### Updating the Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
./deploy.sh deploy

# Or with Docker Compose
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Backup (if added)

```bash
# Backup script
./deploy.sh backup
```

### Monitoring

```bash
# View real-time logs
docker-compose logs -f

# Check container resource usage
docker stats
```

---

## Support

For deployment issues or questions:
- Open an issue on GitHub
- Contact the maintainers
- Check the main [README.md](./README.md)
