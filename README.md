# MS Chat v3 (Full-Stack Messenger & Developer API)

**Live Domain:** [https://ms-chat-messenger.vercel.app/](https://ms-chat-messenger.vercel.app/)

MS Chat is a modern, real-time messaging application built on Vercel Serverless Functions, Upstash Redis, Firebase, and Vercel Blob. It features a full authentication system, real-time updates, media sharing, push notifications, and a **Developer API system** allowing users to generate API keys and build third-party integrations.

---

## 📁 Project Structure
Keep these files in the repo root (only `api/index.js` and `api.html` go inside the `api/` and root directory respectively):
- `index.html` (Main Chat UI)
- `api.html` (Developer API Dashboard)
- `api/index.js` (The main backend Serverless Function)
- `notification.js` · `sw.js` · `firebase-messaging-sw.js`
- `vercel.json` · `package.json` · `manifest.json`
- Icons & `notification.mp3`

---

## 🚀 Vercel Setup & Deployment

### 1. Fixing the "Red X" (Deployment Fail)
If your Vercel deployment fails, it is usually due to Node.js version mismatches. Remove `"engines": {"node": "20.x"}` from `package.json` and ensure `memory` is removed from `vercel.json`. If it still fails, check **Vercel -> Deployments -> Build Logs** for exact errors.

### 2. Database & Storage (Required)
- **Upstash Redis:** Connect via Vercel Storage tab. This is required for sessions, messages, and API tokens (`KV_REST_API_URL` / `KV_REST_API_TOKEN`).
- **Vercel Blob:** Connect via Vercel Storage tab. Required for fallback media uploads (`BLOB_READ_WRITE_TOKEN`).
- *Note: Whenever you connect a new storage or change Environment Variables, you MUST trigger a Redeploy.*

### 3. Environment Variables
Go to Vercel Project Settings -> Environment Variables and add:
- `FIREBASE_SERVICE_ACCOUNT`: Paste the entire JSON from Firebase Console -> Project Settings -> Service Accounts -> Generate new private key. (Never commit this to GitHub).
- `AUTH_SECRET`: Any long random string (used for hashing and API security).
- `EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`: For sending OTPs via email.
- `EMAILJS_PRIVATE_KEY`: **Required** if "Use Private Key" is enabled in your EmailJS account settings.
- `BLOB_READ_WRITE_TOKEN`: Auto-added when you connect Vercel Blob.

### 4. Verify Health
After redeploying, visit `/api/health` (e.g., `https://your-domain.vercel.app/api/health`). 
Expected response: `{"ok":true, "db":true, "blob":true, "firebase":true, "emailjs":true}`. If any is `false`, that specific environment variable is missing.

---

## 🔔 Push Notifications Setup
1. Open the app on your phone -> Tap **Enable notifications** at the top of the chat list -> Allow.
2. Go to Settings -> **Send test notification**. Minimize the app to see the push.
3. If it fails, the error toast will tell you why (e.g., missing Firebase env or token).
4. *Android tip:* Ensure Chrome Site Settings have Notifications allowed, and Battery Saver is not killing the app.

---

## 🔐 Authentication System
- **Email Login:** Enter email -> OTP is sent via Email (or via "MS SPAM CHAT" if already logged in on another device) -> Enter code -> Login.
- **Forgot Password:** (For Two-Step accounts) Sends a recovery code to email, which removes the two-step password.
- **QR Login:** On a new device, choose "Login with QR". On your logged-in phone, go to Settings > Privacy and Security > Devices > **Add Device** and scan the code.
- **Auto Logout:** Devices auto-logout after 1 week, 1 month, 3 months, 6 months (default), or 1 year of inactivity.

---

## 🛠️ Developer API System

MS Chat includes a full API system similar to the Telegram Bot API, allowing users to build their own clients or integrations.

### 1. Accessing the Developer Dashboard
Navigate to `https://your-domain.vercel.app/api.html` (or wherever you host `api.html`).
1. Enter your MS Chat registered email.
2. Click **Send OTP**. The OTP will be sent directly to your email.
3. Enter the OTP to verify.
4. You can generate up to **3 active API keys**. You can copy them or delete/revoke them at any time.

### 2. Using the API Endpoints
Once you have an API key (e.g., `ms_dev_xxxx`), you can use it to authenticate requests. 
**Base URL:** `https://your-domain.vercel.app/api/ms-api/{YOUR_API_KEY}`

**Example Routes:**
- `GET /chats` - Fetch your chat list.
- `GET /msgs?chat={chatId}` - Fetch messages for a specific chat.
- `POST /send` - Send a message. Body: `{"chat": "p:123:456", "text": "Hello"}`
- `GET /me` - Get your profile info.

*Note: For security reasons, `auth/register` (Signup) is disabled via the Developer API. You can only access existing accounts using the API key.*

---

## 📸 Media Upload (Firebase Storage, max 2 GB)
1. Firebase Console -> **Authentication** -> Get started (just enable it, no providers needed).
2. Firebase Console -> **Storage** -> Get started (Firebase Blaze plan may be required).
3. Paste these **Storage Rules** and Publish:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /u/{uid}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid
                   && request.resource.size < 2 * 1024 * 1024 * 1024;
    }
  }
}
