# Papyrus AI Deployment Guide

## Prerequisites

### System Requirements
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher
- **Operating System**: Linux, macOS, or Windows
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: At least 1GB free space

### Required API Keys
- **OpenAI API Key**: For AI content analysis and enhancement
  - Get your API key from: https://platform.openai.com/api-keys
  - Set monthly usage limits to control costs

### Optional Services
- **Database**: For user management and document storage (future enhancement)
- **Redis**: For caching and session management (future enhancement)
- **Cloud Storage**: AWS S3, Google Cloud Storage, etc. (future enhancement)

---

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd smart-pdf-generator

# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install:all
```

### 2. Environment Configuration

```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit the environment file
nano backend/.env
```

**Required Environment Variables:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# PDF Generation
PDF_TEMPLATE_DIR=templates
OUTPUT_DIR=generated
```

### 3. Start Development Servers

```bash
# Start both backend and frontend in development mode
npm run dev

# Or start individually:
npm run backend:dev  # Backend only (port 5000)
npm run frontend:dev # Frontend only (port 3000)
```

### 4. Verify Installation

- **Backend**: Visit http://localhost:5000/health
- **Frontend**: Visit http://localhost:3000
- **API**: Test with http://localhost:5000/api/pdf/templates

---

## Production Deployment

### Option 1: Traditional Server Deployment

#### 1. Prepare the Server

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install additional dependencies
sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd smart-pdf-generator

# Install dependencies
npm run install:all

# Build frontend
npm run build

# Set up environment
cp backend/.env.example backend/.env
# Edit backend/.env with production values

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [{
    name: 'smart-pdf-generator',
    cwd: './backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
}
EOL

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### 3. Set up Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/smart-pdf-generator
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (React build)
    location / {
        root /path/to/smart-pdf-generator/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve generated files
    location /generated/ {
        alias /path/to/smart-pdf-generator/backend/generated/;
        expires 1h;
        add_header Cache-Control "public, immutable";
    }

    # File upload size limit
    client_max_body_size 10M;
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/smart-pdf-generator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile

**Backend Dockerfile:**
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

# Install system dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

**Frontend Dockerfile:**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/generated:/app/generated
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  uploads:
  generated:
```

#### 3. Deploy with Docker

```bash
# Create environment file
echo "OPENAI_API_KEY=your_key_here" > .env

# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale backend if needed
docker-compose up -d --scale backend=3
```

### Option 3: Cloud Platform Deployment

#### Heroku

```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create smart-pdf-generator

# Set environment variables
heroku config:set OPENAI_API_KEY=your_key_here
heroku config:set NODE_ENV=production

# Create Procfile
echo "web: cd backend && node server.js" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Vercel (Frontend only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

#### AWS EC2

1. Launch EC2 instance (Ubuntu 20.04 LTS)
2. Configure security groups (ports 22, 80, 443, 5000)
3. Follow traditional server deployment steps
4. Set up SSL with Let's Encrypt

---

## Production Configuration

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Security Headers

Add to Nginx configuration:
```nginx
# Security headers
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
```

### Monitoring

```bash
# Set up log rotation
sudo nano /etc/logrotate.d/smart-pdf-generator

# Monitor with PM2
pm2 monit

# Set up alerts
pm2 install pm2-server-monit
```

---

## Performance Optimization

### Backend Optimization

1. **Enable compression:**
```javascript
// In server.js
const compression = require('compression');
app.use(compression());
```

2. **Implement caching:**
```javascript
const redis = require('redis');
const client = redis.createClient();
```

3. **Optimize Puppeteer:**
```javascript
// Launch browser once and reuse
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true
});
```

### Frontend Optimization

1. **Code splitting:**
```javascript
const LazyComponent = lazy(() => import('./Component'));
```

2. **Service worker for caching**
3. **Image optimization**
4. **Bundle analysis:**
```bash
npm run build -- --analyze
```

---

## Troubleshooting

### Common Issues

1. **Puppeteer fails to launch:**
   - Install required system fonts
   - Check Chrome/Chromium installation
   - Verify sandbox permissions

2. **File upload issues:**
   - Check file size limits
   - Verify upload directory permissions
   - Monitor disk space

3. **OpenAI API errors:**
   - Verify API key validity
   - Check usage limits
   - Monitor rate limiting

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Check logs
pm2 logs smart-pdf-generator

# Monitor resources
pm2 monit
```

### Backup Strategy

```bash
# Backup generated files
tar -czf backup-$(date +%Y%m%d).tar.gz backend/generated/

# Database backup (when implemented)
# mysqldump or pg_dump commands
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple backend instances
- Shared storage for generated files
- Database clustering

### Vertical Scaling
- Increase server resources
- Optimize memory usage
- Monitor performance metrics

### CDN Integration
- Serve static files via CDN
- Cache generated PDFs
- Optimize global delivery
