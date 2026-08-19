#!/usr/bin/env bash
set -euo pipefail

npm install
npm run build:android

if [ ! -d android ]; then
  npx cap add android
fi

npx cap sync android

echo "Android project ready. Run: npm run android:open"
