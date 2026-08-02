#!/bin/bash
# Apex Qhub — build + deploy. Preserves source archives served via chat-admin.
set -e
SRC=/var/www/source.apexes.click
cd "$SRC"

echo ">>> [$(date '+%H:%M:%S')] Building production bundle..."
npm run build 2>&1 | tail -8

echo ">>> [$(date '+%H:%M:%S')] Refreshing source archives (so download link keeps working)..."
tar --exclude='node_modules' --exclude='dist' --exclude='.git' \
    --exclude='*.tsbuildinfo' --exclude='vite.config.js' --exclude='vite.config.d.ts' \
    -czf /tmp/.source-fresh.tar.gz . 2>/dev/null
find . -type f \! -path './node_modules/*' \! -path './dist/*' \! -path './.git/*' \
       \! -name '*.tsbuildinfo' \! -name 'vite.config.js' \! -name 'vite.config.d.ts' \
       -print0 | xargs -0 zip -q /tmp/.source-fresh.zip 2>/dev/null

echo ">>> [$(date '+%H:%M:%S')] Deploying to chat-admin.apexes.click..."
rsync -a --delete \
    --exclude=source.zip --exclude=source.tar.gz \
    dist/ /var/www/chat-admin.apexes.click/
# Place fresh archives after rsync (so they survive --delete)
mv /tmp/.source-fresh.tar.gz /var/www/chat-admin.apexes.click/source.tar.gz
mv /tmp/.source-fresh.zip    /var/www/chat-admin.apexes.click/source.zip
chmod 644 /var/www/chat-admin.apexes.click/source.{tar.gz,zip}

echo ">>> [$(date '+%H:%M:%S')] Deploying to chat-client.apexes.click..."
rsync -a --delete dist/ /var/www/chat-client.apexes.click/

echo ">>> [$(date '+%H:%M:%S')] Done. Live URLs:"
echo "    https://chat-admin.apexes.click"
echo "    https://chat-client.apexes.click"
echo "    https://chat-admin.apexes.click/source.zip      (download)"
echo "    https://chat-admin.apexes.click/source.tar.gz   (download)"
