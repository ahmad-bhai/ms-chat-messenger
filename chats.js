/* MS Chat - chats.js : chat-list selection (pin/mute/read/delete/block), search home, date separators */
const _dz=x=>new Date(x.getFullYear(),x.getMonth(),x.getDate()).getTime();
const _df=ts=>Math.round((_dz(new Date())-_dz(new Date(ts)))/864e5);
const dlabel=ts=>{const d=new Date(ts),df=_df(ts),n=new Date();return df<=0?'Today':df===1?'Yesterday':df<7?d.toLocaleDateString([],{weekday:'long'}):d.toLocaleDateString([],d.getFullYear()===n.getFullYear()?{day:'numeric',month:'long'}:{day:'numeric',month:'long',year:'numeric'})};
const dsep=(p,m)=>!p||new Date(p.ts).toDateString()!==new Date(m.ts).toDateString()?`<div class="dsep"><span>${dlabel(m.ts)}</span></div>`:'';
const ltime=ts=>{const d=new Date(ts),df=_df(ts),n=new Date();return df<=0?tm(ts):df===1?'Yesterday':df<7?d.toLocaleDateString([],{weekday:'short'}):d.toLocaleDateString([],d.getFullYear()===n.getFullYear()?{day:'numeric',month:'short'}:{day:'2-digit',month:'2-digit',year:'2-digit'})};

/* ---------- flags (pin / forced-unread) merged into the chat list ---------- */
function applyFlags(fl){const f=(fl&&fl.flags)||{};S.ch.forEach(c=>{const x=f[c.chat]||{};c.pin=x.pin||0;c.unr=!!x.unr});S.ch.sort((a,b)=>(b.pin?1:0)-(a.pin?1:0)||(b.pin-a.pin));[...SEL].forEach(id=>{if(!S.ch.some(c=>c.chat===id))SEL.delete(id)})}
const selCs=()=>[...SEL].map(id=>S.ch.find(c=>c.chat===id)).filter(Boolean);
function lhd(){if(!SEL.size)return `<button class="ib" data-a="drawer">${ic('menu')}</button><b class="ttl fx">MS Chat</b><button class="ib" data-a="gs">${ic('search')}</button>`;
 const cs=selCs(),anyUn=cs.some(c=>c.unread||c.unr);
 return `<button class="ib" data-a="selx">${ic('close')}</button><b class="ttl fx">${SEL.size}</b><button class="ib" data-a="selpin" title="Pin / Unpin">${ic('pin')}</button><button class="ib" data-a="selmute" title="Mute / Unmute">${ic('mute')}</button><button class="ib" data-a="selread" title="${anyUn?'Mark as read':'Mark as unread'}">${ic(anyUn?'ok':'mail')}</button><button class="ib" data-a="seldel" title="Delete">${ic('del')}</button><button class="ib" data-a="selmore">${ic('more')}</button>`}
function selUi(){const h=$('#lhd');if(h)h.innerHTML=lhd();cl2()}
function selToggle(id){SEL.has(id)?SEL.delete(id):SEL.add(id);selUi()}
function selStart(id){const sb=$('#sb');if(sb&&!sb.hidden){sb.hidden=true;$('#q').value=''}SEL.add(id);selUi();if(navigator.vibrate)navigator.vibrate(15)}
async function selDone(msg){SEL.clear();await loadChats();selUi();msg&&toast(msg)}
Act.selx=()=>{SEL.clear();selUi()};
Act.selall=()=>{S.ch.forEach(c=>SEL.add(c.chat));selUi()};
Act.selpin=async()=>{const cs=selCs(),un=cs.every(c=>c.pin);const j=await api('/chat/flag',{chats:cs.map(c=>c.chat),pin:!un});if(j.err)return toast(esc(j.err+' (add the server routes)'));selDone(un?'Unpinned':'Pinned')};
Act.selmute=async()=>{const cs=selCs();if(cs.every(c=>c.mute)){await Promise.all(cs.map(c=>api('/chat/mute',{chat:c.chat,until:0})));return selDone('Notifications enabled')}
 const r=await dlg({t:'Mute',o:['Disable sound','Mute for 1 hour','Mute for 8 hours','Mute for 2 days','Mute forever']});if(r.i<0)return;const n=Date.now(),u=[-2,n+36e5,n+8*36e5,n+48*36e5,-1][r.i];await Promise.all(cs.map(c=>api('/chat/mute',{chat:c.chat,until:u})));selDone(r.i===0?'Sound disabled':'Muted')};
Act.selread=async()=>{const cs=selCs(),ids=cs.map(c=>c.chat),any=cs.some(c=>c.unread||c.unr);
 if(any){await Promise.all(ids.map(chat=>api('/read',{chat})));await api('/chat/flag',{chats:ids,unr:false});return selDone('Marked as read')}
 const j=await api('/chat/flag',{chats:ids,unr:true});if(j.err)return toast(esc(j.err+' (add the server routes)'));selDone('Marked as unread')};
Act.seldel=async()=>{const cs=selCs(),n=cs.length,one=n===1?cs[0]:null,priv=cs.some(c=>!c.saved);
 const r=await dlg({t:one?`Delete chat with ${nm(ct(one))}?`:`Delete ${n} chats?`,p:'Messages will be removed from your list.',cb:priv?(one?`also delete for ${nm(ct(one))}`:'also delete for everyone'):'',ok:'Delete',red:1});if(!r.ok)return;
 await Promise.all(cs.map(c=>api('/chat/delete',{chat:c.chat,both:c.saved?false:r.cb})));selDone('Deleted')};
Act.selmore=()=>{const bl=selCs().filter(c=>!c.saved&&!c.peer.sys),all=bl.length&&bl.every(c=>c.blocked);sheet(it('ok','Select all','selall')+it('del','Clear chat','selclr')+(bl.length?it('block',all?'Unblock user':'Block user','selblk',!all):''))};
Act.selclr=async()=>{const cs=selCs(),r=await dlg({t:cs.length>1?`Clear ${cs.length} chats?`:'Clear chat?',cb:cs.some(c=>!c.saved)?'also delete for others':'',ok:'Clear',red:1});if(!r.ok)return;await Promise.all(cs.map(c=>api('/chat/clear',{chat:c.chat,both:c.saved?false:r.cb})));selDone('Cleared')};
Act.selblk=async()=>{const bl=selCs().filter(c=>!c.saved&&!c.peer.sys),un=bl.every(c=>c.blocked),r=await dlg({t:un?'Unblock user?':`Are you sure want block ${bl.length===1?nm(ct(bl[0])):bl.length+' users'}`,ok:un?'Unblock':'Block',red:!un});if(!r.ok)return;await Promise.all(bl.map(c=>api('/block',{peer:c.peer.id,block:!un})));selDone(un?'Unblocked':'Blocked')};

/* long-press (touch) / right-click (desktop) starts selection, Esc cancels */
let lp3,lx,ly;
document.addEventListener('pointerdown',e=>{const r=e.target.closest&&e.target.closest('#cl .row[data-c]');if(!r||e.button>0)return;clearTimeout(lp3);lx=e.clientX;ly=e.clientY;lp3=setTimeout(()=>{S.ls=Date.now();SEL.has(r.dataset.c)?0:selStart(r.dataset.c)},450)});
addEventListener('pointermove',e=>{if(Math.abs(e.clientX-lx)+Math.abs(e.clientY-ly)>14)clearTimeout(lp3)},true);
['pointerup','pointercancel','scroll'].forEach(t=>addEventListener(t,()=>clearTimeout(lp3),true));
document.addEventListener('click',e=>{if(S.ls&&Date.now()-S.ls<700){S.ls=0;e.stopPropagation();e.preventDefault()}},true);
document.addEventListener('contextmenu',e=>{const r=e.target.closest&&e.target.closest('#cl .row[data-c]');if(!r)return;e.preventDefault();if(matchMedia('(hover:hover)').matches)selToggle(r.dataset.c)});
addEventListener('keydown',e=>{if(e.key==='Escape'&&SEL.size)Act.selx()});

/* ---------- search: top people (max 21) + recent searches ---------- */
const RK=()=>'ms_rs_'+(S.me&&S.me.id);
const rsGet=()=>{try{return JSON.parse(localStorage[RK()]||'[]')}catch(e){return[]}};
function rsAdd(u){if(!u||!u.id||u.sys)return;const l=rsGet().filter(x=>x.id!==u.id);l.unshift({id:u.id,name:u.name,username:u.username,avatar:u.avatar||''});localStorage[RK()]=JSON.stringify(l.slice(0,20))}
function drawRecent(){const el=$('#rec');if(!el)return;const l=rsGet();el.innerHTML=l.length?`<div class="sh2"><span>Recent</span><b class="lnk2" data-a="rsclr">Clear</b></div>`+l.map(u=>`<div class="row" data-a="ou" data-u="${esc(u.username)}">${av(u)}<div class="fx"><b>${nm(u.name)}</b><br><small>@${esc(u.username)}</small></div><button class="ib" data-a="rsdel" data-i="${u.id}">${ic('close')}</button></div>`).join(''):'<p class="hint">Search people by @username</p>'}
Act.rsclr=()=>{localStorage[RK()]='[]';drawRecent()};
Act.rsdel=el=>{localStorage[RK()]=JSON.stringify(rsGet().filter(x=>x.id!==el.dataset.i));drawRecent()};
async function srchHome(){const box=$('#cl');if(!box)return;box.innerHTML='<div id="top"></div><div id="rec"></div>';drawRecent();
 let ids=S.topc&&Date.now()-S.topc.t<6e4?S.topc.v:null;
 if(!ids){const j=await api('/top');ids=(j.top||[]).map(x=>x.chat);if(!ids.length)ids=S.ch.map(c=>c.chat);ids=ids.filter(id=>{const c=S.ch.find(x=>x.chat===id);return c&&!c.saved&&!c.peer.sys}).slice(0,21);S.topc={t:Date.now(),v:ids}}
 const el=$('#top');if(!el||$('#q').value)return;const cs=ids.map(id=>S.ch.find(c=>c.chat===id)).filter(Boolean);
 el.innerHTML=cs.length?`<div class="sh2"><span>People</span></div><div class="tops">${cs.map(c=>`<div data-a="open" data-c="${c.chat}">${avo(c.peer,56)}<span class="sn">${nm((c.cn||c.peer.name).split(' ')[0])}</span></div>`).join('')}</div>`:''}
Act.gs=()=>{const s=$('#sb');s.hidden=!s.hidden;if(s.hidden){$('#q').value='';cl2()}else{$('#q').focus();srchHome()}};
S.su={};
function lsearch(v){clearTimeout(st1);st1=setTimeout(async()=>{if(!v.trim())return srchHome();const q=v.trim().toLowerCase().replace(/^@/,'');
 const loc=S.ch.filter(c=>!c.saved&&(ct(c).toLowerCase().includes(q)||(c.peer.username||'').toLowerCase().includes(q)));
 const j=await api('/search?q='+E(v));if($('#q').value.trim()!==v.trim())return;(j.users||[]).forEach(u=>S.su[u.username]=u);
 const seen=new Set(loc.map(c=>c.peer.id)),us=(j.users||[]).filter(u=>!seen.has(u.id));
 $('#cl').innerHTML=loc.map(c=>`<div class="row" data-a="open" data-c="${c.chat}">${avo(c.peer,46)}<div class="fx"><b>${nm(ct(c))}</b><br><small>@${esc(c.peer.username)}</small></div></div>`).join('')+us.map(u=>`<div class="row" data-a="ou" data-u="${esc(u.username)}">${av(u)}<div class="fx"><b>${nm(u.name)}</b><br><small>@${esc(u.username)}</small></div></div>`).join('')+(j.chats||[]).map(x=>{const c=S.ch.find(y=>y.chat===x.chat);return c?`<div class="row" data-a="open" data-c="${x.chat}">${av(c.peer,46,c.saved)}<div class="fx"><b>${nm(ct(c))}</b><div class="sn">${rich(mask(x.snippet))}</div></div></div>`:''}).join('')||'<p style="text-align:center;padding:24px;opacity:.6">No results</p>'},300)}
const _ou=Act.ou;
Act.ou=el=>{const u=S.su[el.dataset.u]||rsGet().find(x=>x.username===el.dataset.u);if(u)rsAdd(u);_ou(el)};
Act.open=el=>{if(SEL.size)return selToggle(el.dataset.c);const c=S.ch.find(x=>x.chat===el.dataset.c);if(!c)return;if(!c.saved&&!c.peer.sys&&$('#sb')&&!$('#sb').hidden)rsAdd(c.peer);openC(c)};
