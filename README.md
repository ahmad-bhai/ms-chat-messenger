# MS Chat - Modern Messaging Platform

MS Chat is a fast, secure, and feature-rich real-time messaging application. It combines the best features of modern messengers with a robust Developer API, allowing users to build third-party applications and integrations.

---

## ✨ Core Features

### 1. Real-Time Messaging
- **Instant Delivery:** Messages are delivered instantly using a highly optimized polling and update system.
- **Rich Text Formatting:** Support for Bold, Italic, Monospace, Strikethrough, Underline, and Spoilers (blurred text until clicked).
- **Message Actions:** Reply to specific messages, Forward messages, Pin important messages, and React with Emojis.
- **Edit & Delete:** Edit sent messages or delete them (for yourself or for everyone).
- **Status Ticks:** Single tick for sent, double tick for delivered, and colored double tick for read.

### 2. Authentication & Security
- **Email OTP Login:** Secure, passwordless login using 6-digit One-Time Passwords sent directly to your email.
- **QR Code Login:** Log in on a new device by simply scanning a QR code from an already logged-in device (just like WhatsApp Web).
- **Two-Step Verification (2FA):** Add an extra layer of security to your account with a custom 2FA password.
- **Passcode Lock:** Lock the app with a local passcode to prevent unauthorized access if someone gets your phone.
- **Device Management:** View all active sessions, see their last active time, and remotely log out other devices. Includes an auto-logout feature for inactive devices.

### 3. Media & Sharing
- **High-Quality Media:** Share photos, videos, audio files, and documents up to 2 GB.
- **Voice Notes:** Record and send voice messages with visual waveforms.
- **In-App Camera:** Take photos directly from the app.
- **Image Editor:** Crop, rotate, or draw on photos before sending.
- **Saved Messages:** A personal cloud storage space (up to 70 MB) to save notes, links, and files.

### 4. User Experience (UI/UX)
- **Dark & Light Modes:** Seamless switching between dark and light themes.
- **Customizable Chat:** Change text sizes, set custom wallpapers (from gallery or URL), and adjust message corner radius.
- **Animations:** A smooth, "slime-like" fluid animation system that scales based on your device's performance.
- **Privacy Controls:** Hide your "Last Seen" status from other users.
- **Block System:** Block users to prevent them from messaging or calling you.

### 5. Push Notifications
- **Real-Time Alerts:** Get instant notifications for new messages even when the app is closed (powered by Firebase).
- **Quick Reply:** Reply to messages directly from the notification tray.
- **Custom Sounds:** Enjoy custom in-app notification sounds.

---

## 🛠️ Developer API (Build Your Own Client)

MS Chat includes a powerful, Telegram-like Developer API. You can generate API keys and use them to build your own custom apps, bots, or web clients using the MS Chat backend.

### How to use the Developer API:
1. **Access the Dashboard:** Go to your app's URL and navigate to the **Developer API** page.
2. **Verify Identity:** Enter your registered MS Chat email. You will receive an OTP in your email inbox.
3. **Generate API Keys:** Once verified, you can generate up to **3 active API keys**.
4. **Integrate:** Use the provided API Key in your custom applications. You can copy the auto-generated code snippets for Node.js, JavaScript, Python, PHP, or cURL directly from the dashboard.

*Note: The Developer API allows full access to messaging, chat lists, and user profiles, but account registration (Signup) is disabled via API for security reasons.*

---

## ⚠️ Known Limitations
- **Background Notifications:** Custom in-app sounds only play when the app is open. Background notifications will use the default operating system sound.
- **Media Editing:** Complex video editing or advanced photo filters are not yet available.
- **Passkeys:** Biometric login (FaceID / Fingerprint) is currently not supported.

---
*Experience secure, fast, and flexible messaging with MS Chat.*
