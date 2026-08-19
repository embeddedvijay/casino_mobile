# Gold365 Android App

## 1. Backend local network par chalaye

```bash
cd ~/casino/backend
uvicorn main:app --host 0.0.0.0 --port 8005
```

Phone aur computer same Wi-Fi par hone chahiye. Computer ka IP check kare:

```bash
hostname -I
```

`.env.android` me IP update kare:

```env
VITE_API_URL=http://192.168.0.106:8005
VITE_WS_URL=ws://192.168.0.106:8005
```

MongoDB phone me install nahi hogi. FastAPI local/server MongoDB se connect karega.

## 2. Pehli baar Android project generate kare

Node.js 20.19+ ya 22.12+ use kare.

```bash
npm run android:setup
npm run android:open
```

Android Studio me device select karke Run dabaye.

Baad ke har frontend change ke baad:

```bash
npm run android:sync
```

## 4. Debug APK banaye

```bash
npm run android:apk
```

APK:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## 5. Production server

`.env.production` banaye:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
```

Phir:

```bash
npm run build
npx cap sync android
```

Release ke liye Android Studio se signed AAB banaye:

```text
Build > Generate Signed Bundle / APK > Android App Bundle
```

## Important

- `localhost` Android phone ko refer karta hai, computer ko nahi.
- Production me HTTPS/WSS use kare.
- MongoDB URI kabhi frontend/app me na dale.
- User session ke liye login token API requests me Bearer token ke roop me bheje.
