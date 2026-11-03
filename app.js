const $=s=>document.querySelector(s),E=encodeURIComponent;
const D=(k,d)=>{try{return JSON.parse(localStorage[k])||d}catch(e){return d}};
const S={
  ac:D('ms_a',[]),
  ai:+localStorage.ms_ai||0,
  ch:[],
  ms:[],
  cur:null,
  v:0,
  me:null,
  pin:null,
  pr:0,
  pgs:[],
  st:D('ms_s',{fs:16,wp:0,wu:'',t:'dark'}),
  sel:new Set(), // Multi-select mode ke liye
  recSearches:D('ms_rec_s',[]) // Recent search history
};

const sv=()=>{
  localStorage.ms_a=JSON.stringify(S.ac);
  localStorage.ms_ai=S.ai;
  localStorage.ms_s=JSON.stringify(S.st);
  localStorage.ms_rec_s=JSON.stringify(S.recSearches);
};

// Date Formatting Function for Chat Date Badges
function formatDateHeader(ts) {
  const d = new Date(ts);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startYest = new Date(startToday);
  startYest.setDate(startYest.getDate() - 1);

  if (d >= startToday) return 'Today';
  if (d >= startYest) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

/* ---------- Search View System ---------- */
Act.gs=()=>{
  const s=$('#sb');
  s.hidden=!s.hidden;
  if(s.hidden){
    $('#q').value='';
    cl2();
  } else {
    $('#q').focus();
    renderSearchDefaultView();
  }
};

function renderSearchDefaultView() {
  // Top 21 Frequent Users
  const topUsers = S.ch.slice(0, 21);
  const topHtml = topUsers.length ? `
    <div style="padding:10px 0; border-bottom:1px solid var(--bd);">
      <small style="padding:0 14px; opacity:0.7; font-weight:600;">FREQUENT CHATS</small>
      <div style="display:flex; gap:12px; overflow-x:auto; padding:10px 14px; scrollbar-width:none;">
        ${topUsers.map(c=>`
          <div data-a="open" data-c="${c.chat}" style="display:flex; flex-direction:column; align-items:center; min-width:62px; text-align:center; cursor:pointer;">
            ${av(c.peer, 52, c.saved)}
            <small class="sn" style="width:62px; font-size:11px; margin-top:4px;">${esc(ct(c))}</small>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Recent Searches View
  const recHtml = `
    <div style="padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
      <small style="opacity:0.7; font-weight:600;">RECENT SEARCHES</small>
      ${S.recSearches.length ? `<span data-a="clr_rec" style="color:#ff5b5b; font-size:12px; cursor:pointer; font-weight:600;">Clear All</span>` : ''}
    </div>
    <div>
      ${S.recSearches.length ? S.recSearches.map((u, i)=>`
        <div class="row" data-a="ou" data-u="${esc(u.username)}">
          ${av(u, 44)}
          <div class="fx">
            <b>${nm(u.name)}</b><br><small>@${esc(u.username)}</small>
          </div>
          <button class="ib" data-a="del_rec" data-i="${i}" style="width:30px;height:30px;">${ic('close')}</button>
        </div>
      `).join('') : '<p style="text-align:center; padding:20px; opacity:0.5;">No recent searches</p>'}
    </div>
  `;

  $('#cl').innerHTML = topHtml + recHtml;
}

Act.clr_rec=()=>{
  S.recSearches=[];
  sv();
  renderSearchDefaultView();
};

Act.del_rec=(el, e)=>{
  e.stopPropagation();
  const idx = +el.dataset.i;
  S.recSearches.splice(idx, 1);
  sv();
  renderSearchDefaultView();
};

let st1;
function lsearch(v){
  clearTimeout(st1);
  st1=setTimeout(async()=>{
    if(!v.trim()) return renderSearchDefaultView();
    const j=await api('/search?q='+E(v));
    $('#cl').innerHTML=(j.users||[]).map(u=>`
      <div class="row" data-a="select_user" data-u="${esc(u.username)}" data-json="${E(JSON.stringify(u))}">
        ${av(u)}
        <div class="fx"><b>${nm(u.name)}</b><br><small>@${esc(u.username)}</small></div>
      </div>
    `).join('')+(j.chats||[]).map(x=>{
      const c=S.ch.find(y=>y.chat===x.chat);
      return c?`<div class="row" data-a="open" data-c="${x.chat}">${av(c.peer,46,c.saved)}<div class="fx"><b>${nm(ct(c))}</b><div class="sn">${rich(mask(x.snippet))}</div></div></div>`:'';
    }).join('')||'<p style="text-align:center;padding:24px;opacity:.6">No results</p>';
  },300);
}

Act.select_user=(el)=>{
  try {
    const user = JSON.parse(decodeURIComponent(el.dataset.json));
    S.recSearches = [user, ...S.recSearches.filter(x=>x.id!==user.id)].slice(0, 15);
    sv();
  } catch(e){}
  openUser(el.dataset.u);
};

/* ---------- Multi-Select System for Chat List ---------- */
function toggleSelectChat(chatId) {
  if (S.sel.has(chatId)) S.sel.delete(chatId);
  else S.sel.add(chatId);

  if (S.sel.size === 0) {
    cl2();
  } else {
    renderMultiSelectHeader();
    cl2();
  }
}

function renderMultiSelectHeader() {
  $('#lst').querySelector('.hd').innerHTML = `
    <button class="ib" data-a="cancel_sel">${ic('close')}</button>
    <b class="ttl fx">${S.sel.size} Selected</b>
    <button class="ib" data-a="sel_pin">${ic('pin')}</button>
    <button class="ib" data-a="sel_mute">${ic('mute')}</button>
    <button class="ib" data-a="sel_read">${ic('ok')}</button>
    <button class="ib" data-a="sel_del">${ic('del')}</button>
    <button class="ib" data-a="sel_menu">${ic('more')}</button>
  `;
}

function restoreListHeader() {
  S.sel.clear();
  $('#lst').querySelector('.hd').innerHTML = `
    <button class="ib" data-a="drawer">${ic('menu')}</button>
    <b class="ttl fx">MS Chat</b>
    <button class="ib" data-a="gs">${ic('search')}</button>
  `;
  cl2();
}

Act.cancel_sel = restoreListHeader;

const row=(c,i)=>{
  const isSelected = S.sel.has(c.chat);
  return `
    <div class="row${RA?' ra':''}${isSelected?' sel-active':''}" style="--i:${Math.min(i,12)}; ${isSelected?'background:var(--bd);':''}" data-a="${S.sel.size?'toggle_sel':'open'}" data-c="${c.chat}">
      ${isSelected ? `<span class="tile" style="width:50px;height:50px;border-radius:50%;">${ic('ok')}</span>` : avo(c.peer,50,c.saved)}
      <div class="fx">
        <div class="r1">
          <b class="sn">${nm(ct(c))}${vt(c.peer)}</b>
          <small style="display:flex;gap:5px;align-items:center">${c.last&&c.last.from===S.me.id&&!c.saved?si(c.last.id<=(c.rd||0)?'read':'unread'):''}${c.last?tm(c.last.ts):''}</small>
        </div>
        <div class="r1">
          <span class="sn">${rich(prev(c.last))}</span>
          <span style="display:flex;gap:6px;align-items:center">${c.mute?ic('mute'):''}${c.unread?`<i class="bd">${c.unread}</i>`:''}</span>
        </div>
      </div>
    </div>
  `;
};

Act.toggle_sel = (el) => {
  toggleSelectChat(el.dataset.c);
};

// Batch Actions for Selected Chats
Act.sel_pin = async () => {
  for (let id of S.sel) {
    await api('/chat/pin', { chat: id });
  }
  toast('Chats updated');
  restoreListHeader();
  loadChats();
};

Act.sel_mute = async () => {
  for (let id of S.sel) {
    await api('/chat/mute', { chat: id, until: -1 });
  }
  toast('Chats muted');
  restoreListHeader();
  loadChats();
};

Act.sel_read = async () => {
  for (let id of S.sel) {
    await api('/read', { chat: id });
  }
  toast('Marked as read');
  restoreListHeader();
  loadChats();
};

Act.sel_del = async () => {
  const r = await dlg({ t: `Delete ${S.sel.size} chats?`, cb: 'Also delete for recipient', ok: 'Delete', red: 1 });
  if (r.ok) {
    for (let id of S.sel) {
      await api('/chat/delete', { chat: id, both: r.cb });
    }
    toast('Chats deleted');
    restoreListHeader();
    loadChats();
  }
};

Act.sel_menu = () => {
  sheet(`
    ${it('ok', 'Select All Chats', 'sel_all')}
    ${it('del', 'Clear History', 'sel_clear')}
    ${it('block', 'Block User(s)', 'sel_block', 1)}
  `);
};

Act.sel_all = () => {
  S.ch.forEach(c => S.sel.add(c.chat));
  renderMultiSelectHeader();
  cl2();
};

Act.sel_clear = async () => {
  const r = await dlg({ t: 'Clear history for selected chats?', cb: 'Also delete for recipient', ok: 'Clear', red: 1 });
  if (r.ok) {
    for (let id of S.sel) {
      await api('/chat/clear', { chat: id, both: r.cb });
    }
    toast('History cleared');
    restoreListHeader();
    loadChats();
  }
};

Act.sel_block = async () => {
  const r = await dlg({ t: 'Block selected users?', ok: 'Block', red: 1 });
  if (r.ok) {
    for (let id of S.sel) {
      const c = S.ch.find(x => x.chat === id);
      if (c && c.peer) await api('/block', { peer: c.peer.id, block: true });
    }
    toast('Users blocked');
    restoreListHeader();
    loadChats();
  }
};

/* ---------- Messages with Date Separators ---------- */
function drawMs(){
  const el=$('#ms');
  if(!el)return;
  const nb=el.scrollHeight-el.scrollTop-el.clientHeight<140;
  el.style.background=wp();

  let html = '';
  let lastDateStr = '';

  S.ms.forEach(m => {
    const dStr = formatDateHeader(m.ts);
    if (dStr !== lastDateStr) {
      html += `<div style="text-align:center; margin:12px 0;"><span class="badge" style="padding:4px 14px; font-size:12px; font-weight:600; opacity:0.85;">${dStr}</span></div>`;
      lastDateStr = dStr;
    }
    html += mh(m);
  });

  el.innerHTML = html || '<p style="margin:auto;opacity:.6">No messages yet</p>';
  S.ms.forEach(x=>S.sn&&S.sn.add(x.id));
  apUi();
  if(nb||S.sb)el.scrollTop=el.scrollHeight;

  const pl=S.ms.filter(x=>(x.pin||[]).includes(S.me.id)).pop(),p=pl||(S.pin0&&!S.ms.some(x=>x.id===S.pin0.id)?S.pin0:null);
  $('#pn').hidden=!p;
  if(p)$('#pn').innerHTML=`<div class="row badge" data-a="goto" data-i="${p.id}" style="border-radius:0">${ic('pin')}<div class="sn">${rich(mask(p.text||'['+(p.media&&p.media.type)+']'))}</div></div>`;
}
