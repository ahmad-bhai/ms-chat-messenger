/* MS Chat - media.js : in-app downloads, media/DP viewer, shared media, font menu, audio session */
Object.assign(I,{
 dl:'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
 share:'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z',
 eye:'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'});
const fz=n=>n>1048576?(n/1048576).toFixed(1)+' MB':n>1024?Math.round(n/1024)+' KB':(n||0)+' B';
const fext=n=>((n||'').split('.').pop()||'').toUpperCase().slice(0,5);
const fdt=ts=>{const d=new Date(ts),n=new Date(),t=d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});return d.toDateString()===n.toDateString()?'today at '+t:d.toLocaleDateString([],{month:'short',day:'numeric'})+' at '+t};

/* ---------- in-app download cache (Cache Storage) ---------- */
const MC='ms-media-v1';S.dc=new Set();S.dp={};
(async()=>{try{(await(await caches.open(MC)).keys()).forEach(r=>S.dc.add(r.url))}catch(e){}})();
async function dlGet(url,onp,ctl){
 const c=await caches.open(MC),hit=await c.match(url);if(hit)return hit.blob();
 const r=await fetch(url,{signal:ctl&&ctl.signal});if(!r.ok)throw new Error('HTTP '+r.status);
 const tot=+r.headers.get('content-length')||0,rd=r.body.getReader(),ch=[];let got=0;
 for(;;){const {done,value}=await rd.read();if(done)break;ch.push(value);got+=value.length;onp&&onp(tot?Math.min(99,Math.round(got/tot*100)):0,got)}
 const b=new Blob(ch,{type:r.headers.get('content-type')||''});
 try{await c.put(url,new Response(b,{headers:{'content-type':b.type}}));S.dc.add(url);navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
 return b}
function fileB(m,x,u){const url=x.url,p=S.dp[url],done=S.dc.has(url)||x.local;
 return `<div class="fl" data-a="fdl" data-i="${m.id}" data-u="${u}" data-s="${x.size||0}"><span class="fbt${p?' ing':''}" style="--p:${p?p.pct:0}">${p?ic('close'):done?ic('file'):ic('dl')}</span><div class="fx"><div class="fn">${esc(x.name||'file')}</div><small>${p?fz(p.got||0)+' / '+fz(x.size):fz(x.size)+' '+fext(x.name)}</small></div></div>`}
function fdUi(url){document.querySelectorAll('.fl').forEach(f=>{const p=S.dp[url];if(f.dataset.u!==url||!p)return;f.querySelector('.fbt').style.setProperty('--p',p.pct);f.querySelector('small').textContent=fz(p.got)+' / '+fz(+f.dataset.s)})}
Act.fdl=async el=>{const m=S.ms.find(x=>x.id==el.dataset.i);if(!m||!m.media||m.pend)return;const url=m.media.url;
 if(S.dp[url]){S.dp[url].ctl.abort();delete S.dp[url];return drawMs()}
 if(!S.dc.has(url)){const ctl=new AbortController();S.dp[url]={pct:0,got:0,ctl};drawMs();
  try{await dlGet(url,(p,g)=>{if(S.dp[url]){S.dp[url].pct=p;S.dp[url].got=g;fdUi(url)}},ctl)}
  catch(e){delete S.dp[url];drawMs();if(e.name!=='AbortError'){toast('Download blocked by Storage CORS, see README. Opening in browser');window.open(url,'_blank')}return}
  delete S.dp[url];drawMs()}
 openFile(m)};
async function openFile(m){const x=m.media;let b;try{b=await dlGet(x.url)}catch(e){return toast('Open failed')}
 const u=URL.createObjectURL(b),ty=b.type||'',ex=(x.name||'').split('.').pop().toLowerCase();let body;
 if(ty.startsWith('image/'))body=`<img src="${u}">`;else if(ty.startsWith('video/'))body=`<video src="${u}" controls autoplay playsinline></video>`;else if(ty.startsWith('audio/'))body=`<audio src="${u}" controls autoplay></audio>`;
 else if(ty==='application/pdf'||ex==='pdf')body=`<iframe src="${u}" style="width:100%;height:100%;border:0;background:#fff"></iframe>`;
 else if(ty.startsWith('text/')||['txt','json','md','csv','js','css','html','log','xml','py'].includes(ex))body='<pre class="pv" id="pv"></pre>';
 else body=`<div class="hint" style="margin:auto">${ic('file')}<p>No preview for this file type.<br>Use Save or Share.</p></div>`;
 S.vi=[{url:x.url,name:x.name,type:'file'}];S.vx=0;let d=$('#vw');if(d)d.remove();d=document.createElement('div');d.id='vw';d.className='vw';document.body.appendChild(d);d.onclick=vwClick;
 d.innerHTML=`<div class="vh"><button class="ib" data-v="x">${ic('back')}</button><div class="fx"><b class="sn">${esc(x.name||'file')}</b><small>${fz(x.size)}</small></div><button class="ib" data-v="save">${ic('dl')}</button><button class="ib" data-v="share">${ic('share')}</button><button class="ib" data-v="rm">${ic('del')}</button></div><div class="vb" id="vb">${body}</div>`;
 if(ty.startsWith('text/')||$('#pv'))try{$('#pv').textContent=await b.slice(0,200000).text()}catch(e){}}

/* ---------- media viewer (photos, videos, profile photos) ---------- */
const msgItem=m=>({url:m.media.url,type:m.media.type,title:m.from===S.me.id?S.me.name:(S.cur?S.cur.peer.name:''),sub:fdt(m.ts),cap:m.text,name:m.media.name,m});
function vwOpen(items,i){S.vi=items;S.vx=i;S.vz=0;let d=$('#vw');if(d)d.remove();d=document.createElement('div');d.id='vw';d.className='vw';document.body.appendChild(d);d.onclick=vwClick;vwDraw();document.addEventListener('keydown',vwKey)}
function vwClose(){const d=$('#vw');if(d)d.remove();document.removeEventListener('keydown',vwKey)}
const vwKey=e=>{if(e.key==='Escape')vwClose();else if(e.key==='ArrowRight')vwGo(1);else if(e.key==='ArrowLeft')vwGo(-1)};
function vwGo(n){const k=S.vx+n;if(k<0||k>=S.vi.length)return;S.vx=k;S.vz=0;vwDraw()}
function vwDraw(){const d=$('#vw');if(!d)return;const it=S.vi[S.vx],v=it.type==='video';
 d.innerHTML=`<div class="vh"><button class="ib" data-v="x">${ic('back')}</button><div class="fx"><b class="sn">${nm(it.title||'')}</b><small>${esc(it.sub||'')}</small></div>${it.m?`<button class="ib" data-v="fw">${ic('fwd')}</button>`:''}<button class="ib" data-v="more">${ic('more')}</button></div><div class="vb${S.vz?' z':''}" id="vb">${v?`<video src="${esc(it.url)}" controls autoplay playsinline></video>`:`<img src="${esc(it.url)}" alt="">`}</div>${S.vi.length>1?`<div class="vc"><span>${S.vx+1} of ${S.vi.length}</span></div>`:''}${it.cap?`<div class="vcap">${rich(it.cap)}</div>`:''}`;
 const vb=$('#vb');let tx=0,lt=0;vb.ontouchstart=e=>{tx=e.touches[0].clientX};vb.ontouchend=e=>{const dx=e.changedTouches[0].clientX-tx;if(!S.vz&&Math.abs(dx)>70)vwGo(dx<0?1:-1)};
 if(!v)vb.onclick=()=>{const t=Date.now();if(t-lt<300){S.vz=!S.vz;vb.classList.toggle('z',S.vz)}lt=t}}
async function itemBlob(it){try{return await dlGet(it.url)}catch(e){return null}}
async function saveItem(it){toast('Saving…');const b=await itemBlob(it);if(!b){window.open(it.url,'_blank');return toast('Opened in browser (allow Storage CORS to save in-app)')}
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=it.name||('MSChat-'+Date.now()+(it.type==='video'?'.mp4':'.jpg'));document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Saved')}
async function shareItem(it){const b=await itemBlob(it);try{const f=b&&new File([b],it.name||'file',{type:b.type});if(f&&navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f]});else if(navigator.share)await navigator.share({url:it.url});else{await navigator.clipboard.writeText(it.url);toast('Link copied')}}catch(e){}}
function vwClick(e){const mn=$('#vm'),b=e.target.closest('[data-v]');if(mn&&!e.target.closest('#vm'))mn.remove();if(!b)return;const k=b.dataset.v,it=S.vi[S.vx];
 if(k==='more'){if(mn)return;const mi=(a,i,t,r)=>`<div data-v="${a}" class="${r?'red':''}">${ic(i)}${t}</div>`;$('#vw').insertAdjacentHTML('beforeend',`<div id="vm" class="vm">${mi('save','dl','Save to Gallery')}${it.m?mi('all','img','Show All Media')+mi('chat','eye','Show in chat')+mi('reply','reply','Reply'):''}${mi('share','share','Share')}${it.m&&it.m.from===S.me.id?mi('del','del','Delete',1):''}</div>`);return}
 if(mn)mn.remove();
 if(k==='x')return vwClose();
 if(k==='save')return saveItem(it);
 if(k==='share')return shareItem(it);
 if(k==='rm'){caches.open(MC).then(c=>c.delete(it.url));S.dc.delete(it.url);vwClose();drawMs();return toast('Removed from device')}
 if(k==='fw'){S.sm=it.m;vwClose();return Act.fw()}
 if(k==='all'){vwClose();return Act.allmedia()}
 if(k==='chat'){vwClose();return Act.goto({dataset:{i:it.m.id}})}
 if(k==='reply'){vwClose();S.rep=it.m;S.edit=null;bar();const i=$('#inp');i&&i.focus();return}
 if(k==='del'){S.sm=it.m;vwClose();return Act.dl()}}
const vwList=id=>{const l=S.ms.filter(m=>m.media&&(m.media.type==='image'||m.media.type==='video')).map(msgItem);return[l,Math.max(0,l.findIndex(x=>String(x.m.id)===String(id)))]};
Act.view=el=>{const mEl=el.closest('.m'),[l,i]=vwList(mEl?mEl.dataset.i:null);if(l.length)vwOpen(l,i)};
Act.gview=el=>{$('#pg').hidden=true;S.pgs=[];const [l,i]=vwList(el.dataset.i);if(l.length)vwOpen(l,i)};
Act.gjump=el=>{$('#pg').hidden=true;S.pgs=[];Act.goto({dataset:{i:el.dataset.i}})};
Act.olink=el=>window.open(el.dataset.u,'_blank');

/* ---------- profile photo viewer (tap in profile, long-press anywhere) ---------- */
function dpView(url,name){if(!url)return toast('No profile photo');vwOpen([{url,type:'image',title:name||'',sub:'Profile photo',name:'profile.jpg'}],0)}
let lpT;document.addEventListener('pointerdown',e=>{const a=e.target.closest&&e.target.closest('img.av[data-dp]');if(!a||a.closest('#cl'))return;clearTimeout(lpT);lpT=setTimeout(()=>{S.lp=Date.now();dpView(a.dataset.dp,a.dataset.nm)},450)});
['pointerup','pointercancel','pointermove','scroll'].forEach(t=>addEventListener(t,()=>clearTimeout(lpT),true));
document.addEventListener('click',e=>{if(S.lp&&Date.now()-S.lp<700){S.lp=0;e.stopPropagation();e.preventDefault();return}const a=e.target.closest&&e.target.closest('#pg img.av[data-dp]');if(a){e.stopPropagation();dpView(a.dataset.dp,a.dataset.nm)}},true);

/* ---------- shared media (Media / Files / Links / Voice) ---------- */
const SH={media:m=>m.media&&['image','video'].includes(m.media.type),files:m=>m.media&&['file','audio'].includes(m.media.type),voice:m=>m.media&&m.media.type==='voice',links:m=>/https?:\/\/\S+/.test(m.text||'')};
function shHtml(k){const l=S.ms.filter(SH[k]).reverse();if(!l.length)return '<p class="hint">Nothing here yet</p>';
 if(k==='media')return `<div class="gr">${l.map(m=>`<div class="gi" data-a="gview" data-i="${m.id}">${m.media.type==='image'?`<img src="${esc(m.media.url)}" loading="lazy">`:`<video src="${esc(m.media.url)}#t=0.1" preload="metadata" muted></video><span class="pbig">${ic('play')}</span>`}</div>`).join('')}</div>`;
 if(k==='links')return l.map(m=>[...m.text.matchAll(/https?:\/\/\S+/g)].map(x=>`<div class="row" data-a="olink" data-u="${esc(x[0])}">${tl('clip')}<div class="fx"><div class="sn">${esc(x[0])}</div><small>${tm(m.ts)}</small></div></div>`).join('')).join('');
 return l.map(m=>`<div class="row" data-a="gjump" data-i="${m.id}">${tl(k==='voice'?'mic':'file')}<div class="fx"><div class="sn">${esc(m.media.name||lbl(m.media))}</div><small>${fz(m.media.size)} · ${tm(m.ts)}</small></div></div>`).join('')}
const shTabs=(k='media')=>`<div class="tabs" id="tabs">${['media','files','links','voice'].map(t=>`<span class="${t===k?'on':''}" data-a="stab" data-k="${t}">${t[0].toUpperCase()+t.slice(1)}</span>`).join('')}</div><div id="shc">${shHtml(k)}</div>`;
Act.stab=el=>{document.querySelectorAll('#tabs span').forEach(s=>s.classList.toggle('on',s===el));$('#shc').innerHTML=shHtml(el.dataset.k)};
Act.allmedia=()=>page('Shared media',shTabs());

/* ---------- Telegram-style fonts menu (after the three dots) ---------- */
const _ftDraw=ftDraw;
ftDraw=function(m){if(m!=='menu')return _ftDraw(m);const f=$('#ft');if(!f)return;f.dataset.m='menu';f.hidden=false;
 const it=(k,t,st)=>`<button class="fi2" data-a="fmt" data-k="${k}" style="${st||''}">${t}</button>`;
 f.innerHTML=`<div class="fpop">${it('p','Spoiler')}${it('b','Bold','font-weight:800')}${it('i','Italic','font-style:italic')}${it('m','Mono','font-family:monospace')}${it('s','Strikethrough','text-decoration:line-through')}${it('u','Underline','text-decoration:underline')}<hr><button class="fi2" data-a="fback">${ic('back')}<span>Back</span></button></div>`};
Act.fmore=()=>ftDraw('menu');Act.fback=()=>ftDraw('sel');

/* ---------- audio keeps playing in background + lock-screen controls ---------- */
if('mediaSession' in navigator){
 AP.a.addEventListener('play',()=>{const m=S.ms.find(x=>String(x.id)===String(AP.id)),x=m&&m.media;
  navigator.mediaSession.metadata=new MediaMetadata({title:x?(x.type==='voice'?'Voice message':(x.name||'Audio')):'Audio',artist:m?(m.from===S.me.id?S.me.name:(S.cur?S.cur.peer.name:'MS Chat')):'MS Chat',album:'MS Chat',artwork:[{src:'/icon-512.png',sizes:'512x512',type:'image/png'}]})});
 const ms=(a,f)=>{try{navigator.mediaSession.setActionHandler(a,f)}catch(e){}};
 ms('play',()=>AP.a.play());ms('pause',()=>AP.a.pause());ms('stop',()=>{AP.a.pause();AP.a.currentTime=0});
 ms('seekbackward',()=>{AP.a.currentTime=Math.max(0,AP.a.currentTime-10)});ms('seekforward',()=>{AP.a.currentTime=Math.min(AP.a.duration||1e9,AP.a.currentTime+10)})}
