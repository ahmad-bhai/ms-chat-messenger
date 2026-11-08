// MS Chat - Open Source Frontend (FINAL FIXED)
const API_BASE = 'https://server-ms-chat.vercel.app/api';
const $=s=>document.querySelector(s),E=encodeURIComponent;
const D=(k,d)=>{try{return JSON.parse(localStorage[k])||d}catch(e){return d}};
const S={ac:D('ms_a',[]),ai:+localStorage.ms_ai||0,ch:[],ms:[],cur:null,v:0,me:null,pin:null,pr:0,pgs:[],st:D('ms_s',{fs:16,wp:0,wu:'',t:'dark'})};
const sv=()=>{localStorage.ms_a=JSON.stringify(S.ac);localStorage.ms_ai=S.ai;localStorage.ms_s=JSON.stringify(S.st)};
const I={moon:'M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 01-4.4 2.26 5.4 5.4 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z',quote:'M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z',bld:'M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.1 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z',ita:'M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z',mono:'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',str:'M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z',und:'M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z',spo:'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2z',pend:'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z',crop:'M17 15h2V7c0-1.1-.9-2-2-2H9v2h8v8zM7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2H7z',rotate:'M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z',brush:'M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a.996.996 0 00-1.41 0L9 12.25 11.75 15l8.96-8.96a.996.996 0 000-1.41z',undo:'M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z',play:'M8 5v14l11-7z',pause:'M6 19h4V5H6v14zm8-14v14h4V5h-4z',anim:'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',qr:'M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2zM17 17h2v2h-2zM19 19h2v2h-2z',menu:'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',more:'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',back:'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',search:'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',send:'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z',clip:'M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z',mic:'M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z',close:'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',ok:'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',edit:'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',del:'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',reply:'M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z',fwd:'M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z',pin:'M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z',copy:'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',mute:'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zM3.3 2L2 3.3 20.7 22 22 20.7z',person:'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',set:'M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z',sun:'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z',bm:'M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z',add:'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',block:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9A7.9 7.9 0 014 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1A7.9 7.9 0 0120 12c0 4.42-3.58 8-8 8z',lock:'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',cam:'M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z',file:'M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z',logout:'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',up:'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z',dev:'M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z',img:'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',home:'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',mail:'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',info:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'};
const ic=n=>`<svg class="i" viewBox="0 0 24 24"><path d="${I[n]}"/></svg>`,tl=n=>`<span class="tile">${ic(n)}</span>`;
const EMS='(\\p{Extended_Pictographic}(?:\\uFE0F|\\u200D\\p{Extended_Pictographic}|\\p{Emoji_Modifier})*|[\\u{1F1E6}-\\u{1F1FF}]{2})';
const EM=new RegExp(EMS,'gu'),BIG=new RegExp('^'+EMS+'$','u');
const eu=e=>API_BASE+'/emoji?name='+E(e);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nm=s=>esc(s).replace(EM,e=>`<img class="em" src="${eu(e)}" alt="${e}">`);
const fm=s=>s.replace(/(?<=^|\n)&gt; ?([^\n]*)\n?/g,'<blockquote>$1</blockquote>').replace(/`([^`\n]+)`/g,'<code>$1</code>').replace(/\*\*([\s\S]+?)\*\*/g,'<b>$1</b>').replace(/__([\s\S]+?)__/g,'<i>$1</i>').replace(/~~([\s\S]+?)~~/g,'<s>$1</s>').replace(/\+\+([\s\S]+?)\+\+/g,'<u>$1</u>').replace(/\|\|([\s\S]+?)\|\|/g,'<span class="spo" data-a="spo">$1</span>');
S.rv=new Set();const hk=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return h};
const spo2=s=>s.replace(/<span class="spo" data-a="spo">([\s\S]*?)<\/span>/g,(_,x)=>{const k=hk(x),on=S.rv.has(k),n=Math.max(1,x.replace(/<img[^>]*>/g,'x').replace(/<[^>]+>/g,'').length);return `<span class="spo" data-a="spo" data-k="${k}"><span class="sh"${on?' hidden':''}>${'\u2591'.repeat(n)}</span><span class="sv"${on?'':' hidden'}>${x}</span></span>`});
const mask=t=>String(t||'').replace(/\|\|([\s\S]+?)\|\|/g,(_,x)=>'\u2591'.repeat([...x].length));
const uni=t=>{const m=(s,a,A,d)=>[...s].map(c=>{const x=c.charCodeAt(0);return x>=65&&x<=90?String.fromCodePoint(A+x-65):x>=97&&x<=122?String.fromCodePoint(a+x-97):d&&x>=48&&x<=57?String.fromCodePoint(d+x-48):c}).join('');return mask(t).replace(/\*\*([\s\S]+?)\*\*/g,(_,x)=>m(x,0x1D5EE,0x1D5D4,0x1D7EC)).replace(/__([\s\S]+?)__/g,(_,x)=>m(x,0x1D622,0x1D608)).replace(/`([^`\n]+)`/g,(_,x)=>m(x,0x1D68A,0x1D670,0x1D7F6)).replace(/~~([\s\S]+?)~~/g,(_,x)=>[...x].map(c=>c+'\u0336').join('')).replace(/\+\+([\s\S]+?)\+\+/g,(_,x)=>[...x].map(c=>c+'\u0332').join('')).replace(/(^|\n)> ?/g,'$1\u275D ')};
const strip=t=>String(t||'').replace(/\*\*|__|~~|\+\+|\|\||`/g,'');
const rich=s=>spo2(fm(nm(s))).replace(/@(\w{3,32})/g,'<a class="ul" data-a="ou" data-u="$1">@$1</a>');
const tm=t=>new Date(t).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
const stat=u=>u.status&&u.status.startsWith('ts:')?'last seen at '+tm(+u.status.slice(3)):u.status||'';
const ct=c=>c.saved?'Saved Messages':c.cn||c.peer.name;
const vt=u=>u&&u.verified?'<svg class="i" style="width:17px;height:17px;color:#3da5ff;vertical-align:-3px;margin-left:4px" viewBox="0 0 24 24"><path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"/></svg>':'';
const setMr=()=>document.documentElement.style.setProperty('--mr',(S.st.mr==null?22:S.st.mr)+'px');
const ANS=[0,.1,.5,.7,1],ANL=['Off','10%','50%','70%','100%'];
const setAn=()=>{const v=S.st.an==null?4:S.st.an;document.documentElement.style.setProperty('--an',ANS[v]);document.documentElement.dataset.an=ANS[v]};
const RE=[...'❤️👍👎🔥🥰👏😁🤔🤯😱🤬😢🎉🤩🤮💩🙏👌🕊️🤡🥱😍❤️‍🔥💯🤣⚡🏆💔💋😈😴😭😇🤝🤗🫡🆒💘😘🙈🙊🙉😎😡'.matchAll(EM)].map(m=>m[0]);
const WP=['url("/bg/1.svg") center/cover','url("/bg/2.svg") center/cover','url("/bg/3.svg") center/cover','url("/bg/4.svg") center/cover','url("/bg/5.svg") center/cover'];
const wp=()=>S.st.wu?`url("${S.st.wu}") center/cover`:WP[S.st.wp];
const av=(u,z=46,saved)=>saved?`<span class="av" style="width:${z}px;height:${z}px;background:#2b7fc7">${ic('bm')}</span>`:u.avatar?`<img class="av" style="width:${z}px;height:${z}px" src="${esc(u.avatar)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="av" style="display:none;width:${z}px;height:${z}px;background:hsl(${[...u.id].reduce((a,c)=>a+c.charCodeAt(0),0)*37%360},55%,45%)">${esc(ini(u.name))}</span>`:`<span class="av" style="width:${z}px;height:${z}px;background:hsl(${[...u.id].reduce((a,c)=>a+c.charCodeAt(0),0)*37%360},55%,45%)">${esc(ini(u.name))}</span>`;
const avo=(u,z,sv)=>`<span class="avw">${av(u,z,sv)}${!sv&&u.status==='online'&&!u.sys?'<i class="od"></i>':''}</span>`;
const TH=()=>S.st.t==='dark'?'white':'black';
const si=(n,c)=>`<img class="si" data-n="${n}" src="/app/${c||TH()}-${n}.svg" alt="" onerror="siFix(this)">`;
function siFix(el){const n=el.dataset.n,m={read:()=>ic('ok')+ic('ok'),unread:()=>ic('ok'),pending:()=>ic('pend'),bold:()=>ic('bld'),italic:()=>ic('ita'),mono:()=>ic('mono'),strikethrough:()=>ic('str'),underline:()=>ic('und'),spoiler:()=>ic('spo'),sun:()=>ic('sun'),moon:()=>ic('moon')},w=document.createElement('span');w.className='sf';w.innerHTML=(m[n]||m.unread)();el.replaceWith(w)}
const ini=n=>Array.from(n||'?').find(ch=>/[\p{L}\p{N}]/u.test(ch))||'?';
const rw=(i,t,s,a)=>`<div class="row" ${a?`data-a="${a}"`:''}>${tl(i)}<div class="fx"><div>${t}</div>${s?`<small>${s}</small>`:''}</div></div>`;
const it=(i,t,a,red)=>`<div class="it${red?' red':''}" data-a="${a}">${ic(i)}${t}</div>`;
let tt;const toast=t=>{$('#ts').innerHTML=`<div class="tt">${t}</div>`;clearTimeout(tt);tt=setTimeout(()=>$('#ts').innerHTML='',2600)};

// ================= api() with retry & token check =================
async function api(p, b, retry = 0) {
  const token = (S.ac[S.ai] || {}).token;
  if (!token || token === 'undefined') {
    console.warn('No token for API call:', p);
    return { err: 'Please login again' };
  }
  try {
    const r = await fetch(API_BASE + p, {
      method: b ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: b ? JSON.stringify(b) : undefined
    });
    if (r.status === 401) {
      if (retry === 0 && S.me) {
        await new Promise(res => setTimeout(res, 500));
        return api(p, b, 1);
      }
      if (S.me) localLogout();
      return {};
    }
    return r.json().catch(() => ({}));
  } catch (e) {
    if (retry === 0) {
      await new Promise(res => setTimeout(res, 1000));
      return api(p, b, 1);
    }
    return { err: e.message };
  }
}
const ok=j=>{if(j.err){toast(esc(j.err));return false}return true};
function dlg(o){return new Promise(res=>{const d=$('#dlg');d.innerHTML=`<div class="ov"><div class="badge bx"><h3>${o.t}</h3>${o.p?`<p>${o.p}</p>`:''}${o.in?`<input id="di" class="inp" type="${o.ty||'text'}" placeholder="${o.in}" value="${esc(o.v||'')}">`:''}${o.cb?`<label class="cb"><input type="checkbox" id="dc">${o.cb}</label>`:''}${(o.o||[]).map((x,i)=>`<button class="op" data-i="${i}">${x}</button>`).join('')}<div class="bt">${o.nc?'':'<button data-i="-1">Cancel</button>'}${o.ok?`<button class="${o.red?'rd':''}" data-i="-2">${o.ok}</button>`:''}</div></div></div>`;d.onclick=e=>{const b=e.target.closest('button'),bg=e.target.classList.contains('ov');if(!b&&!bg)return;const i=b?+b.dataset.i:-1,v=$('#di')&&$('#di').value,cb=!!($('#dc')&&$('#dc').checked);d.innerHTML='';res({ok:i===-2,i:i>=0?i:-1,cb,v})};const x=$('#di');x&&x.focus()})}
const ask=async(t,ph='Password',ty='password')=>{const r=await dlg({t,in:ph,ty,ok:'OK'});return r.ok&&r.v?r.v:null};
const sheet=h=>{$('#sh').innerHTML=`<div class="sheet badge">${h}</div>`;$('#sh').hidden=false};
const closeSh=()=>{$('#sh').hidden=true};
const Act={};
document.addEventListener('click',e=>{if(e.target.id==='sh'){closeSh();return}if(e.target.id==='dr'){$('#dr').hidden=true;return}const el=e.target.closest('[data-a]');if(!el)return;if(el.closest('#sh'))closeSh();if(el.closest('#dr'))$('#dr').hidden=true;const f=Act[el.dataset.a];f&&f(el,e)});

/* ---------- auth ---------- */
const fld=(i,ph,id,ty)=>`<label class="badge row fld">${tl(i)}<input id="${id}" type="${ty||'text'}" placeholder="${ph}" class="fi" autocomplete="off"></label>`;
const blobs='<div class="goo"><i class="gb" style="width:220px;height:220px;left:-60px;top:40px"></i><i class="gb" style="width:260px;height:260px;right:-90px;top:230px;animation-delay:-3s"></i><i class="gb" style="width:200px;height:200px;left:30%;bottom:-70px;animation-delay:-6s"></i></div>';
function authScr(add){document.body.classList.remove('inl');let step='home',em='',pend='',needCode=0,viaMode='email',qt,R={};
const fin=j=>{if(!j.token)return;clearInterval(qt);const i=S.ac.findIndex(a=>a.id===j.me.id);if(i>=0)S.ac[i].token=j.token;else S.ac.push({token:j.token,id:j.me.id,name:j.me.name});S.ai=i>=0?i:S.ac.length-1;sv();boot()};
const body=()=>({home:`<button class="btn" data-s="email">${ic('mail')} Login with email</button><button class="btn alt" data-s="qr">${ic('qr')} Login with QR</button><p class="lnk" data-s="reg">Create new account</p>`,
email:fld('mail','Email','ae','email')+'<button class="btn" id="go">Send code</button>',
code:`<p class="hint">Enter the 6-digit verification code sent to <b>${viaMode==='chat'?'MS SPAM CHAT on your logged-in devices':'your email ('+esc(em)+')'}</b></p>`+fld('lock','6-digit code','ac','tel')+'<button class="btn" id="go">Continue</button>',
'2fa':'<p class="hint">Two-step verification is on</p>'+fld('lock','Password','ap','password')+'<button class="btn" id="go">Login</button><p class="lnk" id="fg">Forgot password?</p>',
fgc:'<p class="hint">Recovery code sent to your email</p>'+fld('lock','Email code','ac','tel')+'<button class="btn" id="go">Reset and login</button>',
reg:fld('person','Name','an')+fld('mail','Email','ae','email')+fld('person','Username (optional)','au')+(needCode?fld('lock','Email code','ac','tel'):'')+`<button class="btn" id="go">${needCode?'Verify':'Create account'}</button>`,
qr:'<div class="qrb"><div id="qrc"></div></div><p class="hint">On your logged-in phone open Settings → Privacy and security → Devices → Add Device, then scan this code</p>'}[step]);
const draw=()=>{clearInterval(qt);$('#app').innerHTML=`<div class="scr" style="overflow:auto">${blobs}<div class="au"><button class="ib" id="bk" ${step==='home'&&!add?'hidden':''}>${ic('back')}</button><img class="logo" src="/icon-512.png" alt="MS Chat"><h1>MS Chat</h1>${body()}</div></div>`;
$('#bk').onclick=()=>{if(step==='home')boot();else{step='home';draw()}};
document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{step=b.dataset.s;draw()});
Object.entries(R).forEach(([k,v])=>{const e=$('#'+k);if(e)e.value=v});
const g=$('#go');if(g)g.onclick=go;const f=$('#fg');if(f)f.onclick=forgot;if(step==='qr')qr();const fi=document.querySelector('.au input');fi&&fi.focus()};
const go=async()=>{const v=id=>($('#'+id)||{}).value||'';let j;
if(step==='email'){j=await api('/auth/login-start',{email:v('ae')});if(!ok(j))return;em=v('ae').trim();viaMode=j.via||'email';step='code';draw();toast(viaMode==='email'?'Code sent to your email':'Code sent to MS SPAM CHAT on your logged-in devices')}
else if(step==='code'){j=await api('/auth/login-verify',{email:em,code:v('ac')});if(!ok(j))return;if(j.need2fa){pend=j.pend;step='2fa';draw()}else fin(j)}
else if(step==='2fa'){j=await api('/auth/login-2fa',{pend,two:v('ap')});if(ok(j))fin(j)}
else if(step==='fgc'){j=await api('/auth/forgot-confirm',{pend,code:v('ac')});if(ok(j))fin(j)}
else if(step==='reg'){R={an:v('an'),ae:v('ae'),au:v('au')};j=await api('/auth/register',{name:R.an,email:R.ae,username:R.au,code:v('ac')});if(!ok(j))return;if(j.needCode){needCode=1;draw();toast('Verification code sent to your email')}else fin(j)}};
const forgot=async()=>{const j=await api('/auth/forgot',{pend});if(ok(j)){step='fgc';draw()}};
async function qr(){const j=await api('/auth/qr-create',{});if(!j.id)return;const el=$('#qrc');if(window.QRCode)new QRCode(el,{text:location.origin+'/?qr='+j.id,width:210,height:210,colorDark:'#2b0a4d',colorLight:'#ffffff'});else el.textContent=j.id;
qt=setInterval(async()=>{const x=await api('/auth/qr-status',{id:j.id,secret:j.secret});if(x.token)fin(x);else if(x.need2fa){clearInterval(qt);pend=x.pend;step='2fa';draw()}else if(x.err){clearInterval(qt);toast('QR expired, try again');step='home';draw()}},2000)}
draw()}
async function scanQR(){if(!('BarcodeDetector' in window))return ask('Paste the code shown on the new device','Code','text');const d=$('#dlg');d.innerHTML='<div class="ov" style="flex-direction:column;gap:14px"><video id="qv" autoplay playsinline muted style="width:100%;max-width:360px;border-radius:32px"></video><button class="btn alt" id="qx" style="max-width:360px">Cancel</button></div>';d.onclick=null;let st;try{st=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}})}catch(e){d.innerHTML='';toast('Camera permission needed');return null}
const v=$('#qv');v.srcObject=st;const bd=new BarcodeDetector({formats:['qr_code']});let stop=0,val=null;$('#qx').onclick=()=>stop=1;while(!stop){try{const r=await bd.detect(v);if(r.length){val=r[0].rawValue;stop=2}}catch(e){}await new Promise(r=>setTimeout(r,250))}st.getTracks().forEach(t=>t.stop());d.innerHTML='';return val}
async function qrApprove(id){const j=await api('/auth/qr-approve',{id});if(!ok(j))return;const r=await dlg({t:'Log in new device?',p:esc(j.ua||'Unknown device'),ok:'Log in'});if(!r.ok)return;const k=await api('/auth/qr-approve',{id,confirm:1});if(ok(k))toast('Device logged in')}

/* ---------- boot / lists ---------- */
async function boot(){document.documentElement.dataset.t=S.st.t;document.documentElement.style.setProperty('--fs',S.st.fs+'px');setAn();setMr();if(!S.ac[S.ai])S.ai=0;if(!S.ac.length){authScr();return}
const j=await api('/me');if(!j.me)return;S.me=j.me;S.ac[S.ai].name=j.me.name;sv();
if(S.me.pass&&!sessionStorage.ul)for(;;){const r=await dlg({t:'Enter passcode',in:'Passcode',ty:'password',ok:'Unlock',nc:1});if(r.ok&&(await api('/sec/verify',{kind:'pass',value:r.v})).ok){sessionStorage.ul=1;break}}
$('#cv').hidden=$('#pg').hidden=true;S.cur=null;S.pgs=[];const c=await api('/chats');S.ch=c.chats||[];S.v=c.v||0;list();
if(!S.ni){S.ni=1;MSNotify.init({token:S.ac[S.ai].token,onOpenChat:openById,onAction:()=>loadChats()})}else MSNotify.setAuth(S.ac[S.ai].token);
if(Notification.permission==='granted')MSNotify.registerDevice();
const qp=new URLSearchParams(location.search).get('qr');if(qp){history.replaceState(0,'','/');qrApprove(qp);return}const p=location.pathname.slice(1);if(p&&!p.includes('.'))openUser(p)}
async function loadChats(){const j=await api('/chats');if(j.chats){S.ch=j.chats;MSNotify.setBadge(S.ch.reduce((a,c)=>a+c.unread,0));const cc=S.cur&&S.ch.find(x=>x.chat===S.cur.chat);if(cc){S.cur.peer=cc.peer;const s=$('#st');if(s&&!cc.saved)s.textContent=stat(cc.peer)}if(!S.cur)cl()}}
const prev=m=>!m?'':mask(m.media?`[${m.media.type}] ${m.text||''}`:m.text);
let RA=0;
const row=(c,i)=>`<div class="row${RA?' ra':''}" style="--i:${Math.min(i,12)}" data-a="open" data-c="${c.chat}">${avo(c.peer,50,c.saved)}<div class="fx"><div class="r1"><b class="sn">${nm(ct(c))}${vt(c.peer)}</b><small style="display:flex;gap:5px;align-items:center">${c.last&&c.last.from===S.me.id&&!c.saved?si(c.last.id<=(c.rd||0)?'read':'unread'):''}${c.last?tm(c.last.ts):''}</small></div><div class="r1"><span class="sn">${rich(prev(c.last))}</span><span style="display:flex;gap:6px;align-items:center">${c.mute?ic('mute'):''}${c.unread?`<i class="bd">${c.unread}</i>`:''}</span></div></div></div>`;
const cl=()=>{const e=$('#cl');if(e&&!$('#q').value)e.innerHTML=S.ch.map(row).join('')};
function list(){RA=1;setTimeout(()=>RA=0,80);document.body.classList.add('inl');$('#app').innerHTML=`<div class="scr" id="lst"><div class="hd"><button class="ib" data-a="drawer">${ic('menu')}</button><b class="ttl fx">MS Chat</b><button class="ib" data-a="gs">${ic('search')}</button></div><div id="sb" hidden style="padding:0 12px"><input id="q" class="inp" placeholder="Search chats and messages" oninput="lsearch(this.value)"></div>${'Notification' in window&&Notification.permission==='default'&&!localStorage.ms_noNotif?`<div class="row badge" data-a="pushon" style="margin:4px 10px">${tl('mute')}<div class="fx">Enable notifications</div></div>`:''}<div id="cl" style="overflow:auto;flex:1">${S.ch.map(row).join('')}</div></div>`}
let st1;function lsearch(v){clearTimeout(st1);st1=setTimeout(async()=>{if(!v.trim())return cl2();const j=await api('/search?q='+E(v));$('#cl').innerHTML=(j.users||[]).map(u=>`<div class="row" data-a="ou" data-u="${esc(u.username)}">${av(u)}<div class="fx"><b>${nm(u.name)}</b><br><small>@${esc(u.username)}</small></div></div>`).join('')+(j.chats||[]).map(x=>{const c=S.ch.find(y=>y.chat===x.chat);return c?`<div class="row" data-a="open" data-c="${x.chat}">${av(c.peer,46,c.saved)}<div class="fx"><b>${nm(ct(c))}</b><div class="sn">${rich(mask(x.snippet))}</div></div></div>`:''}).join('')||'<p style="text-align:center;padding:24px;opacity:.6">No results</p>'},300)}
const cl2=()=>{$('#cl').innerHTML=S.ch.map(row).join('')};
Act.gs=()=>{const s=$('#sb');s.hidden=!s.hidden;if(s.hidden){$('#q').value='';cl2()}else $('#q').focus()};
Act.pushon=async()=>{localStorage.ms_noNotif=1;await MSNotify.askStorage();if((await MSNotify.permission())==='granted'){await MSNotify.registerDevice();toast('Notifications enabled')}list()};
Act.open=el=>{const c=S.ch.find(x=>x.chat===el.dataset.c);c&&openC(c)};
Act.ou=el=>openUser(el.dataset.u);
async function openUser(n){const j=await api('/user?u='+E(n));if(!ok(j))return;const o=S.ch.find(x=>x.chat===j.chat)||{mute:0};$('#pg').hidden=true;openC({...o,chat:j.chat,peer:j.user,cn:j.cn,saved:j.self,blocked:j.blocked})}
async function openById(id,mid){let c=S.ch.find(x=>x.chat===id);if(!c){await loadChats();c=S.ch.find(x=>x.chat===id)}c&&openC(c,mid?'around':0,mid)}

/* ---------- chat ---------- */
async function openC(c,mode,mid){S.cur=c;S.ms=[];S.rep=S.edit=null;MSNotify.setActiveChat(c.chat);history.replaceState(0,'',c.saved?'/':'/'+c.peer.username);$('#cv').hidden=false;drawC();await loadMs(mode,mid);api('/read',{chat:c.chat});c.unread=0}
function drawC(){const c=S.cur;$('#cv').innerHTML=`<div class="hd badge" style="border-radius:0"><button class="ib" data-a="back">${ic('back')}</button><div class="row fx" style="padding:0" data-a="prof">${avo(c.peer,40,c.saved)}<div class="fx"><b class="sn">${nm(ct(c))}${vt(c.peer)}</b><small id="st">${c.saved?'':stat(c.peer)}</small></div></div><button class="ib" data-a="csearch">${ic('search')}</button><button class="ib" data-a="cmenu">${ic('more')}</button></div><div id="sb2" hidden style="padding:0 10px"><input id="cq" class="inp" placeholder="Search in this chat"></div><div id="pn" hidden></div><div id="ms"></div><div id="rb" hidden></div>${c.peer.sys?'':c.blocked?`<div style="text-align:center;padding:10px"><button class="btn" data-a="unblock">Unblock User</button><p data-a="addc" style="padding:12px;color:var(--sf)">${c.cn?'Edit contact':'Add contact'}</p></div>`:`<div id="ft" class="ft" hidden onmousedown="event.preventDefault()"></div><div class="cmp"><div id="rcb" class="rcb" hidden><button class="ib" data-a="rccancel">${ic('del')}</button><i class="rd"></i><b id="rct">0:00</b><span class="fx hint">Recording…</span><button class="tile" data-a="rcsend">${ic('send')}</button></div><button class="ib" data-a="attach">${ic('clip')}</button><button class="ib" data-a="fttog">${si('bold')}</button><textarea id="inp" rows="1" placeholder="Message"></textarea><button class="tile" id="sbtn" data-a="sendmic">${ic('mic')}</button></div>`}`;
const i=$('#inp');if(i){i.oninput=()=>{const w=i.value.trim()?'1':'0',b=$('#sbtn');if(b.dataset.w!==w){b.dataset.w=w;b.innerHTML=ic(w==='1'?'send':'mic')}i.style.height='auto';i.style.height=Math.min(i.scrollHeight,120)+'px'};i.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&innerWidth>700){e.preventDefault();snd()}}}
$('#cq').oninput=e=>{clearTimeout(st1);const v=e.target.value;st1=setTimeout(async()=>{if(!v.trim())return drawMs();const j=await api('/search?chat='+E(S.cur.chat)+'&q='+E(v));$('#ms').innerHTML=(j.msgs||[]).map(m=>`<div class="row" data-a="sres" data-i="${m.id}"><div class="fx"><small>${tm(m.ts)}</small><div>${rich(m.text)}</div></div></div>`).join('')||'<p style="margin:auto;opacity:.6">No results</p>'},300)}}
async function loadMs(mode,mid){const q='/msgs?chat='+E(S.cur.chat)+(mode==='first'?'&mode=first':mode==='around'?'&around='+mid:'');const j=await api(q);if(!j.msgs)return;S.ms=j.msgs;S.sn=new Set(j.msgs.map(x=>x.id));S.pin0=j.pin;S.pr=j.rd;S.sb=mode!=='first';drawMs();S.sb=0;if(mode==='first')$('#ms').scrollTop=0;if(mode==='around')Act.goto({dataset:{i:mid}})}
const tick=m=>m.pend?si('pending','white'):si(m.id<=S.pr?'read':'unread','white');
function media(m){const x=m.media;if(!x)return'';const u=esc(x.url),pr=m.pend&&m.file?`<div class="upl"><i style="width:${m.up||0}%"></i><b>${m.up||0}%</b></div>`:'';
if(x.type==='image')return `<div class="mw"><img class="md" src="${u}" data-a="view">${pr}</div>`;
if(x.type==='video')return `<div class="mw"><video class="md" controls playsinline preload="metadata" src="${u}"></video>${pr}</div>`;
if(x.type==='voice'||x.type==='audio'){const v=x.type==='voice',w=x.wave&&x.wave.length?x.wave:Array.from({length:40},(_,i)=>6+((+m.id%97)*7+i*13)%22),d=fd(x.dur);
return `<div class="vp${v?'':' au'}" data-a="vp" data-i="${m.id}" data-u="${u}" data-d="${d}"><span class="pb">${ic('play')}</span>${v?`<div class="wv">${w.map(h=>`<i style="height:${Math.max(14,h/31*100)}%"></i>`).join('')}</div>`:`<div class="fx"><div class="an">${esc(x.name||'Audio')}</div><div class="ln"><i></i></div></div>`}<small class="vt">${d}</small></div>${pr}`}
return `<a href="${u}" target="_blank" style="color:inherit;display:flex;gap:8px;align-items:center">${ic('file')}${esc(x.name||'file')}</a>${pr}`}
function mh(m){const me=m.from===S.me.id,big=!m.media&&m.text&&BIG.test(m.text.trim());const g={};Object.values(m.react||{}).forEach(e=>g[e]=(g[e]||0)+1);
return `<div class="m ${me?'me':'th'}${S.sn&&!S.sn.has(m.id)?' nw':''}" id="m${m.id}" data-a="mm" data-i="${m.id}">${m.fwd?`<small>Forwarded from ${nm(m.fwd)}</small><br>`:''}${m.reply?`<div class="rp" data-a="goto" data-i="${m.reply.id}"><b>${nm(m.reply.name)}</b><br>${rich(mask((m.reply.text||'').slice(0,80)))}</div>`:''}${media(m)}${big?rich(m.text).replace('class="em"','class="em big"'):`<span>${rich(m.text||'')}</span>`}<div class="mt"><small>${(m.pin||[]).includes(S.me.id)?ic('pin'):''}${m.edited?'edited ':''}${tm(m.ts)}</small>${me?tick(m):''}</div>${Object.keys(g).length?`<div class="rx">${Object.entries(g).map(([e,n])=>`<span data-a="rc" data-i="${m.id}" data-e="${e}"><img class="em" src="${eu(e)}">${n>1?n:''}</span>`).join('')}</div>`:''}</div>`}
function drawMs(){const el=$('#ms');if(!el)return;const nb=el.scrollHeight-el.scrollTop-el.clientHeight<140;el.style.background=wp();el.innerHTML=S.ms.map(mh).join('')||'<p style="margin:auto;opacity:.6">No messages yet</p>';S.ms.forEach(x=>S.sn&&S.sn.add(x.id));apUi();if(nb||S.sb)el.scrollTop=el.scrollHeight;
const pl=S.ms.filter(x=>(x.pin||[]).includes(S.me.id)).pop(),p=pl||(S.pin0&&!S.ms.some(x=>x.id===S.pin0.id)?S.pin0:null);$('#pn').hidden=!p;if(p)$('#pn').innerHTML=`<div class="row badge" data-a="goto" data-i="${p.id}" style="border-radius:0">${ic('pin')}<div class="sn">${rich(mask(p.text||'['+(p.media&&p.media.type)+']'))}</div></div>`}
function merge(m){const i=S.ms.findIndex(x=>x.id===m.id);if(m.gone){if(i>=0)S.ms.splice(i,1);return}if(i>=0)S.ms[i]=m;else{S.ms.push(m);S.ms.sort((a,b)=>a.id-b.id)}}
Act.goto=el=>{const e=$('#m'+el.dataset.i);if(e){e.scrollIntoView({block:'center'});e.style.outline='2px solid #C54FDA';setTimeout(()=>e.style.outline='',1500)}else loadMs('around',el.dataset.i)};
Act.sres=el=>{$('#sb2').hidden=true;$('#cq').value='';loadMs('around',el.dataset.i)};
Act.csearch=()=>{const s=$('#sb2');s.hidden=!s.hidden;if(s.hidden){$('#cq').value='';drawMs()}else $('#cq').focus()};
Act.back=()=>{if(!S.cur)return;S.cur=null;$('#cv').hidden=true;MSNotify.setActiveChat(null);history.replaceState(0,'','/');loadChats().then(list)};
onpopstate=()=>{if(!$('#pg').hidden)Act.pback();else Act.back()};
const cid=()=>S.cur.chat,sm=()=>S.sm;
async function dbl(id){const m=S.ms.find(x=>x.id==id);if(!m||m.pend||!S.cur)return;await api('/react',{chat:cid(),id:m.id,emoji:S.st.dr||'👍'});poll()}
Act.mm=el=>{const id=el.dataset.i,t=Date.now();if(S.lid===id&&t-S.lt<300){clearTimeout(S.lto);S.lid=null;dbl(id);return}S.lid=id;S.lt=t;clearTimeout(S.lto);S.lto=setTimeout(()=>{S.lid=null;mmOpen(el)},280)};
document.addEventListener('click',e=>{const ms=$('#ms');if(!ms||e.target!==ms)return;const t=Date.now();if(S.bt&&t-S.bt<300&&Math.abs(e.clientY-S.by)<40){S.bt=0;const el=[...ms.querySelectorAll('.m')].find(x=>{const r=x.getBoundingClientRect();return e.clientY>=r.top&&e.clientY<=r.bottom});el&&dbl(el.dataset.i)}else{S.bt=t;S.by=e.clientY}});
const mmOpen=el=>{const m=S.ms.find(x=>x.id==el.dataset.i);if(!m||m.pend)return;S.sm=m;const mine=m.from===S.me.id;sheet(`<div class="rr">${RE.map(e=>`<img data-a="react" data-e="${e}" src="${eu(e)}">`).join('')}</div>${it('reply','Reply','rep')}${m.text?it('copy','Copy','cp'):''}${it('fwd','Forward','fw')}${it('pin',(m.pin||[]).includes(S.me.id)?'Unpin':'Pin','pn')}${mine&&(m.text||m.media)?it('edit','Edit','ed'):''}${it('del','Delete','dl',1)}`)};
Act.react=async el=>{await api('/react',{chat:cid(),id:sm().id,emoji:el.dataset.e});poll()};
Act.rc=async el=>{await api('/react',{chat:cid(),id:+el.dataset.i,emoji:el.dataset.e});poll()};
const bar=()=>{const b=$('#rb'),m=S.edit?S.ms.find(x=>x.id===S.edit):S.rep;b.hidden=!m;if(m)b.innerHTML=`<div class="row badge" style="border-radius:0">${ic(S.edit?'edit':'reply')}<div class="fx sn">${S.edit?'Editing: ':''}${rich(mask(m.text||'['+(m.media&&m.media.type)+']'))}</div>${S.edit&&m.media?`<button class="ib" data-a="repl">${ic('img')}</button>`:''}<button class="ib" data-a="barx">${ic('close')}</button></div>`};
Act.barx=()=>{S.rep=S.edit=null;$('#inp').value='';bar()};
Act.rep=()=>{S.rep=S.sm;S.edit=null;bar();$('#inp').focus()};
Act.cp=()=>{navigator.clipboard.writeText(S.sm.text);toast('Copied')};
Act.ed=()=>{S.edit=S.sm.id;S.rep=null;$('#inp').value=S.sm.text||'';bar();$('#inp').focus()};
Act.dl=async()=>{const c=S.cur,r=await dlg({t:'Delete message?',cb:c.saved?'':`also delete for ${nm(ct(c))}`,ok:'Delete',red:1});if(r.ok){await api('/delete',{chat:cid(),id:S.sm.id,both:r.cb});poll()}};
Act.pn=async()=>{const c=S.cur,m=S.sm,un=(m.pin||[]).includes(S.me.id),r=await dlg({t:un?'Unpin message?':'Pin message?',cb:c.saved?'':`also ${un?'unpin':'pin'} for ${nm(ct(c))}`,ok:un?'Unpin':'Pin'});if(r.ok){await api('/pin',{chat:cid(),id:m.id,both:r.cb,un});poll()}};
Act.fw=async()=>{const m=S.sm,r=await dlg({t:'Forward to…',o:S.ch.map(c=>nm(ct(c)))});if(r.i<0)return;const j=await api('/send',{chat:S.ch[r.i].chat,text:m.text,media:m.media,fwd:m.from===S.me.id?S.me.name:S.cur.peer.name});toast(esc(j.err||'Forwarded'))};
const OB=[];let obn=0;
const FMK={b:['**','**'],i:['__','__'],m:['`','`'],s:['~~','~~'],u:['++','++'],p:['||','||']};
function ftDraw(m){const f=$('#ft');if(!f)return;f.dataset.m=m;f.hidden=false;f.innerHTML=m==='sel'?[['cut','Cut'],['copy','Copy'],['paste','Paste'],['quote','Quote']].map(([k,t])=>`<button class="fb" data-a="fx" data-k="${k}">${t}</button>`).join('')+`<button class="ib" data-a="fmore">${ic('more')}</button>`:[['b','bold'],['i','italic'],['m','mono'],['s','strikethrough'],['u','underline'],['p','spoiler']].map(([k,n])=>`<button class="ib" data-a="fmt" data-k="${k}">${si(n)}</button>`).join('')+`<button class="ib" data-a="fx" data-k="quote">${ic('quote')}</button>`}
const ftHide=()=>{const f=$('#ft');if(f&&!f.dataset.pin){f.hidden=true;f.dataset.m=''}};
Act.fttog=()=>{const f=$('#ft');if(f.hidden||f.dataset.m!=='fmt'||!f.dataset.pin){f.dataset.pin='1';ftDraw('fmt')}else{f.hidden=true;f.dataset.pin='';f.dataset.m=''}};
Act.fmore=()=>ftDraw('fmt');
Act.fx=async el=>{const i=$('#inp'),k=el.dataset.k,a=i.selectionStart,b=i.selectionEnd,v=i.value,sel=v.slice(a,b);const put=(t,c)=>{i.value=v.slice(0,a)+t+v.slice(b);i.focus();const p=c!=null?c:a+t.length;i.setSelectionRange(p,p);i.oninput&&i.oninput()};
if(k==='copy'){navigator.clipboard.writeText(sel);toast('Copied')}else if(k==='cut'){navigator.clipboard.writeText(sel);put('')}else if(k==='paste'){try{put(await navigator.clipboard.readText())}catch(e){toast('Paste: long-press the text box')}}else if(k==='quote'){put(sel?sel.split('\n').map(l=>l.startsWith('> ')?l:'> '+l).join('\n'):'> ')}ftHide()};
Act.fmt=el=>{const i=$('#inp'),[a,b]=FMK[el.dataset.k],st=i.selectionStart,en=i.selectionEnd,v=i.value;i.value=v.slice(0,st)+a+v.slice(st,en)+b+v.slice(en);i.focus();const c=st===en?st+a.length:en+a.length+b.length;i.setSelectionRange(c,c);i.oninput&&i.oninput();ftHide()};
document.addEventListener('selectionchange',()=>{const i=$('#inp'),f=$('#ft');if(!i||!f||document.activeElement!==i)return;if(i.selectionStart!==i.selectionEnd){if(f.hidden)ftDraw('sel')}else if(!f.dataset.pin){f.hidden=true;f.dataset.m=''}});
Act.spo=el=>{const a=el.querySelector('.sh'),b=el.querySelector('.sv');if(!a||!b)return;const k=+el.dataset.k,h=b.hidden;b.hidden=!h;a.hidden=h;h?S.rv.add(k):S.rv.delete(k)};
Act.repl=()=>{S.fm='rep';fl.accept='*/*';fl.removeAttribute('capture');fl.multiple=false;fl.click()};
const tdraw=()=>{if(S.td)return;S.td=setTimeout(()=>{S.td=0;drawMs()},250)};

// ============ SUPABASE UPLOAD LOGIC (FINAL FIXED WITH CONTENT-TYPE) ============
async function flush(){if(S.fl)return;S.fl=1;try{while(OB.length){const m=OB[0];
if(m.file){try{
  const url = await new Promise(async (resolve, reject) => {
    try {
      const filename = `${m.file.name.replace(/[^\w.\-]/g, '_')}`;
      const token = (S.ac[S.ai] || {}).token;
      if (!token || token === 'undefined') throw new Error('Session expired');
      
      const res = await fetch(`${API_BASE}/upload?name=${E(filename)}`, {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/octet-stream'  // MUST for Vercel
        },
        body: m.file
      });
      
      const data = await res.json();
      if (!res.ok || data.err) throw new Error(data.err || `HTTP ${res.status}`);
      if (!data.url) throw new Error('No URL returned');
      
      resolve(data.url);
    } catch (err) { reject(err); }
  });
  m.blob = m.media.url;
  m.media = { ...m.media, url };
  delete m.media.local;
  m.file = null; m.up = 100; m.er = 0;
} catch(e) {
  if(!m.er){m.er=1;toast(esc('Upload failed: '+(e.code||e.message||'network')))}break
}}
let j;try{j=await api('/send',{chat:m.chat,text:m.text,media:m.media,reply:m.reply})}catch(e){break}
if(!j.msg){OB.shift();S.ms=S.ms.filter(x=>x.id!==m.id);toast(esc(j.err||'Message not sent'));drawMs();continue}
OB.shift();S.ms=S.ms.filter(x=>x.id!==m.id);if(m.blob)try{URL.revokeObjectURL(m.blob)}catch(e){}if(S.cur&&S.cur.chat===m.chat){S.sn&&S.sn.add(j.msg.id);merge(j.msg)}drawMs()}}finally{S.fl=0}}
addEventListener('online',()=>flush());
async function snd(media){const i=$('#inp'),t=i.value.trim();if(!t&&!media)return;if(S.edit){const j=await api('/edit',{chat:cid(),id:S.edit,text:t,media:S.em||undefined});S.edit=null;S.em=null;ok(j)}else{const rp=S.rep&&{id:S.rep.id,name:S.rep.from===S.me.id?S.me.name:S.cur.peer.name,text:S.rep.text||'['+(S.rep.media&&S.rep.media.type)+']'};const m={id:8e15+(++obn),pend:1,chat:cid(),from:S.me.id,text:t,ts:Date.now(),media:media||null,reply:rp||null,react:{},del:[],pin:[]};S.ms.push(m);OB.push(m)}i.value='';i.oninput();S.rep=null;bar();S.sb=1;drawMs();S.sb=0;flush();poll()}
const fd=s=>isFinite(s)&&s>=0?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'';
let rec,rcT,rcS,wv=[],aC,aN;
Act.sendmic=async()=>{if($('#inp').value.trim()||S.edit)return snd();if(rec)return;if(!(await MSNotify.askMedia('mic')))return toast('Microphone permission needed');
const s=await navigator.mediaDevices.getUserMedia({audio:true});rec=new MediaRecorder(s);const chunks=[];wv=[];rec.ondataavailable=e=>chunks.push(e.data);
aN=null;try{aC=new AudioContext();aN=aC.createAnalyser();aN.fftSize=256;aC.createMediaStreamSource(s).connect(aN)}catch(e){}
const buf=new Uint8Array(128);rcS=Date.now();$('#rcb').hidden=false;$('#rct').textContent='0:00';
rcT=setInterval(()=>{$('#rct').textContent=fd((Date.now()-rcS)/1000);if(aN){aN.getByteTimeDomainData(buf);let m=0;for(const v of buf)m=Math.max(m,Math.abs(v-128));wv.push(m)}},100);
rec.onstop=()=>{s.getTracks().forEach(t=>t.stop());clearInterval(rcT);const b=$('#rcb');if(b)b.hidden=true;try{aC&&aC.close()}catch(e){}const send=rec.send,dur=(Date.now()-rcS)/1000,mt=rec.mimeType||'audio/webm';rec=null;if(!send||dur<.6)return;
const n=40,mx=Math.max(...wv,1),wave=Array.from({length:n},(_,i)=>{const a0=Math.floor(i*wv.length/n),a=wv.slice(a0,Math.max(Math.floor((i+1)*wv.length/n),a0+1));return Math.round(Math.max(...a,0)/mx*31)});
qFile(new File(chunks,'voice.'+(mt.includes('mp4')?'m4a':'webm'),{type:mt}),'','voice',{dur:Math.round(dur),wave})};rec.start()};
Act.rcsend=()=>{if(rec){rec.send=1;rec.stop()}};Act.rccancel=()=>{if(rec){rec.send=0;rec.stop()}};
const gdur=f=>new Promise(r=>{const a=new Audio(URL.createObjectURL(f)),t=setTimeout(()=>r(0),1500);a.onloadedmetadata=()=>{clearTimeout(t);r(isFinite(a.duration)?Math.round(a.duration):0)};a.onerror=()=>r(0)});
async function qFile(f,cap,type,ex){const ty=type||(f.type.startsWith('image')?'image':f.type.startsWith('video')?'video':f.type.startsWith('audio')?'audio':'file');if(f.size>5*1024**3)return toast('Max file size is 5 GB');const x={...(ex||{})};if(ty==='audio'&&!x.dur)x.dur=await gdur(f);
const rp=S.rep&&{id:S.rep.id,name:S.rep.from===S.me.id?S.me.name:S.cur.peer.name,text:S.rep.text||'['+(S.rep.media&&S.rep.media.type)+']'};S.rep=null;bar();
const m={id:8e15+(++obn),pend:1,up:0,chat:cid(),from:S.me.id,text:cap||'',ts:Date.now(),file:f,media:{url:URL.createObjectURL(f),name:f.name,size:f.size,type:ty,local:1,...x},reply:rp||null,react:{},del:[],pin:[]};S.ms.push(m);OB.push(m);S.sb=1;drawMs();S.sb=0;flush()}
const AP={a:new Audio(),id:null,on:0};
AP.a.ontimeupdate=()=>apUi();AP.a.onended=()=>{AP.a.currentTime=0;AP.on=0;apUi()};AP.a.onpause=()=>{AP.on=0;apUi()};AP.a.onplay=()=>{AP.on=1;apUi()};
function apUi(){document.querySelectorAll('.vp').forEach(el=>{const me=el.dataset.i===String(AP.id),du=AP.a.duration,p=me&&du?AP.a.currentTime/du:0,pb=el.querySelector('.pb');const want=me&&AP.on?'pause':'play';if(pb.dataset.s!==want){pb.dataset.s=want;pb.innerHTML=ic(want)}const w=el.querySelector('.wv');if(w){const n=Math.round(p*w.children.length);[...w.children].forEach((b,i)=>b.classList.toggle('pl',i<n))}const l=el.querySelector('.ln i');if(l)l.style.width=p*100+'%';const t=el.querySelector('.vt');t.textContent=me&&du&&AP.on?fd(AP.a.currentTime)+' / '+fd(du):el.dataset.d})}
Act.vp=(el,e)=>{const id=el.dataset.i;if(AP.id===id){const b=e.target.closest('.wv,.ln');if(b&&AP.a.duration){const r=b.getBoundingClientRect();AP.a.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*AP.a.duration;return}AP.a.paused?AP.a.play():AP.a.pause()}else{AP.id=id;AP.a.src=el.dataset.u;AP.a.play()}};
let FB;
async function fbInit(){if(FB&&FB.uid===S.me.id)return FB;const V='https://www.gstatic.com/firebasejs/10.12.0/';const [A,Au,St]=await Promise.all([import(V+'firebase-app.js'),import(V+'firebase-auth.js'),import(V+'firebase-storage.js')]);
const app=A.getApps().find(a=>a.name==='ms')||A.initializeApp({apiKey:'AIzaSyD7Nt1wwgGy5GxKFrc1NQvv8ulA3fDSJQE',authDomain:'ms-chat-517b8.firebaseapp.com',projectId:'ms-chat-517b8',storageBucket:'ms-chat-517b8.firebasestorage.app',appId:'1:34240289213:web:d9f18bcfa824bbac5e1ad4'},'ms');
const t=await api('/fb/token',{});if(!t.token)throw new Error(t.err||'No Firebase token');await Au.signInWithCustomToken(Au.getAuth(app),t.token);FB={uid:S.me.id,st:St.getStorage(app),St};return FB}
function fbUp(f,onp){return fbInit().then(x=>new Promise((res,rej)=>{const S2=x.St,r=S2.ref(x.st,`u/${S.me.id}/${Date.now()}-${f.name.replace(/[^\w.\-]/g,'_')}`),t=S2.uploadBytesResumable(r,f,{contentType:f.type||'application/octet-stream'});t.on('state_changed',z=>onp&&onp(Math.round(z.bytesTransferred/z.totalBytes*100)),rej,async()=>res(await S2.getDownloadURL(t.snapshot.ref)))}))}
async function upload2(f,onp){let err;try{return await fbUp(f,onp)}catch(e){err=e}if(f.size<4e6){try{const r=await fetch(API_BASE+'/put?name='+E(f.name)+'&type='+E(f.type||'application/octet-stream'),{method:'POST',headers:{'Content-Type':'application/octet-stream',Authorization:'Bearer '+S.ac[S.ai].token},body:f});const j=await r.json();if(j.url)return j.url}catch(e){}}throw err}
async function up(f,type){if(f.size>5*1024**3){toast('Max file size is 5 GB');return null}toast('Uploading…');try{const url=await upload2(f,p=>toast('Uploading '+p+'%'));return{url,name:f.name,size:f.size,type:type||(f.type.startsWith('image')?'image':f.type.startsWith('video')?'video':f.type.startsWith('audio')?'audio':'file')}}catch(e){toast(esc('Upload failed: '+(e.code||e.message)));return null}}
const fl=$('#fl');
const isMed=f=>/^(image|video)\//.test(f.type);
fl.onchange=async()=>{const fs=[...fl.files];fl.value='';fl.multiple=false;if(!fs.length)return;const w=S.fm;S.fm=0;const f=fs[0];
if(w==='wp'){const r=new FileReader();r.onload=()=>{S.st.wu=r.result;sv();toast('Wallpaper set')};r.readAsDataURL(f);return}
if(w==='av'){const r=await mediaEdit(f,{noCap:1,crop:1});if(!r)return;const m=await up(r.file,'image');if(m){const j=await api('/me/update',{avatar:m.url});if(ok(j)){S.me=j.me;toast('Photo updated');Act.mypf(1)}}return}
if(w==='rep'){let g=f;if(isMed(f)){const r=await mediaEdit(f,{noCap:1});if(!r)return;g=r.file}const m=await up(g);if(m){S.em=m;toast('Media replaced. Tap send to save')}return}
for(const x of fs){if(isMed(x)){const r=await mediaEdit(x);if(r)await qFile(r.file,r.caption)}else await qFile(x,'')}};
function mediaEdit(f,o={}){return new Promise(res=>{const isV=f.type.startsWith('video');let ed=$('#ed');if(!ed){ed=document.createElement('div');ed.id='ed';ed.className='scr';ed.style.zIndex=9;document.body.appendChild(ed)}ed.hidden=false;
const url=URL.createObjectURL(f),COL=['#ffffff','#ff3b30','#ffcc00','#34c759','#0a84ff','#000000'];
ed.innerHTML=`<div class="hd"><button class="ib" id="e_x">${ic('close')}</button><div class="fx"></div>${isV?'':`<button class="ib" id="e_cr">${ic('crop')}</button><button class="ib" id="e_ro">${ic('rotate')}</button><button class="ib" id="e_br">${ic('brush')}</button><button class="ib" id="e_un">${ic('undo')}</button>`}</div><div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:8px">${isV?'<video id="e_v" controls playsinline style="max-width:100%;max-height:100%;border-radius:20px"></video>':'<div id="e_w" style="position:relative;line-height:0"><canvas id="e_c" style="max-width:calc(100vw - 16px);max-height:calc(100dvh - 260px);touch-action:none"></canvas><div id="e_cb" class="cb2" hidden><i></i></div></div>'}</div><div id="e_cl" class="ft" hidden>${COL.map((c,i)=>`<span class="cdot${i?'':' on'}" data-c="${c}" style="background:${c}"></span>`).join('')}</div><div class="cmp">${o.noCap?'':'<textarea id="e_cap" rows="1" placeholder="Add a caption"></textarea>'}<button class="tile" id="e_ok">${ic('send')}</button></div>`;
const done=v=>{URL.revokeObjectURL(url);ed.hidden=true;ed.innerHTML='';res(v)},cap=()=>($('#e_cap')||{}).value||'';$('#e_x').onclick=()=>done(null);
if(isV){$('#e_v').src=url;$('#e_ok').onclick=()=>done({file:f,caption:cap()});return}
const c=$('#e_c'),x=c.getContext('2d'),H=[];let mode='',col=COL[0],cr={x:.1,y:.1,w:.8,h:.8},dr=0;
const snap=()=>{H.push(x.getImageData(0,0,c.width,c.height));if(H.length>8)H.shift()};
const showCr=()=>{const b=$('#e_cb');b.hidden=mode!=='crop';b.style.cssText=`left:${cr.x*100}%;top:${cr.y*100}%;width:${cr.w*100}%;height:${cr.h*100}%`};
const tg=m=>{if(m==='crop'&&mode==='crop'){const sx=Math.round(cr.x*c.width),sy=Math.round(cr.y*c.height),w=Math.max(8,Math.round(cr.w*c.width)),h=Math.max(8,Math.round(cr.h*c.height));snap();const d=x.getImageData(sx,sy,w,h);c.width=w;c.height=h;x.putImageData(d,0,0);cr={x:.1,y:.1,w:.8,h:.8};mode=''}else mode=mode===m?'':m;showCr();$('#e_cl').hidden=mode!=='brush';$('#e_cr').style.background=mode==='crop'?'var(--ac)':'';$('#e_br').style.background=mode==='brush'?'var(--ac)':''};
const im=new Image();im.onload=()=>{const k=Math.min(1,1600/Math.max(im.width,im.height));c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);x.drawImage(im,0,0,c.width,c.height);if(o.crop)tg('crop')};im.onerror=()=>done(null);im.src=url;
$('#e_cr').onclick=()=>tg('crop');$('#e_br').onclick=()=>tg('brush');
$('#e_ro').onclick=()=>{snap();const t=document.createElement('canvas');t.width=c.height;t.height=c.width;const y=t.getContext('2d');y.translate(t.width/2,t.height/2);y.rotate(Math.PI/2);y.drawImage(c,-c.width/2,-c.height/2);c.width=t.width;c.height=t.height;x.drawImage(t,0,0)};
$('#e_un').onclick=()=>{const s=H.pop();if(s){c.width=s.width;c.height=s.height;x.putImageData(s,0,0)}};
$('#e_cl').onclick=e=>{const d=e.target.closest('.cdot');if(!d)return;col=d.dataset.c;document.querySelectorAll('.cdot').forEach(z=>z.classList.toggle('on',z===d))};
const pt=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height]};
c.onpointerdown=e=>{if(mode!=='brush')return;snap();dr=1;c.setPointerCapture(e.pointerId);x.strokeStyle=col;x.lineWidth=Math.max(4,c.width/90);x.lineCap=x.lineJoin='round';x.beginPath();const[a,b]=pt(e);x.moveTo(a,b);x.lineTo(a+.01,b);x.stroke()};
c.onpointermove=e=>{if(!dr)return;const[a,b]=pt(e);x.lineTo(a,b);x.stroke()};c.onpointerup=c.onpointercancel=()=>{dr=0};
$('#e_cb').onpointerdown=e=>{e.preventDefault();const h=e.target.tagName==='I',r=c.getBoundingClientRect(),sx=e.clientX,sy=e.clientY,o2={...cr};const mv=ev=>{const dx=(ev.clientX-sx)/r.width,dy=(ev.clientY-sy)/r.height;if(h){cr.w=Math.max(.1,Math.min(1-o2.x,o2.w+dx));cr.h=Math.max(.1,Math.min(1-o2.y,o2.h+dy))}else{cr.x=Math.max(0,Math.min(1-o2.w,o2.x+dx));cr.y=Math.max(0,Math.min(1-o2.h,o2.y+dy))}showCr()},up2=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up2)};addEventListener('pointermove',mv);addEventListener('pointerup',up2)};
$('#e_ok').onclick=()=>{if(mode==='crop')tg('crop');c.toBlob(b=>done({file:new File([b],(f.name.replace(/\.\w+$/,'')||'photo')+'.jpg',{type:'image/jpeg'}),caption:cap()}),'image/jpeg',.88)}})}
Act.attach=()=>sheet(`<div class="ag"><div data-a="pgal"><span class="tile">${ic('img')}</span>Gallery</div><div data-a="cam"><span class="tile">${ic('cam')}</span>Camera</div><div data-a="pfile"><span class="tile">${ic('file')}</span>File</div><div data-a="paud"><span class="tile">${ic('mic')}</span>Audio</div><div data-a="ploc"><span class="tile">${ic('pin')}</span>Location</div></div>`);
const pick=a=>{S.fm=0;fl.accept=a;fl.removeAttribute('capture');fl.multiple=true;fl.click()};
Act.pgal=()=>pick('image/*,video/*');Act.pfile=()=>pick('*/*');Act.paud=()=>pick('audio/*');
Act.ploc=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{$('#inp').value='https://www.google.com/maps?q='+p.coords.latitude+','+p.coords.longitude;snd()},()=>toast('Location permission needed')):toast('Location not supported');
Act.cam=async()=>{if(!(await MSNotify.askMedia('camera')))return toast('Camera permission needed');fl.accept='image/*';fl.multiple=false;fl.setAttribute('capture','environment');fl.click()};
Act.view=el=>{const d=$('#dlg');d.innerHTML=`<div class="ov" style="padding:0"><img src="${el.src}" style="max-width:100%;max-height:100%"></div>`;d.onclick=()=>d.innerHTML=''};
Act.cmenu=()=>{const c=S.cur;sheet(it('up','Go to first message','first')+(c.mute?it('mute','Unmute','unm'):it('mute','Mute','mu'))+it('del','Clear chat','clr')+it('del','Delete chat','dch',1))};
Act.first=()=>loadMs('first');
Act.unm=async()=>{await api('/chat/mute',{chat:cid(),until:0});S.cur.mute=0;toast('Notifications enabled')};
Act.mu=async()=>{const r=await dlg({t:'Mute',o:['Disable sound','Mute for…','Mute forever']});if(r.i<0)return;let u=-2,msg='Sound disabled';if(r.i===1){const d=await dlg({t:'Mute for',o:['1 hour','8 hours','2 days','7 days']});if(d.i<0)return;u=Date.now()+[1,8,48,168][d.i]*36e5;msg='Muted for '+['1 hour','8 hours','2 days','7 days'][d.i]}if(r.i===2){u=-1;msg='Muted forever'}await api('/chat/mute',{chat:cid(),until:u});S.cur.mute=u;toast(msg)};
Act.clr=async()=>{const c=S.cur,r=await dlg({t:'Clear chat?',cb:c.saved?'':`also delete for ${nm(ct(c))}`,ok:'Clear',red:1});if(r.ok){await api('/chat/clear',{chat:cid(),both:r.cb});S.ms=[];drawMs()}};
Act.dch=async()=>{const c=S.cur,r=await dlg({t:'Delete chat?',cb:c.saved?'':`also delete for ${nm(ct(c))}`,ok:'Delete',red:1});if(r.ok){await api('/chat/delete',{chat:cid(),both:r.cb});Act.back()}};

/* ---------- pages ---------- */
function page(t,h,right){const p=$('#pg');if(!p.hidden)S.pgs.push(p.innerHTML);p.hidden=false;p.innerHTML=`<div class="hd"><button class="ib" data-a="pback">${ic('back')}</button><b class="ttl fx">${t}</b>${right||''}</div><div style="overflow:auto;flex:1;padding:0 10px 20px">${h}</div>`}
Act.pback=()=>{const p=$('#pg');if(S.pgs.length)p.innerHTML=S.pgs.pop();else p.hidden=true};
Act.prof=()=>{const c=S.cur;if(c.saved)return Act.mypf();const u=c.peer;page('Profile',`<div style="text-align:center;padding:20px">${av(u,110)}<h2 style="margin-top:8px">${nm(ct(c))}</h2><small>${stat(u)}</small></div><div class="badge sec">${rw('person','@'+esc(u.username),'Username')}${u.bio?rw('info',nm(u.bio),'Bio'):''}</div><div class="badge sec">${rw('add',c.cn?'Edit contact':'Add contact','','addc')}${rw('home','Add to home screen','','a2h')}</div>`,`<button class="ib" data-a="pm">${ic('more')}</button>`)};
Act.pm=()=>sheet(it('block',S.cur.blocked?'Unblock user':'Block user','blk',1));
Act.blk=async()=>{const c=S.cur;if(c.blocked)return Act.unblock();const r=await dlg({t:`Are you sure want block ${nm(ct(c))}`,ok:'Block',red:1});if(r.ok){await api('/block',{peer:c.peer.id,block:true});c.blocked=true;$('#pg').hidden=true;S.pgs=[];drawC();drawMs()}};
Act.unblock=async()=>{await api('/block',{peer:S.cur.peer.id,block:false});S.cur.blocked=false;$('#pg').hidden=true;S.pgs=[];drawC();loadMs()};
Act.addc=async()=>{const c=S.cur,r=await dlg({t:c.cn?'Edit contact':'Add contact',in:'Name',v:c.cn||c.peer.name,o:c.cn?['Delete contact']:[],ok:'Done'});if(r.i===0){const d=await dlg({t:'Delete contact?',ok:'Delete',red:1});if(d.ok){await api('/contact',{peer:c.peer.id,del:1});c.cn=''}}else if(r.ok&&r.v.trim()){await api('/contact',{peer:c.peer.id,name:r.v.trim()});c.cn=r.v.trim()}$('#pg').hidden=true;S.pgs=[];drawC();drawMs()};
Act.a2h=()=>{if(S.bip){S.bip.prompt()}else toast('Chrome menu → Add to Home screen (this chat link opens directly)')};
addEventListener('beforeinstallprompt',e=>{e.preventDefault();S.bip=e});
Act.drawer=()=>{$('#dr').innerHTML=`<div class="dw"><div style="padding:16px;display:flex;justify-content:space-between;align-items:center"><img src="/icon-192.png" width="46" style="border-radius:50%"><button class="ib" data-a="theme"><img class="si" data-n="${S.st.t==='dark'?'sun':'moon'}" style="width:28px;height:28px;object-fit:contain" src="/app/${S.st.t==='dark'?'sun':'moon'}.svg" alt="" onerror="siFix(this)"></button></div><div class="row" data-a="mypf">${av(S.me,56)}<div class="fx"><b class="sn">${nm(S.me.name)}</b><br><small>@${esc(S.me.username)}</small></div></div><hr>${S.ac.map((a,i)=>`<div class="row" data-a="acct" data-i="${i}"><span class="av" style="width:38px;height:38px;background:#7a2bc4">${esc(ini(a.name))}</span><div class="fx sn">${nm(a.name)}</div>${i===S.ai?ic('ok'):''}</div>`).join('')}${S.ac.length<5?rw('add','Add account','','addacc'):''}<hr>${rw('person','My Profile','','mypf')}${rw('bm','Saved Messages','','saved')}${rw('set','Settings','','setg')}${rw('anim','Animations','','anim')}${rw('img','Chat Settings','','chs')}${rw('lock','Privacy and Security','','prv')}</div>`;$('#dr').hidden=false};
Act.theme=()=>{S.st.t=S.st.t==='dark'?'light':'dark';document.documentElement.dataset.t=S.st.t;sv();try{cl2();drawMs()}catch(e){}};
Act.acct=el=>{S.ai=+el.dataset.i;sv();S.ni=1;boot()};
Act.addacc=()=>authScr(1);
Act.saved=()=>{$('#pg').hidden=true;openC({chat:'s:'+S.me.id,peer:S.me,cn:'',saved:true,mute:0})};
Act.mypf=fresh=>{if(fresh===1)Act.pback();const u=S.me;page('My Profile',`<div style="text-align:center;padding:20px">${av(u,110)}<h2 style="margin-top:8px">${nm(u.name)}</h2><small>online</small></div><div style="display:flex;gap:8px"><div class="badge row fx" data-a="sp" style="flex-direction:column;padding:12px">${ic('cam')}<small>Set Photo</small></div><div class="badge row fx" data-a="ei" style="flex-direction:column;padding:12px">${ic('edit')}<small>Edit Info</small></div><div class="badge row fx" data-a="setg" style="flex-direction:column;padding:12px">${ic('set')}<small>Settings</small></div></div><div class="badge sec">${rw('mail',esc(u.email),'Email')}${rw('info',nm(u.bio||'—'),'Bio')}${rw('person','@'+esc(u.username),'Username')}${u.dob?rw('info',esc(u.dob),'Birthday'):''}</div>`,`<button class="ib" data-a="lgp">${ic('more')}</button>`)};
Act.sp=()=>{S.fm='av';fl.accept='image/*';fl.removeAttribute('capture');fl.click()};
Act.ei=()=>{const u=S.me;page('Edit info',`<input id="en" class="inp" placeholder="Name" value="${esc(u.name)}"><input id="eb" class="inp" placeholder="Bio" value="${esc(u.bio)}" maxlength="120"><input id="eu" class="inp" placeholder="Username" value="${esc(u.username)}"><input id="ed" class="inp" type="date" value="${esc(u.dob)}"><div class="badge sec">${rw('mail','Change email',esc(u.email),'cem')}</div><button class="btn" data-a="esv">Done</button>`)};
Act.esv=async()=>{const j=await api('/me/update',{name:$('#en').value,bio:$('#eb').value,username:$('#eu').value,dob:$('#ed').value});if(ok(j)){S.me=j.me;toast('Saved');Act.pback()}};
Act.cem=async()=>{const e=await ask('New email','Email','email');if(!e)return;const j=await api('/me/email-start',{email:e});if(!ok(j))return;toast('Code sent by MS SPAM CHAT');const c=await ask('Enter code','6-digit code','tel');if(!c)return;const k=await api('/me/email-confirm',{code:c});if(ok(k)){S.me=k.me;toast('Email changed')}};
Act.setg=()=>{page('Settings',`<div class="badge sec">${rw('person','Account','Name, bio, username, birthday','ei')}${rw('img','Chat Settings','Text size, wallpapers','chs')}${rw('lock','Privacy and Security','','prv')}${rw('anim','Animations','Slime motion intensity','anim')}${rw('mute','Notifications','Enable push on this device','pushon2')}${rw('mute','Send test notification','Check that push works','ptest')}</div>`,`<button class="ib" data-a="lgp">${ic('more')}</button>`)};
Act.pushon2=async()=>{await Act.pushon();toast('Notifications: '+Notification.permission)};
Act.rxs=()=>page('Reactions',`<p class="hint">Double-tap a message (or beside it) to react with:</p><div class="badge sec" style="display:flex;flex-wrap:wrap;gap:8px;padding:14px">${RE.map(e=>`<span data-a="rxp" data-e="${e}" style="padding:6px;border-radius:16px;${(S.st.dr||'👍')===e?'background:var(--ac)':''}"><img class="em" style="width:34px;height:34px" src="${eu(e)}"></span>`).join('')}</div>`);
Act.rxp=el=>{S.st.dr=el.dataset.e;sv();Act.pback();Act.rxs();toast('Double-tap reaction saved')};
Act.chs=()=>page('Chat Settings',`<div class="badge sec" style="padding:14px"><b>Message text size</b><input type="range" min="12" max="24" value="${S.st.fs}" style="width:100%" oninput="S.st.fs=this.value;document.documentElement.style.setProperty('--fs',this.value+'px');sv()"></div><div class="badge sec" style="padding:14px"><b>Message corners</b><input type="range" min="0" max="28" value="${S.st.mr==null?22:S.st.mr}" style="width:100%" oninput="S.st.mr=+this.value;setMr();sv()"><div class="m me" style="margin:10px 0 0;max-width:none">Preview message</div></div><div class="badge sec">${rw('person','Reactions','Double-tap reaction: '+(S.st.dr||'👍'),'rxs')}</div><div class="badge sec"><div class="wps">${WP.map((w,i)=>`<div data-a="wpp" data-i="${i}" style="background:${w}"></div>`).join('')}</div>${rw('img','Wallpaper from gallery','','wpg')}${rw('clip','Wallpaper from URL','','wpu')}</div>`);
Act.wpp=el=>{S.st.wp=+el.dataset.i;S.st.wu='';sv();toast('Wallpaper set')};
Act.wpg=()=>{S.fm='wp';fl.accept='image/*';fl.removeAttribute('capture');fl.click()};
Act.wpu=async()=>{const u=await ask('Image URL','https://…','url');if(u){S.st.wu=u;sv();toast('Wallpaper set')}};
Act.prv=()=>page('Privacy and Security',`<div class="badge sec">${rw('lock','Two-step verification',S.me.two?'On':'Off','two')}${rw('lock','Passcode lock',S.me.pass?'On':'Off','pass')}${rw('mail','Change email',esc(S.me.email),'cem')}${rw('block','Blocked users','','bls')}${rw('dev','Devices','','dv')}${rw('person','Last seen',S.me.hideSeen?'Hidden (others see "recently")':'Everyone','ls')}</div>`);
Act.ls=async()=>{const j=await api('/me/update',{hideSeen:!S.me.hideSeen});if(ok(j)){S.me=j.me;Act.pback();Act.prv()}};
async function secFlow(kind,label){const on=kind==='pass'?S.me.pass:S.me.two;if(!on){const v=await ask('New '+label);if(!v)return;if(!ok(await api('/sec/set',{kind,value:v})))return}else{const r=await dlg({t:label,o:['Change','Remove']});if(r.i<0)return;const cur=await ask('Current '+label);if(!cur)return;if(r.i===0){const v=await ask('New '+label);if(!v)return;if(!ok(await api('/sec/set',{kind,value:v,current:cur})))return}else if(!ok(await api('/sec/remove',{kind,value:cur})))return}S.me=(await api('/me')).me;toast('Done')}
Act.two=()=>secFlow('two','password');Act.pass=()=>secFlow('pass','passcode');
Act.bls=async()=>{const j=await api('/blocked');page('Blocked users',(j.users||[]).map(u=>`<div class="row" data-a="ubl" data-i="${u.id}">${av(u)}<div class="fx"><b>${nm(u.name)}</b><br><small>Tap to unblock</small></div></div>`).join('')||'<p style="padding:20px;opacity:.6">No blocked users</p>')};
Act.ubl=async el=>{await api('/block',{peer:el.dataset.i,block:false});Act.pback();Act.bls()};
Act.dv=async()=>{const j=await api('/devices');const o=[['After 1 week',6048e5],['After 1 month',2592e6],['After 3 months',7776e6],['After 6 months',15552e6],['After 1 year',31536e6]],cur=S.me.autoOut||15552e6;
page('Devices',`<button class="btn" data-a="adddev">${ic('qr')} Add Device</button><p class="hint" style="text-align:left">Active sessions</p><div class="badge sec">${(j.devices||[]).map(d=>`<div class="row" data-a="tdev" data-i="${d.id}">${tl('dev')}<div class="fx"><div class="sn">${esc(d.ua||'Unknown')}</div><small>${new Date(d.last||d.ts).toLocaleString()} ${d.current?'· This device':'· tap to log out'}</small></div></div>`).join('')}</div><p class="hint" style="text-align:left">Automatically log out devices that were not used for</p><div class="badge sec">${o.map(([t,v])=>`<div class="row" data-a="ttl" data-v="${v}"><div class="fx">${t}</div>${cur===v?ic('ok'):''}</div>`).join('')}</div>`)};
Act.ttl=async el=>{const j=await api('/devices/ttl',{ms:+el.dataset.v});if(ok(j)){S.me=j.me;Act.pback();Act.dv()}};
Act.adddev=async()=>{const v=await scanQR();if(!v)return;const m=String(v).match(/qr=([a-f0-9]+)/)||[0,String(v).trim()];qrApprove(m[1])};
Act.tdev=async el=>{const r=await dlg({t:'Log out this device?',ok:'Log out',red:1});if(r.ok){await api('/devices/logout',{id:el.dataset.i});Act.pback();Act.dv()}};
Act.lgp=()=>sheet(it('logout','Logout','lgo'));
Act.lgo=()=>page('Logout',`<div class="badge sec">${rw('del','Delete account permanently','','delacc')}${rw('logout','Logout','','lo')}</div>`);
function localLogout(){S.ac.splice(S.ai,1);S.ai=0;sv();S.me=null;S.ni=1;$('#pg').hidden=true;$('#cv').hidden=true;boot()}
Act.lo=async()=>{const r=await dlg({t:'Logout?',p:'You will need to login again on this device.',ok:'Logout',red:1});if(r.ok){try{await MSNotify.unregisterDevice()}catch(e){}await api('/auth/logout',{});localLogout()}};
Act.delacc=async()=>{const j=await api('/account/delete-start',{});if(j.err==='setup2fa'){const r=await dlg({t:'Set up first',p:'Set Two-step verification or a passcode before deleting your account.',ok:'Set up'});if(r.ok)Act.two();return}if(!ok(j))return;if(j.debug)toast('Code: '+j.debug);const code=await ask('Email code','6-digit code','tel');if(!code)return;const b={code};if(j.need.two){b.two=await ask('Two-step password');if(!b.two)return}if(j.need.pass){b.pass=await ask('Passcode');if(!b.pass)return}const d=await api('/account/delete-confirm',b);if(ok(d))localLogout()};

Act.anim=()=>{const v=S.st.an==null?4:S.st.an;page('Animations',`<div class="badge sec" style="padding:18px"><b>Animation intensity</b><input type="range" min="0" max="4" step="1" value="${v}" style="width:100%;margin:18px 0 6px" oninput="S.st.an=+this.value;setAn();sv();$('#al').textContent=ANL[this.value]"><div style="display:flex;justify-content:space-between"><small>Off</small><small>10%</small><small>50%</small><small>70%</small><small>100%</small></div><p id="al" style="text-align:center;font-weight:700;margin-top:12px">${ANL[v]}</p></div><div class="badge sec" style="padding:18px;text-align:center"><div class="jelly"></div><small>Preview</small></div>`)};
Act.ptest=async()=>{if((await MSNotify.permission())!=='granted')return toast('Allow notifications first');await MSNotify.registerDevice();const j=await MSNotify.test();toast(esc(j.err||(j.ok?'Test sent. Minimise the app to see it.':'Failed: '+(j.codes||[]).join(','))))};

/* ---------- realtime (polling) ---------- */
let pollBusy = false;
async function poll() {
  if (pollBusy || !S.me || !S.ac[S.ai]) return;
  pollBusy = true;
  try {
    if (OB.length) await flush();
    const j = await api('/updates?after=' + S.v);
    if (!j.items) return;
    S.v = j.v;
    S.n = (S.n || 0) + 1;
    if (!j.items.length && S.n % 6) return;
    let d = 0, inn = 0;
    for (const x of j.items) {
      const cur = S.cur && x.chat === S.cur.chat;
      if (cur && x.rd !== undefined) { S.pr = x.rd; d = 1 }
      if (x.msg) {
        if (cur) {
          merge(x.msg); d = 1;
          if (!x.msg.gone && x.msg.from !== S.me.id) api('/read', { chat: x.chat })
        } else if (!x.msg.gone && x.msg.from !== S.me.id) inn = x.chat
      }
    }
    await loadChats();
    if (inn) {
      const c = S.ch.find(y => y.chat === inn);
      if (c && !c.mute) {
        MSNotify.playSound();
        if (c.mute !== -2) MSNotify.show({ title: ct(c), body: uni(prev(c.last)), chatId: c.chat, msgId: c.last && c.last.id })
      }
    }
    if (d) drawMs();
  } catch (e) {
    console.warn('Poll error:', e.message);
  } finally {
    pollBusy = false;
  }
}
setInterval(() => poll().catch(() => {}), 5000);
boot();

addEventListener('keydown',e=>{if(e.key==='Escape'&&S.cur&&!$('#dlg').innerHTML&&$('#sh').hidden)Act.back()});

/* =========================================================
   SHARE TARGET (FIXED - WITH Content-Type header)
   ========================================================= */
if (new URLSearchParams(location.search).has('shared')) {
  history.replaceState(null, '', '/');
  const checkBoot = setInterval(async () => {
    if (S.me && S.ch && S.ch.length >= 0) {
      clearInterval(checkBoot);
      try {
        const db = await new Promise((res, rej) => {
          const req = indexedDB.open('MS_Chat_Share', 1);
          req.onsuccess = (e) => res(e.target.result);
          req.onerror = (e) => rej(e.target.error);
        });
        const tx = db.transaction('shared_files', 'readwrite');
        const store = tx.objectStore('shared_files');
        const req = store.getAll();
        req.onsuccess = () => {
          const files = req.result;
          if (!files || files.length === 0) return;
          const d = $('#dlg');
          const validChats = S.ch.filter(c => c && c.chat && c.peer);
          d.innerHTML = `<div class="ov"><div class="badge bx" style="max-height: 80vh; display: flex; flex-direction: column; padding: 0;">
            <div style="padding: 18px; border-bottom: 1px solid var(--bd);">
              <h3 style="margin-bottom: 4px;">Send Files</h3>
              <p style="font-size: 13px; opacity: 0.7;">${files.length} file(s) received. Select a chat to send.</p>
            </div>
            <div style="overflow-y: auto; flex: 1; padding: 6px 0;" id="share-list">
              ${validChats.length ? validChats.map((c, i) => `
                <div class="row" data-share-i="${i}" style="padding: 12px 16px;">
                  ${av(c.peer, 46, c.saved)}
                  <div class="fx">
                    <b class="sn">${nm(ct(c))}</b>
                    <small class="sn" style="opacity:0.6">${c.saved ? 'Saved Messages' : '@' + esc(c.peer.username)}</small>
                  </div>
                </div>
              `).join('') : '<p style="text-align:center;padding:20px;opacity:.6">No chats available</p>'}
            </div>
            <div class="bt" style="padding: 12px 18px; border-top: 1px solid var(--bd); margin: 0;">
              <button id="share-cancel" style="color: #ff5b5b;">Cancel</button>
            </div>
          </div></div>`;
          d.querySelectorAll('[data-share-i]').forEach(el => {
            el.onclick = async () => {
              const chatIdx = +el.dataset.shareI;
              const targetChat = validChats[chatIdx].chat;
              d.innerHTML = '';
              await processSharedFiles(files, targetChat, store);
            };
          });
          d.querySelector('#share-cancel').onclick = () => {
            d.innerHTML = '';
            store.clear();
            toast('Share cancelled');
          };
        };
      } catch (err) { console.error('Share target error:', err); }
    }
  }, 800);
}

async function processSharedFiles(files, targetChat, store) {
  toast('Sending files...');
  const token = (S.ac[S.ai] || {}).token;
  if (!token || token === 'undefined') {
    toast('Session expired');
    return;
  }
  for (const file of files) {
    const f = new File([file.blob], file.name, { type: file.type });
    let url;
    try {
      const filename = `${f.name.replace(/[^\w.\-]/g, '_')}`;
      const res = await fetch(`${API_BASE}/upload?name=${E(filename)}`, {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/octet-stream'  // MUST for Vercel
        },
        body: f
      });
      const data = await res.json();
      if (!res.ok || data.err) throw new Error(data.err || `HTTP ${res.status}`);
      if (!data.url) throw new Error('No URL returned');
      url = data.url;
    } catch (e) { toast('Upload failed: ' + e.message); continue; }
    if (url) {
      const mediaObj = { 
        url, name: f.name, size: f.size, 
        type: f.type.startsWith('image') ? 'image' : f.type.startsWith('video') ? 'video' : f.type.startsWith('audio') ? 'audio' : 'file' 
      };
      await api('/send', { chat: targetChat, media: mediaObj, text: '' });
    }
  }
  store.clear();
  toast('All files sent successfully!');
  if (S.cur && S.cur.chat === targetChat) loadMs();
  else loadChats();
}
