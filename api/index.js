/* MS Chat - api/index.js (single Vercel serverless function, CommonJS)
   Env: KV_REST_API_URL/TOKEN (Upstash), BLOB_READ_WRITE_TOKEN, FIREBASE_SERVICE_ACCOUNT,
        AUTH_SECRET, EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID for email codes */
const crypto = require('crypto');
const { Redis } = require('@upstash/redis');
const r = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
});
const SECRET = process.env.AUTH_SECRET || 'ms-chat-secret';
const now = () => Date.now();
const SYS = '1000000';
const rid = () => crypto.randomBytes(24).toString('hex');
const hp = (p, s) => crypto.scryptSync(String(p), s, 32).toString('hex');
const hs = (v, uid) => crypto.createHash('sha256').update(SECRET + uid + v).digest('hex');
const ver = () => r.incr('ver');
const parts = c => (c[0] === 's' ? [c.slice(2)] : c.slice(2).split(':'));
const can = (u, c) => typeof c === 'string' && /^[ps]:/.test(c) && parts(c).includes(String(u));
const peerOf = (c, u) => (c[0] === 's' ? String(u) : parts(c).find(x => x !== String(u)));
const pairId = (a, b) => { a = String(a); b = String(b); return a === b ? 's:' + a : 'p:' + [a, b].sort().join(':'); };
const getM = (u, c) => r.get(`cm:${u}:${c}`).then(x => x || {});
const setM = (u, c, o) => r.set(`cm:${u}:${c}`, o);
const vis = (m, u, clr) => m && !m.dead && !(m.del || []).includes(u) && m.ts > (clr || 0);
const muted = m => m.mute === -1 || m.mute > now();
const isBlk = async (a, b) => a !== b && !!((await r.sismember('bl:' + a, b)) || (await r.sismember('bl:' + b, a)));

async function mail(to, subject, text, passcode) {
  const pubKey = process.env.EMAILJS_PUBLIC_KEY || process.env.EMAIL_JS_PUBLIC_KEY || 'QO4heLZusODhrA3Qb';
  const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.EMAIL_JS_SERVICE_ID || 'service_p2lea5f';
  const templateId = process.env.EMAILJS_TEMPLATE_ID || process.env.EMAIL_JS_TEMPLATE_ID || 'template_cb0psbc';

  try {
    // api/index.js ke mail function mein
const payload = {
  service_id: serviceId,
  template_id: templateId,
  user_id: pubKey,
  accessToken: process.env.EMAILJS_PRIVATE_KEY, // <-- YEH LINE ADD KAREIN
  template_params: {
    email: to,
    passcode: passcode,
    subject: subject,
    message: text
  }
};

    const x = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!x.ok) {
      const errText = await x.text();
      console.error('EmailJS Failed Status:', x.status, 'Response:', errText);
      throw new Error(`EmailJS failed: ${x.status} - ${errText}`);
    }

    console.log('EmailJS OK: mail sent to', to);
    return true;
  } catch (err) {
    console.error('EmailJS Exception Thrown:', err.message);
    throw err;
  }
}

let adm, fbErr = '';
function fb() {
  if (adm !== undefined) return adm;
  try {
    const a = require('firebase-admin');
    if (!a.apps.length) {
      const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      if (sa.private_key) sa.private_key = sa.private_key.replace(/\\n/g, '\n');
      a.initializeApp({ credential: a.credential.cert(sa) });
    }
    adm = a;
  } catch (e) { adm = null; fbErr = e.message; console.error('firebase init', e.message); }
  return adm;
}

function status(u, seen, blocked, vid) {
  if (u.sys) return 'Service';
  if (u.id === vid) return 'online';
  if (blocked || !seen) return 'last seen long time ago';
  const a = now() - seen, d = 864e5;
  if (a < 25000) return 'online';
  if (!u.hideSeen) return 'ts:' + seen;
  return 'last seen ' + (a < 7 * d ? 'recently' : a < 30 * d ? 'within a week' : a < 365 * d ? 'within a month' : a < 730 * d ? 'within a year' : 'a long time ago');
}
async function pub(u, vid) {
  if (!u) return null;
  const blocked = await isBlk(u.id, vid);
  const seen = (await r.get('seen:' + u.id)) || 0;
  return { id: u.id, name: u.name, username: u.username, bio: u.bio || '', dob: u.dob || '', avatar: blocked ? '' : u.avatar || '', verified: !!u.verified, sys: !!u.sys, status: status(u, seen, blocked, vid) };
}
const own = u => ({ id: u.id, email: u.email, name: u.name, username: u.username, bio: u.bio || '', dob: u.dob || '', avatar: u.avatar || '', hideSeen: !!u.hideSeen, autoOut: u.autoOut || 15552e6, two: !!(u.sec && u.sec.two), pass: !!(u.sec && u.sec.pass) });

async function newSession(uid, req) {
  const sid = rid();
  await r.set('sess:' + sid, { uid: String(uid), ua: (req.headers['user-agent'] || '').slice(0, 140), ts: now(), last: now() });
  await r.sadd('us:' + uid, sid);
  return sid;
}
async function auth(req) {
  const t = (req.headers.authorization || '').slice(7);
  if (!t) return null;
  const s = await r.get('sess:' + t);
  if (!s) return null;
  const u = await r.get('user:' + s.uid);
  if (!u) return null;
  if (now() - (s.last || s.ts) > (u.autoOut || 15552e6)) { await r.del('sess:' + t); await r.srem('us:' + s.uid, t); return null; }
  if (now() - (s.last || 0) > 600000) { s.last = now(); await r.set('sess:' + t, s); }
  await r.set('seen:' + s.uid, now());
  return { sid: t, uid: String(s.uid) };
}

async function bump(chat, m) {
  const v = await ver();
  m.v = v;
  await r.hset('mh:' + chat, { [m.id]: m });
  for (const u of parts(chat)) await r.zadd('uf:' + u, { score: v, member: chat + '|' + m.id });
}
async function touch(u, chat) {
  await r.zadd('uf:' + u, { score: await ver(), member: chat + '|0' });
}

async function notify(peer, from, m, chat) {
  try {
    const meta = await getM(peer, chat);
    if (muted(meta)) return;
    const toks = await r.smembers('fcm:' + peer);
    const a = fb();
    if (!toks.length || !a) return;
    const cn = await r.hget('ct:' + peer, from.id);
    const body = uni(m.media ? '[' + m.media.type + '] ' + (m.text || '') : m.text);
    const out = await a.messaging().sendEachForMulticast({
      tokens: toks,
      data: { title: cn || from.name, body: String(body).slice(0, 140), chatId: chat, msgId: String(m.id), ts: String(m.ts), silent: meta.mute === -2 ? '1' : '' },
      webpush: { headers: { Urgency: 'high', TTL: '86400' } }
    });
    out.responses.forEach((x, i) => { if (!x.success && /not-registered|invalid/.test((x.error && x.error.code) || '')) r.srem('fcm:' + peer, toks[i]); });
  } catch (e) { console.error('push failed', e.message); }
}

const cleanMedia = x => (x && typeof x.url === 'string' && /^https:\/\//.test(x.url)) ? { url: x.url.slice(0, 1500), name: String(x.name || '').slice(0, 120), size: +x.size || 0, type: ['image', 'video', 'audio', 'voice', 'file'].includes(x.type) ? x.type : 'file', dur: +x.dur || 0, wave: Array.isArray(x.wave) ? x.wave.slice(0, 64).map(n => (+n || 0) & 31) : undefined } : null;
const uni = t => {
  const m = (s, a, A, d) => [...s].map(c => { const x = c.charCodeAt(0); return x >= 65 && x <= 90 ? String.fromCodePoint(A + x - 65) : x >= 97 && x <= 122 ? String.fromCodePoint(a + x - 97) : d && x >= 48 && x <= 57 ? String.fromCodePoint(d + x - 48) : c; }).join('');
  return String(t || '').replace(/\|\|([\s\S]+?)\|\|/g, (_, x) => '\u2591'.repeat([...x].length))
    .replace(/\*\*([\s\S]+?)\*\*/g, (_, x) => m(x, 0x1D5EE, 0x1D5D4, 0x1D7EC)).replace(/__([\s\S]+?)__/g, (_, x) => m(x, 0x1D622, 0x1D608))
    .replace(/`([^`\n]+)`/g, (_, x) => m(x, 0x1D68A, 0x1D670, 0x1D7F6)).replace(/~~([\s\S]+?)~~/g, (_, x) => [...x].map(c => c + '\u0336').join(''))
    .replace(/\+\+([\s\S]+?)\+\+/g, (_, x) => [...x].map(c => c + '\u0332').join('')).replace(/(^|\n)> ?/g, '$1\u275D ');
};
async function send(uid, b) {
  const chat = b.chat;
  if (!can(uid, chat)) return { err: 'Chat mismatch. Go back and open the chat again.' };
  const peer = peerOf(chat, uid);
  if (peer === SYS) return { err: 'Service chat is read-only' };
  if (peer !== uid && (await isBlk(uid, peer))) return { err: 'You cannot message this user' };
  const text = String(b.text || '').slice(0, 4000);
  const media = cleanMedia(b.media);
  if (!text && !media) return { err: 'empty' };
  if (chat[0] === 's' && media) {
    const used = (await r.get('sv:' + uid)) || 0;
    if (used + (media.size || 0) > 70 * 1048576) return { err: 'Saved Messages full (70 MB limit)' };
    await r.incrby('sv:' + uid, media.size || 0);
  }
  const id = await r.incr('mid');
  const m = { id, chat, from: uid, text, ts: now(), media, reply: b.reply || null, fwd: b.fwd || null, react: {}, del: [], pin: [] };
  await bump(chat, m);
  await r.set('lm:' + chat, id);
  for (const u of new Set([uid, peer])) await r.zadd('ul:' + u, { score: m.ts, member: chat });
  if (peer !== uid) {
    await r.incr(`un:${peer}:${chat}`);
    await notify(peer, await r.get('user:' + uid), m, chat);
  }
  return { ok: true, msg: m };
}

async function markRead(uid, chat) {
  if (!can(uid, chat)) return { err: 'Chat mismatch. Go back and open the chat again.' };
  await r.set(`un:${uid}:${chat}`, 0);
  await r.set(`rd:${chat}:${uid}`, (await r.get('lm:' + chat)) || 0);
  const p = peerOf(chat, uid);
  if (p !== uid) await touch(p, chat);
  return { ok: true };
}
const allMsgs = async chat => (await r.hgetall('mh:' + chat)) || {};
const getMsg = async (c, b) => (can(c.uid, b.chat) ? r.hget('mh:' + b.chat, b.id) : null);

const rl = async (k, n) => { const c = await r.incr('rl:' + k); if (c === 1) await r.expire('rl:' + k, 60); return c <= n; };
async function sys() {
  let u = await r.get('user:' + SYS);
  if (!u) {
    u = { id: SYS, name: 'MS SPAM CHAT', username: 'msspamchat', email: '', bio: 'Official service notifications', avatar: 'https://ms-chat-messager.vercel.app/icon-512.png', sys: true, verified: true, sec: {} };
    await r.set('user:' + SYS, u); await r.set('uname:msspamchat', SYS);
  }
  return u;
}
async function sysSend(uid, text) {
  const s = await sys(), chat = pairId(SYS, uid), id = await r.incr('mid');
  const m = { id, chat, from: SYS, text, ts: now(), media: null, reply: null, fwd: null, react: {}, del: [], pin: [] };
  await bump(chat, m);
  await r.set('lm:' + chat, id);
  await r.zadd('ul:' + uid, { score: m.ts, member: chat });
  await r.incr(`un:${uid}:${chat}`);
  await notify(uid, s, m, chat);
}
async function liveSessions(uid) {
  let n = 0;
  for (const s of await r.smembers('us:' + uid)) { if (await r.get('sess:' + s)) n++; else await r.srem('us:' + uid, s); }
  return n;
}

async function sendCode(u, purpose, label) {
  const code = String(crypto.randomInt(100000, 999999));
  await r.set(`code:${purpose}:${u.id}`, { h: hs(code, u.id), exp: now() + 600000, tries: 0 }, { ex: 600 });
  const text = `${label} code:${code}\n\nDo not give this code to anyone, even if they say they are from MS Chat! This code can be used to access your account.`;

  if (purpose !== 'reset' && (await liveSessions(u.id))) {
    await sysSend(u.id, text);
    return 'chat';
  }

  try {
    await mail(u.email, 'MS Chat ' + label.toLowerCase() + ' code', text, code);
    return 'email';
  } catch (e) {
    console.error('sendCode mail failed:', e.message);
    return null;
  }
}

async function checkCode(uid, purpose, code) {
  const k = `code:${purpose}:${uid}`, o = await r.get(k);
  if (!o || o.exp < now()) return false;
  if (o.tries >= 5) { await r.del(k); return false; }
  if (o.h !== hs(String(code || '').trim(), uid)) { o.tries++; await r.set(k, o, { ex: 600 }); return false; }
  await r.del(k);
  return true;
}
const mkPend = async uid => { const p = rid(); await r.set('pend:' + p, { uid: String(uid), tries: 0 }, { ex: 600 }); return p; };
async function finish(u, req) {
  const had = await liveSessions(u.id);
  const token = await newSession(u.id, req);
  if (had) await sysSend(u.id, `New login to your account from: ${(req.headers['user-agent'] || 'unknown device').slice(0, 110)}\n\nIf this was not you, open Settings > Privacy and security > Devices and terminate that session.`);
  return { token, me: own(u) };
}

const A = {};
const open = {
  async '/auth/register'(req, b) {
    const email = String(b.email || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return { err: 'Invalid email' };
    const name = String(b.name || '').trim().slice(0, 40);
    if (!name) return { err: 'Name required' };
    if (await r.get('email:' + email)) return { err: 'Email already registered. Use Login.' };
    const id = String(7000000000 + (await r.incr('uid')));
    const username = String(b.username || '').replace(/^@/, '').trim() || 'user' + id.slice(-7);
    if (!/^[a-zA-Z]\w{2,31}$/.test(username)) return { err: 'Username: 3-32 chars, letters/numbers/_' };
    if (await r.get('uname:' + username.toLowerCase())) return { err: 'Username taken' };

    if (!b.code) {
      if (!(await rl('rg:' + email, 3))) return { err: 'Too many tries, wait a minute' };
      const code = String(crypto.randomInt(100000, 999999));
      await r.set('regc:' + email, hs(code, email), { ex: 600 });
      try {
        await mail(email, 'MS Chat verification code', 'Your code: ' + code, code);
      } catch (e) {
        console.error('register mail failed:', e.message);
        return { err: 'Could not send email' };
      }
      return { needCode: true };
    }
    if ((await r.get('regc:' + email)) !== hs(String(b.code).trim(), email)) return { err: 'Wrong code' };
    await r.del('regc:' + email);

    const u = { id, email, name, username, bio: '', dob: '', avatar: '', sec: {}, created: now() };
    await r.set('user:' + id, u); await r.set('email:' + email, id); await r.set('uname:' + username.toLowerCase(), id);
    return { token: await newSession(id, req), me: own(u) };
  },
  async '/auth/login-start'(req, b) {
    const email = String(b.email || '').trim().toLowerCase();
    if (!(await rl('ls:' + email, 5))) return { err: 'Too many tries, wait a minute' };
    const id0 = await r.get('email:' + email), id = id0 == null ? null : String(id0), u = id && (await r.get('user:' + id));
    if (!u) return { err: 'No account with this email. Create one first.' };
    const via = await sendCode(u, 'login', 'Login');
    return via ? { ok: true, via } : { err: 'Could not send login verification code.' };
  },
  async '/auth/login-verify'(req, b) {
    const email = String(b.email || '').trim().toLowerCase();
    if (!(await rl('lv:' + email, 10))) return { err: 'Too many tries, wait a minute' };
    const id0 = await r.get('email:' + email), id = id0 == null ? null : String(id0), u = id && (await r.get('user:' + id));
    if (!u || !(await checkCode(id, 'login', b.code))) return { err: 'Wrong or expired code' };
    if (u.sec && u.sec.two) return { need2fa: true, pend: await mkPend(id) };
    return finish(u, req);
  },
  async '/auth/login-2fa'(req, b) {
    const p = await r.get('pend:' + b.pend);
    if (!p) return { err: 'Session expired, start again' };
    const u = await r.get('user:' + p.uid);
    if (++p.tries > 5) { await r.del('pend:' + b.pend); return { err: 'Too many wrong tries' }; }
    if (hs(b.two || '', u.id) !== u.sec.two) { await r.set('pend:' + b.pend, p, { ex: 600 }); return { err: 'Wrong two-step password' }; }
    await r.del('pend:' + b.pend);
    return finish(u, req);
  },
  async '/auth/forgot'(req, b) {
    const p = await r.get('pend:' + b.pend);
    if (!p) return { err: 'Session expired, start again' };
    const u = await r.get('user:' + p.uid);
    return (await sendCode(u, 'reset', 'Password reset')) ? { ok: true } : { err: 'Could not send recovery code.' };
  },
  async '/auth/forgot-confirm'(req, b) {
    const p = await r.get('pend:' + b.pend);
    if (!p || !(await checkCode(p.uid, 'reset', b.code))) return { err: 'Wrong or expired code' };
    const u = await r.get('user:' + p.uid);
    delete u.sec.two; await r.set('user:' + u.id, u); await r.del('pend:' + b.pend);
    return finish(u, req);
  },
  async '/auth/qr-create'(req) {
    const id = crypto.randomBytes(12).toString('hex'), secret = rid();
    await r.set('qr:' + id, { secret, st: 'wait', ua: (req.headers['user-agent'] || '').slice(0, 140) }, { ex: 180 });
    return { id, secret };
  },
  async '/auth/qr-status'(req, b) {
    const o = await r.get('qr:' + b.id);
    if (!o || o.secret !== b.secret) return { err: 'expired' };
    if (o.st !== 'ok') return { wait: true };
    await r.del('qr:' + b.id);
    const u = await r.get('user:' + o.uid);
    if (u.sec && u.sec.two) return { need2fa: true, pend: await mkPend(u.id) };
    return finish(u, req);
  },
  async '/auth/api-keys'(req, b) {
    const key = rid();
    return { apiKey: 'ms_live_' + key };
  }
};

A['/me'] = async c => ({ me: own(await r.get('user:' + c.uid)) });
A['/me/update'] = async (c, b) => {
  const u = await r.get('user:' + c.uid);
  if (b.name !== undefined) { u.name = String(b.name).trim().slice(0, 40); if (!u.name) return { err: 'Name required' }; }
  if (b.bio !== undefined) u.bio = String(b.bio).slice(0, 120);
  if (b.dob !== undefined) u.dob = String(b.dob).slice(0, 10);
  if (b.avatar !== undefined) u.avatar = String(b.avatar);
  if (b.hideSeen !== undefined) u.hideSeen = !!b.hideSeen;
  if (b.username !== undefined && b.username !== u.username) {
    const nu = String(b.username).replace(/^@/, '').trim();
    if (!/^[a-zA-Z]\w{2,31}$/.test(nu)) return { err: 'Invalid username' };
    const ex = await r.get('uname:' + nu.toLowerCase());
    if (ex != null && String(ex) !== c.uid) return { err: 'Username taken' };
    await r.del('uname:' + u.username.toLowerCase());
    await r.set('uname:' + nu.toLowerCase(), c.uid);
    u.username = nu;
  }
  await r.set('user:' + c.uid, u);
  return { me: own(u) };
};
A['/user'] = async (c, b, q) => {
  const k = String(q.u || '').replace(/^@/, '');
  const raw = /^\d{10}$/.test(k) ? k : await r.get('uname:' + k.toLowerCase());
  const id = raw == null ? null : String(raw);
  const u = id && (await r.get('user:' + id));
  if (!u) return { err: 'User not found' };
  return {
    user: await pub(u, c.uid), chat: pairId(c.uid, id), self: id === c.uid,
    cn: (await r.hget('ct:' + c.uid, id)) || '', blocked: !!(await r.sismember('bl:' + c.uid, id))
  };
};

A['/chats'] = async c => {
  const ids = (await r.zrange('ul:' + c.uid, 0, -1, { rev: true })).map(String);
  const sv = 's:' + c.uid;
  if (!ids.includes(sv)) ids.unshift(sv);
  const out = await Promise.all(ids.map(async chat => {
    const [meta, lm, un] = await Promise.all([getM(c.uid, chat), r.get('lm:' + chat), r.get(`un:${c.uid}:${chat}`)]);
    const m = lm ? await r.hget('mh:' + chat, lm) : null;
    const pid = peerOf(chat, c.uid);
    const [pu, cn] = await Promise.all([r.get('user:' + pid), r.hget('ct:' + c.uid, pid)]);
    if (!pu) return null;
    return { chat, rd: +(await r.get('rd:' + chat + ':' + pid)) || 0, saved: chat === sv, peer: await pub(pu, c.uid), cn: cn || '', last: vis(m, c.uid, meta.clr) ? m : null, unread: +un || 0, mute: muted(meta) || meta.mute === -2 ? meta.mute : 0, blocked: !!(await r.sismember('bl:' + c.uid, pid)) };
  }));
  return { chats: out.filter(Boolean), v: +(await r.get('ver')) || 0 };
};
A['/msgs'] = async (c, b, q) => {
  const chat = q.chat;
  if (!can(c.uid, chat)) return { err: 'Chat mismatch. Go back and open the chat again.' };
  const meta = await getM(c.uid, chat);
  const list = Object.values(await allMsgs(chat)).filter(m => vis(m, c.uid, meta.clr)).sort((a, b) => a.id - b.id);
  let from = Math.max(0, list.length - 120);
  if (q.mode === 'first') from = 0;
  if (q.around) from = Math.max(0, list.findIndex(m => m.id === +q.around) - 40);
  const pins = list.filter(m => (m.pin || []).includes(c.uid));
  return { msgs: list.slice(from, from + 120), pin: pins.length ? pins[pins.length - 1] : null, rd: +(await r.get(`rd:${chat}:${peerOf(chat, c.uid)}`)) || 0 };
};
A['/updates'] = async (c, b, q) => {
  const after = +q.after || 0;
  const v = +(await r.get('ver')) || 0;
  const mem = after < v ? await r.zrange('uf:' + c.uid, after + 1, '+inf', { byScore: true }) : [];
  const items = [], seen = new Set(), metas = {};
  for (const x of mem) {
    const [chat, id] = String(x).split('|');
    if (seen.has(String(x)) || !can(c.uid, chat)) continue;
    seen.add(String(x));
    const rd = +(await r.get(`rd:${chat}:${peerOf(chat, c.uid)}`)) || 0;
    if (id === '0') { items.push({ chat, rd }); continue; }
    metas[chat] = metas[chat] || (await getM(c.uid, chat));
    const m = await r.hget('mh:' + chat, id);
    items.push({ chat, rd, msg: vis(m, c.uid, metas[chat].clr) ? m : { id: +id, gone: true } });
  }
  return { v, items };
};
A['/open'] = async (c, b) => ({ chat: pairId(c.uid, String(b.peerId)) });
A['/send'] = (c, b) => send(c.uid, b);
A['/read'] = (c, b) => markRead(c.uid, b.chat);
A['/edit'] = async (c, b) => {
  const m = await getMsg(c, b);
  if (!m || m.from !== c.uid || m.dead) return { err: 'cannot edit' };
  m.text = String(b.text || '').slice(0, 4000); m.edited = true;
  const nmed = cleanMedia(b.media); if (nmed) m.media = nmed;
  if (!m.text && !m.media) return { err: 'empty' };
  await bump(b.chat, m);
  return { ok: true, msg: m };
};
A['/delete'] = async (c, b) => {
  const m = await getMsg(c, b);
  if (!m) return { err: 'not found' };
  if (b.both) m.dead = true; else m.del = [...new Set([...(m.del || []), c.uid])];
  await bump(b.chat, m);
  return { ok: true };
};
A['/pin'] = async (c, b) => {
  const m = await getMsg(c, b);
  if (!m) return { err: 'not found' };
  const us = b.both ? parts(b.chat) : [c.uid];
  m.pin = b.un ? (m.pin || []).filter(x => !us.includes(x)) : [...new Set([...(m.pin || []), ...us])];
  await bump(b.chat, m);
  return { ok: true };
};
A['/react'] = async (c, b) => {
  const m = await getMsg(c, b);
  if (!m) return { err: 'not found' };
  m.react = m.react || {};
  if (m.react[c.uid] === b.emoji) delete m.react[c.uid]; else m.react[c.uid] = String(b.emoji).slice(0, 16);
  await bump(b.chat, m);
  return { ok: true, msg: m };
};
A['/chat/mute'] = async (c, b) => {
  if (!can(c.uid, b.chat)) return { err: 'Chat mismatch. Go back and open the chat again.' };
  const m = await getM(c.uid, b.chat); m.mute = +b.until || 0;
  await setM(c.uid, b.chat, m);
  return { ok: true };
};
A['/chat/clear'] = async (c, b) => {
  if (!can(c.uid, b.chat)) return { err: 'Chat mismatch. Go back and open the chat again.' };
  for (const u of b.both ? parts(b.chat) : [c.uid]) { const m = await getM(u, b.chat); m.clr = now(); await setM(u, b.chat, m); if (u !== c.uid) await touch(u, b.chat); }
  return { ok: true };
};
A['/chat/delete'] = async (c, b) => {
  if (!can(c.uid, b.chat)) return { err: 'Chat mismatch. Go back and open the chat again.' };
  for (const u of b.both ? parts(b.chat) : [c.uid]) {
    const m = await getM(u, b.chat); m.clr = now(); await setM(u, b.chat, m);
    if (b.chat[0] !== 's') await r.zrem('ul:' + u, b.chat);
    if (u !== c.uid) await touch(u, b.chat);
  }
  return { ok: true };
};
A['/search'] = async (c, b, q) => {
  const s = String(q.q || '').trim().toLowerCase();
  if (!s) return { msgs: [], users: [], chats: [] };
  const scan = async chat => {
    const meta = await getM(c.uid, chat);
    return Object.values(await allMsgs(chat)).filter(m => vis(m, c.uid, meta.clr) && (m.text || '').toLowerCase().includes(s)).sort((a, b) => b.id - a.id);
  };
  if (q.chat) return can(c.uid, q.chat) ? { msgs: (await scan(q.chat)).slice(0, 50) } : { err: 'forbidden' };
  const users = [];
  const uid2 = await r.get('uname:' + s.replace(/^@/, ''));
  if (uid2 != null) users.push(await pub(await r.get('user:' + String(uid2)), c.uid));
  const ids = (await r.zrange('ul:' + c.uid, 0, -1, { rev: true })).map(String).slice(0, 40);
  const chats = [];
  for (const chat of ids) { const f = await scan(chat); if (f.length) chats.push({ chat, n: f.length, snippet: f[0].text }); }
  return { users: users.filter(Boolean), chats };
};

A['/block'] = async (c, b) => { await (b.block ? r.sadd('bl:' + c.uid, String(b.peer)) : r.srem('bl:' + c.uid, String(b.peer))); return { ok: true }; };
A['/blocked'] = async c => {
  const ids = await r.smembers('bl:' + c.uid);
  return { users: (await Promise.all(ids.map(async i => pub(await r.get('user:' + i), c.uid)))).filter(Boolean) };
};
A['/contact'] = async (c, b) => {
  if (b.del) await r.hdel('ct:' + c.uid, String(b.peer));
  else await r.hset('ct:' + c.uid, { [String(b.peer)]: String(b.name || '').slice(0, 40) });
  return { ok: true };
};

const kind = b => (b.kind === 'pass' ? 'pass' : 'two');
A['/sec/set'] = async (c, b) => {
  const u = await r.get('user:' + c.uid), k = kind(b);
  if (u.sec && u.sec[k] && hs(b.current || '', c.uid) !== u.sec[k]) return { err: 'Current value is wrong' };
  if (String(b.value || '').length < 4) return { err: 'Minimum 4 characters' };
  u.sec = u.sec || {}; u.sec[k] = hs(b.value, c.uid);
  await r.set('user:' + c.uid, u);
  return { ok: true };
};
A['/sec/remove'] = async (c, b) => {
  const u = await r.get('user:' + c.uid), k = kind(b);
  if (!u.sec || !u.sec[k] || hs(b.value || '', c.uid) !== u.sec[k]) return { err: 'Wrong value' };
  delete u.sec[k]; await r.set('user:' + c.uid, u);
  return { ok: true };
};
A['/sec/verify'] = async (c, b) => {
  const u = await r.get('user:' + c.uid), k = kind(b);
  return { ok: !!(u.sec && u.sec[k] && hs(b.value || '', c.uid) === u.sec[k]) };
};
A['/devices'] = async c => {
  const u = await r.get('user:' + c.uid), ttl = u.autoOut || 15552e6, out = [];
  for (const sid of await r.smembers('us:' + c.uid)) {
    const s = await r.get('sess:' + sid);
    if (s && now() - (s.last || s.ts) <= ttl) out.push({ id: sid, ua: s.ua, ts: s.ts, last: s.last || s.ts, current: sid === c.sid });
    else { await r.del('sess:' + sid); await r.srem('us:' + c.uid, sid); }
  }
  return { devices: out };
};
A['/devices/ttl'] = async (c, b) => {
  if (![6048e5, 2592e6, 7776e6, 15552e6, 31536e6].includes(+b.ms)) return { err: 'invalid' };
  const u = await r.get('user:' + c.uid); u.autoOut = +b.ms; await r.set('user:' + c.uid, u);
  return { me: own(u) };
};
A['/auth/qr-approve'] = async (c, b) => {
  const o = await r.get('qr:' + b.id);
  if (!o || o.st !== 'wait') return { err: 'QR code expired. Refresh it on the new device.' };
  if (!b.confirm) return { ua: o.ua };
  o.st = 'ok'; o.uid = c.uid; await r.set('qr:' + b.id, o, { ex: 60 });
  return { ok: true };
};
A['/me/email-start'] = async (c, b) => {
  const ne = String(b.email || '').trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(ne)) return { err: 'Invalid email' };
  if (await r.get('email:' + ne)) return { err: 'Email already used' };
  await r.set('ne:' + c.uid, ne, { ex: 600 });
  return (await sendCode(await r.get('user:' + c.uid), 'email', 'Email change')) ? { ok: true } : { err: 'Could not send code' };
};
A['/me/email-confirm'] = async (c, b) => {
  const ne = await r.get('ne:' + c.uid);
  if (!ne || !(await checkCode(c.uid, 'email', b.code))) return { err: 'Wrong or expired code' };
  const u = await r.get('user:' + c.uid);
  await r.del('email:' + u.email); await r.set('email:' + ne, c.uid); u.email = ne;
  await r.set('user:' + c.uid, u);
  return { me: own(u) };
};
A['/devices/logout'] = async (c, b) => {
  if (!(await r.sismember('us:' + c.uid, b.id))) return { err: 'not found' };
  await r.del('sess:' + b.id); await r.srem('us:' + c.uid, b.id);
  return { ok: true };
};
A['/auth/logout'] = async c => { await r.del('sess:' + c.sid); await r.srem('us:' + c.uid, c.sid); return { ok: true }; };
A['/account/delete-start'] = async c => {
  const u = await r.get('user:' + c.uid);
  if (!(u.sec && (u.sec.two || u.sec.pass))) return { err: 'setup2fa' };
  return (await sendCode(u, 'del', 'Account deletion')) ? { ok: true, need: { two: !!u.sec.two, pass: !!u.sec.pass } } : { err: 'Could not send code' };
};
A['/account/delete-confirm'] = async (c, b) => {
  const u = await r.get('user:' + c.uid);
  if (!(await checkCode(c.uid, 'del', b.code))) return { err: 'Wrong or expired code' };
  if (u.sec.two && hs(b.two || '', c.uid) !== u.sec.two) return { err: 'Wrong two-step password' };
  if (u.sec.pass && hs(b.pass || '', c.uid) !== u.sec.pass) return { err: 'Wrong passcode' };
  for (const sid of await r.smembers('us:' + c.uid)) await r.del('sess:' + sid);
  await r.del('user:' + c.uid, 'uname:' + u.username.toLowerCase(), 'email:' + u.email, 'us:' + c.uid, 'fcm:' + c.uid, 'ct:' + c.uid, 'bl:' + c.uid, 'ul:' + c.uid, 'uf:' + c.uid, 'otp:' + c.uid);
  return { ok: true };
};

A['/push/register'] = async (c, b) => { if (b.fcmToken) await r.sadd('fcm:' + c.uid, b.fcmToken); return { ok: true }; };
A['/push/unregister'] = async (c, b) => { if (b.fcmToken) await r.srem('fcm:' + c.uid, b.fcmToken); return { ok: true }; };
A['/notif/action'] = async (c, b) => {
  if (b.action === 'reply' && b.text) return send(c.uid, { chat: b.chat, text: b.text });
  if (b.action === 'read') return markRead(c.uid, b.chat);
  if (b.action === 'mute' && can(c.uid, b.chat)) { const m = await getM(c.uid, b.chat); m.mute = +b.until || now() + 3600000; await setM(c.uid, b.chat, m); return { ok: true }; }
  return { err: 'bad action' };
};

A['/fb/token'] = async c => {
  const a = fb();
  if (!a) return { err: 'Firebase not configured on server' };
  try { return { token: await a.auth().createCustomToken(c.uid) }; } catch (e) { console.error('fb token', e.message); return { err: e.message }; }
};
A['/push/test'] = async c => {
  const a = fb(), toks = await r.smembers('fcm:' + c.uid);
  if (!a) return { err: 'Server Firebase not configured: ' + (fbErr || 'FIREBASE_SERVICE_ACCOUNT env missing') };
  if (!toks.length) return { err: 'No push token saved for this account. Tap "Enable notifications" on this device first.' };
  const out = await a.messaging().sendEachForMulticast({ tokens: toks, data: { title: 'MS Chat', body: 'Test notification: push is working', chatId: 's:' + c.uid, msgId: '0', ts: String(now()) }, webpush: { headers: { Urgency: 'high' } } });
  return { ok: out.successCount, failed: out.failureCount, codes: out.responses.filter(x => !x.success).map(x => x.error && x.error.code) };
};

A['/put'] = async (c, b, q) => {
  if (!Buffer.isBuffer(b)) return { err: 'No file received' };
  if (b.length > 4.4 * 1048576) return { err: 'File too big for this route' };
  try {
    const { put } = await import('@vercel/blob');
    const name = String(q.name || 'file').replace(/[^\w.\-]/g, '_').slice(-80);
    const x = await put(`f/${c.uid}/${name}`, b, { access: 'public', addRandomSuffix: true, contentType: String(q.type || 'application/octet-stream'), token: blobToken() });
    return { url: x.url };
  } catch (e) { console.error('put', e.message); return { err: e.message }; }
};

const blobToken = () => process.env.BLOB_READ_WRITE_TOKEN || (Object.entries(process.env).find(([k, v]) => /READ_WRITE_TOKEN$/.test(k) || String(v).startsWith('vercel_blob_rw_')) || [])[1];
const blobEnvNames = () => Object.keys(process.env).filter(k => /BLOB|READ_WRITE/i.test(k));
async function upload(req, res, body) {
  try {
    const { handleUpload } = await import('@vercel/blob/client');
    const j = await handleUpload({
      body, request: req, token: blobToken(),
      onBeforeGenerateToken: async (pathname, payload) => {
        if (!payload || !(await r.get('sess:' + payload))) throw new Error('unauthorized');
        return { maximumSizeInBytes: 70 * 1048576, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {}
    });
    return res.status(200).json(j);
  } catch (e) { console.error('upload', e.message); return res.status(400).json({ error: e.message }); }
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const p = req.url.split('?')[0].replace(/^\/api/, '').replace(/\/+$/, '') || '/';
  const q = req.query || {};
  const b = (req.body && typeof req.body === 'object' && req.body) || {};
  try {
    if (p === '/health') return res.json({ ok: true, db: !!(await r.ping().catch(() => 0)), blob: !!(blobToken() || process.env.BLOB_STORE_ID), blobEnv: blobEnvNames(), firebase: !!process.env.FIREBASE_SERVICE_ACCOUNT, emailjs: !!(process.env.EMAILJS_PUBLIC_KEY || process.env.EMAIL_JS_PUBLIC_KEY) });
    if (p === '/upload') return upload(req, res, b);
    if (open[p]) return res.json(await open[p](req, b));
    const c = await auth(req);
    if (!c) return res.status(401).json({ err: 'unauthorized' });
    if (!A[p]) return res.status(404).json({ err: 'not found' });
    return res.json(await A[p](c, b, q, req));
  } catch (e) {
    console.error(p, e);
    return res.status(500).json({ err: 'Server error' });
  }
};
