# MS Chat v3 (Vercel + Upstash Redis + Firebase Push + Vercel Blob)

Domain: https://ms-chat-messenger.vercel.app

## Files (repo root; only `index.js` goes inside `api/`)
`index.html` · `api/index.js` · `notification.js` · `sw.js` · `firebase-messaging-sw.js` · `vercel.json` · `package.json` · `manifest.json` + icons + `notification.mp3` (already uploaded)

## Pehle red × fix (GitHub / Vercel)
Red × = Vercel deployment fail. Sabab: purani `package.json` mein `"engines": {"node": "20.x"}` (Vercel ne Node 20 band kar diya) aur `vercel.json` mein `memory`. Dono naye files mein hata diye hain. Agar phir red ho to Vercel -> Deployments -> failed deployment -> **Build Logs** kholo, wahan exact line likhi hogi.

## Vercel setup
1. Storage: **Upstash Redis** connect (KV_REST_API_URL / TOKEN).
2. Storage: **Blob** connect (BLOB_READ_WRITE_TOKEN). Iske bina "Failed to retrieve the client token" aata hai. Connect karke **Redeploy** zaroor karo.
3. Environment Variables:
   - `FIREBASE_SERVICE_ACCOUNT` = Firebase Console -> Project settings -> Service accounts -> Generate new private key -> poori JSON paste (GitHub par kabhi nahi).
   - `AUTH_SECRET` = koi lambi random text.
   - `RESEND_API_KEY` (+ `MAIL_FROM`) = optional: signup email verification + "Forgot password" recovery email ke liye (resend.com free).
4. Redeploy. Check: `/api/health` -> `{"ok":true,"db":true,"blob":true,"firebase":true}`. Jo `false` ho wahi env missing hai.

## Notifications check (sound aaya par display nahi)
1. Phone par app kholo -> list ke upar **Enable notifications** -> Allow.
2. Settings -> **Send test notification**. App minimise karo.
3. Error aaye to wohi bata dega (Firebase env missing / token missing). Android: Chrome ki Site settings mein Notifications Allowed hon, aur battery saver app ko band na kare.

## Login system
- **Email login**: email -> code **MS SPAM CHAT** (verified, "Service") chat mein aapke already-logged-in devices par aata hai (agar koi device logged-in nahi to email par, Resend chahiye) -> Two-step verification ho to password, warna login.
- **Forgot password** (two-step ka): email par code -> two-step hat jata hai.
- **QR login**: naye device par "Login with QR" -> purane phone par Settings > Privacy and security > Devices > **Add Device** -> scan. OTP nahi aata; two-step ho to sirf wahi poochta hai.
- **Auto logout**: Devices mein 1 week / 1 month / 3 months / **6 months (default)** / 1 year. Itne din unused device khud logout.

## Honest limits
- Background notification mein custom mp3 nahi bajta (OS ki awaaz); mp3 sirf app khuli hone par.
- Passkey (WebAuthn) abhi nahi hai; Passcode lock + Two-step hai.
- Photo/video editing (draw/mark) abhi nahi hai.
