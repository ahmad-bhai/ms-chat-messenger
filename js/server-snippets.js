/* ============================================================================
   MS Chat - server snippets for YOUR api/index.js  (do NOT replace the file)
   ============================================================================ */

/* ---- 1) EmailJS: replace your whole  async function mail(...)  with this ---- */
let mailErr = '';
async function mail(to, subject, text, passcode) {
  const pubKey = process.env.EMAILJS_PUBLIC_KEY || process.env.EMAIL_JS_PUBLIC_KEY || 'QO4heLZusODhrA3Qb';
  const privKey = process.env.EMAILJS_PRIVATE_KEY || process.env.EMAIL_JS_PRIVATE_KEY || '';
  const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.EMAIL_JS_SERVICE_ID || 'service_p2lea5f';
  const templateId = process.env.EMAILJS_TEMPLATE_ID || process.env.EMAIL_JS_TEMPLATE_ID || 'template_cb0psbc';
  try {
    const body = {
      service_id: serviceId, template_id: templateId, user_id: pubKey,
      template_params: { email: to, to_email: to, user_email: to, reply_to: to, passcode, otp: passcode, code: passcode, subject, message: text, app_name: 'MS Chat' }
    };
    if (privKey) body.accessToken = privKey; // EmailJS Private Key (Account > API Keys)
    const x = await fetch('https://api.emailjs.com/api/v1.0/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!x.ok) { mailErr = (x.status + ' ' + (await x.text())).slice(0, 160); console.error('EmailJS error:', mailErr); return false; }
    mailErr = '';
    return true;
  } catch (err) { mailErr = err.message; console.error('EmailJS exception:', err.message); return false; }
}
/* ---- 2) Show the REAL reason: change these two error texts ----
   in '/auth/forgot':      {err:'Email service is not set up, ...'}   ->  {err: 'Email failed: ' + (mailErr || 'unknown')}
   in '/auth/login-start': {err:'Could not send login verification code.'} -> {err: 'Email failed: ' + (mailErr || 'unknown')}
*/

/* ---- 3) New routes for the chat list. Paste next to your other A['/...'] routes ---- */
A['/chat/flag'] = async (c, b) => { // pin / mark-as-unread for many chats at once
  for (const chat of (Array.isArray(b.chats) ? b.chats : []).slice(0, 1000)) {
    if (!can(c.uid, chat)) continue;
    const m = await getM(c.uid, chat);
    if (b.pin !== undefined) m.pin = b.pin ? now() : 0;
    if (b.unr !== undefined) m.unr = !!b.unr;
    await setM(c.uid, chat, m);
  }
  return { ok: true };
};
A['/chat/flags'] = async c => {
  const ids = (await r.zrange('ul:' + c.uid, 0, -1)).map(String), flags = {};
  await Promise.all(ids.map(async chat => { const m = await getM(c.uid, chat); if (m.pin || m.unr) flags[chat] = { pin: m.pin || 0, unr: !!m.unr }; }));
  return { flags };
};
A['/top'] = async c => { // people you chat with the most (max 21)
  const ids = (await r.zrange('ul:' + c.uid, 0, -1)).map(String).filter(x => x[0] === 'p' && !x.includes(SYS));
  const n = await Promise.all(ids.map(async chat => ({ chat, n: (await r.hlen('mh:' + chat)) || 0 })));
  return { top: n.sort((a, b) => b.n - a.n).slice(0, 21) };
};
