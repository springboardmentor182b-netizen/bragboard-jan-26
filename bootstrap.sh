#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# BragBoard EC2 Bootstrap Script
# Run this once on a fresh Ubuntu 24.04 EC2 instance via SSH:
#   bash bootstrap.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

echo "==> Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

echo "==> Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "==> Adding ubuntu user to docker group..."
sudo usermod -aG docker ubuntu
sudo systemctl enable docker

echo "==> Installing Nginx and Node.js..."
sudo apt-get install -y nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "==> Installing git..."
sudo apt-get install -y git

echo "==> Cloning BragBoard repository..."
# Replace with your actual GitHub repo URL
REPO_URL="https://github.com/YOUR_ORG/bragboard-jan-26.git"
git clone "$REPO_URL" ~/bragboard
cd ~/bragboard

echo "==> Creating uploads directory..."
mkdir -p ~/bragboard/uploads

echo ""
echo "✅ Bootstrap complete!"
echo ""
echo "Next steps:"
echo "  1. Create .env.production:"
echo "     cp .env.production.example .env.production"
echo "     nano .env.production   # Fill in DATABASE_URL, SECRET_KEY, GEMINI_API_KEY, CORS_ORIGINS"
echo ""
echo "  2. Start the backend:"
echo "     newgrp docker"
echo "     docker compose -f docker-compose.prod.yml up -d --build"
echo ""
echo "  3. Run database migrations:"
echo "     docker exec bragboard_server python create_tables.py"
echo ""
echo "  4. Build the frontend:"
echo "     cd client && npm ci && npm run build && cd .."
echo ""
echo "  5. Set up Nginx:"
echo "     sudo cp nginx.conf /etc/nginx/sites-available/bragboard"
echo "     sudo ln -s /etc/nginx/sites-available/bragboard /etc/nginx/sites-enabled/"
echo "     sudo rm -f /etc/nginx/sites-enabled/default"
echo "     sudo mkdir -p /var/www/bragboard"
echo "     sudo cp -r client/dist/* /var/www/bragboard/"
echo "     sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "  6. Visit http://\$(curl -s ifconfig.me) in your browser!"
