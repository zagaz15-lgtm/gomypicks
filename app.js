/* Go My Picks! app code — served from GitHub Pages so Google never rewrites it. */
window.__gmpStarted=true;

if(window.top!==window) document.documentElement.classList.add('emb');
window.addEventListener('message',function(e){ if(e.data&&e.data.pickemVH){ const r=document.documentElement;
  if(e.data.pickemBottom!=null) r.style.setProperty('--bpad',(Number(e.data.pickemBottom)+8)+'px');
  r.style.setProperty('--vh',e.data.pickemVH+'px'); r.classList.add('shell'); if(typeof layout==='function'&&D) layout(); }});
const SEASON_YEAR=(d=>d.getMonth()<2?d.getFullYear()-1:d.getFullYear())(new Date()); // Jan–Feb still count as last season
(document.getElementById('yr')||{}).textContent=SEASON_YEAR; document.title='Go My Picks! '+SEASON_YEAR;
let SPN=0;
const throwSVG=()=>{ const id='t'+(++SPN); return `<svg class="throw" viewBox="0 0 260 110" aria-hidden="true"><defs><path id="arc${id}" d="M 30 92 Q 130 -6 230 92"/><clipPath id="rv${id}"><rect x="0" y="0" height="110" width="0"><animate attributeName="width" from="0" to="260" dur="1.6s" repeatCount="indefinite"/></rect></clipPath></defs><use href="#arc${id}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="5 6" stroke-linecap="round" clip-path="url(#rv${id})" opacity=".55"><animate attributeName="opacity" values="0;.55;.55;0" keyTimes="0;0.1;0.85;1" dur="1.6s" repeatCount="indefinite"/></use><g><animateMotion dur="1.6s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.35 0 0.65 1"><mpath href="#arc${id}"/></animateMotion><g transform="translate(-21,-14) scale(0.35)"><path d="M4 40 C 20 3, 100 3, 116 40 C 100 77, 20 77, 4 40 Z" fill="#8B4A1C" stroke="#fff" stroke-width="3"/><path d="M27 15 C 21 30, 21 50, 27 65 M93 15 C 99 30, 99 50, 93 65" fill="none" stroke="#fff" stroke-width="3"/><path d="M46 17 H74 M50 13 V21 M56 13 V21 M62 13 V21 M68 13 V21" stroke="#fff" stroke-width="2" stroke-linecap="round"/><text x="60" y="44" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="15" fill="#fff">GO MY</text><text x="60" y="61" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="15" fill="#fff">PICKS!</text></g></g></svg>`; };
const spinner=(msg,sm)=>`<div class="spin${sm?' sm':''}">${throwSVG()}${msg||'Loading…'}</div>`;
var D=null; let WEEK=null, VIEW='games', TAB='home', HS={}, CDT=null;
try{VIEW=localStorage.getItem('pickemView')||'games';}catch(e){}
let THEME='auto'; try{THEME=localStorage.getItem('pickemTheme')||'auto';}catch(e){}
function applyTheme(){const r=document.documentElement; if(THEME==='auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme',THEME);
  [['thAuto','auto'],['thLight','light'],['thDark','dark']].forEach(([id,k])=>{const b=document.getElementById(id); if(b) b.className=THEME===k?'on':'';});
  try{ const head=getComputedStyle(r).getPropertyValue('--head').trim(); if(window.top!==window){ const cs=getComputedStyle(r); window.top.postMessage({pickemHead:head,turfA:cs.getPropertyValue('--turfA').trim(),turfB:cs.getPropertyValue('--turfB').trim()},'*'); } }catch(e){} }
try{ matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyTheme); }catch(e){}
function setTheme(t){THEME=t; try{localStorage.setItem('pickemTheme',THEME);}catch(e){} applyTheme();}
function toggleMenu(force){ const m=document.getElementById('menu'), b=document.getElementById('menuBtn'); const open=force!=null?force:m.hidden;
  m.hidden=!open; b.setAttribute('aria-expanded',open); b.classList.toggle('open',open); }
document.addEventListener('click',e=>{ const m=document.getElementById('menu'); if(m&&!m.hidden&&!e.target.closest('#menu')&&!e.target.closest('#menuBtn')) toggleMenu(false); });
function cycleTheme(){THEME=THEME==='auto'?'light':THEME==='light'?'dark':'auto'; try{localStorage.setItem('pickemTheme',THEME);}catch(e){} applyTheme();}
applyTheme();
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const money=v=>v==null?'':(v<0?'<span class="neg">−$'+Math.abs(v)+'</span>':'$'+v);
const logo=t=>D&&D.logos&&D.logos[t]?`<img class="logo" src="${esc(D.logos[t])}" alt="">`:'';
const isLive=s=>s&&s!=='Final'&&s!=='Not started'&&s!=='Not found';
function load(json){ try{ load_(json); }catch(e){ D=null; (window.__gmpShow||alert)('Loading failed: '+e.message); console.error(e); } }
function load_(json){
  D=JSON.parse(json);
  D.pickMap={}; D.wkPts={}; D.yrPts={};
  D.picks.forEach(([w,n,g,p,pts])=>{
    (D.pickMap[w+'|'+g]=D.pickMap[w+'|'+g]||{})[n]=p;
    if(pts!=null){D.wkPts[w+'|'+n]=(D.wkPts[w+'|'+n]||0)+pts; D.yrPts[n]=(D.yrPts[n]||0)+pts;}
  });
  D.weeks=[...new Set(D.games.map(g=>g.week))].sort((a,b)=>a-b);
  setTimeout(updateBoardDot,0); setTimeout(updateSignBtn,0);
  if(WEEK==null){
    const started=D.weeks.filter(w=>D.games.some(g=>g.week===w&&g.status!=='Not started'));
    WEEK=started.length?started[started.length-1]:D.weeks[D.weeks.length-1];
  }
  render();
}
function weekMoney(name,uptoWeek){ // running total through uptoWeek (inclusive)
  const m=(D.money||{})[name]||[]; let t=0; for(let i=0;i<uptoWeek&&i<m.length;i++) if(m[i]!=null) t+=m[i]; return t; }
function thisWeekMoney(name,wk){ const m=(D.money||{})[name]||[]; const v=m[wk-1]; return v==null?null:v; }
function tab(t){TAB=t;document.getElementById('scroller').scrollTop=0;try{window.scrollTo(0,0);}catch(e){}[['tHome','home'],['tPick','pick'],['tWeek','week'],['tStand','stand'],['tPush','push'],['tHtc','htc']].forEach(([id,k])=>document.getElementById(id).className=t===k?'on':'');render();}
function setWeek(d){const i=D.weeks.indexOf(WEEK)+d; if(i>=0&&i<D.weeks.length){WEEK=D.weeks[i];render();}}
function setView(v){VIEW=v;try{localStorage.setItem('pickemView',v);}catch(e){}render();}
function render(){
  const app=document.getElementById('app'); if(!D) return;
  document.getElementById('scroller').classList.toggle('fill',TAB==='stand');
  app.innerHTML = TAB==='home'?renderHome():TAB==='pick'?renderPick():TAB==='week'?renderWeek():TAB==='stand'?renderStand():TAB==='push'?renderPush():renderHtc();
  layout();
}
function renderWeek(){
  const gs=D.games.filter(g=>g.week===WEEK);
  const fin=gs.filter(g=>g.status==='Final').length;
  const wn=D.winners[WEEK-1]||'';
  let h=`<div class="wkhead"><div class="weeknav"><button onclick="setWeek(-1)">‹</button><div class="t"><b>Week ${WEEK}</b>
        <div>${bookieName(WEEK)?'★ Bookie: '+esc(bookieName(WEEK))+' · ':''}${fin} of ${gs.length} final${wn?' · '+esc(String(wn).indexOf('Leader:')===0?wn:'Winner: '+wn):''}</div></div>
        <button onclick="setWeek(1)">›</button></div>
        <div class="seg"><button class="${VIEW==='games'?'on':''}" onclick="setView('games')">List</button>
        <button class="${VIEW==='cards'?'on':''}" onclick="setView('cards')">Cards</button>
        <button class="${VIEW==='grid'?'on':''}" onclick="setView('grid')">Sheet</button>
        <button class="${VIEW==='board'?'on':''}" onclick="setView('board')">Scores</button></div></div>`;
  if(VIEW==='games'||VIEW==='cards') h+=byeLine(WEEK);
  if(VIEW==='games') h+=gs.map(gameCard).join('');
  if(VIEW==='cards') h+='<div class="cards">'+gs.map(miniCard).join('')+'</div>';
  if(VIEW==='grid') h+=gridView(gs);
  if(VIEW==='board') h+=boardView();
  h+=`<div class="foot">Scores refreshed ${esc(D.refreshed)}</div>`;
  return h;
}
const DK_IMG='<img class="dkmini" src="https://www.google.com/s2/favicons?domain=draftkings.com&sz=64" alt="DK">';
const LOCK_IMG='<svg class="lockmini" viewBox="0 0 11 12" aria-hidden="true"><rect x="1" y="5" width="9" height="7" rx="1.5" fill="currentColor"/><path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
const DKLOCK='<span class="dklock">'+DK_IMG+LOCK_IMG+'</span>';
function teamRow(g,side){
  const t=side==='a'?g.away:g.home, sc=side==='a'?g.as:g.hs, adj=side==='a'?g.aadj:g.hadj;
  const fav=t!==g.dog?'−'+g.spread:'+'+g.spread;
  const cov=g.status==='Final'&&g.winner===t;
  return `<div class="team${cov?' cover':''}"><span>${logo(t)}</span><span class="n">${esc(t)}<span class="rec">(${esc((D.records||{})[t]||'')})</span></span><span class="sp">${g.spread!==''?DKLOCK+fav:''}</span>
          <span class="sc">${sc===''?'':sc}</span><span class="adj">${adj===''?'':'adj '+adj}</span></div>`;
}
function picksVisible(g){ return isStarted(g)||((D&&D.revealed)||[]).indexOf(g.week)>=0; }   // kicked off, or the full league sheet was imported
function isStarted(g){return !!g.status&&g.status!=='Not started'&&g.status!=='Not found';}
function pickGroups(g){
  const pm=D.pickMap[g.week+'|'+g.game]||{}; const grp={a:[],h:[],p:[],n:[]};
  D.players.forEach(n=>{const p=pm[n]; if(p===g.away)grp.a.push(n); else if(p===g.home)grp.h.push(n); else if(p==='Push')grp.p.push(n); else if(p)grp.n.push(n);});
  return grp;
}
function dkText(g){
  if(g.line==null) return '';
  const fav=g.line<0?g.home:g.line>0?g.away:null; const now=fav?fav+' −'+Math.abs(g.line):'PK';
  const lockedFav=g.spread!==''?(g.dog===g.home?g.away:g.home):null; const moved=lockedFav&&(fav!==lockedFav||Math.abs(g.line)!==Number(g.spread));
  return `<span class="dknow">${DK_IMG}${isStarted(g)?'close':'now'}:</span> <span class="${moved?'moved':''}">${esc(now)}</span>`;
}
function pillFor(g){const fin=g.status==='Final';
  return fin?'<span class="pill final">Final</span>':isLive(g.status)?`<span class="pill live">${esc(g.status)}</span>`:`<span class="pill">${esc(g.status)}</span>`;}
function gameCard(g){
  const grp=pickGroups(g), dk=dkText(g), gi=D.games.indexOf(g);
  return `<div class="card tap" onclick="openGame(${gi})">${teamRow(g,'a')}${teamRow(g,'h')}
    <div class="meta">${pillFor(g)}<span>${picksVisible(g)?`${grp.a.length} – ${grp.h.length}${grp.p.length?' · '+grp.p.length+' push':''}`:'<svg class="lockic" viewBox="0 0 11 12" aria-hidden="true"><rect x="1" y="5" width="9" height="7" rx="1.5" fill="currentColor"/><path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>picks hidden'}${g.tb?' · tiebreak':''}${dk?' · '+dk:''} ›</span></div></div>`;
}
function miniCard(g){
  const fin=g.status==='Final', gi=D.games.indexOf(g);
  const row=(t,sc)=>`<div class="r${fin&&g.winner===t?' cover':''}">${logo(t)}<span class="nm">${esc(t)}</span><span class="s">${sc===''?'':sc}</span></div>`;
  const st=fin?esc('Final'):isLive(g.status)?esc(g.status):(g.spread!==''?DKLOCK+esc((g.dog===g.home?g.away:g.home)+' −'+g.spread):'');
  return `<div class="mini" onclick="openGame(${gi})">${row(g.away,g.as)}${row(g.home,g.hs)}
    <div class="ft"><span class="${isLive(g.status)?'moved':''}">${st}</span><span>›</span></div></div>`;
}
let GSEL=new Set(), GSELOPEN=false;
function toggleGsel(n){ if(GSEL.has(n)) GSEL.delete(n); else GSEL.add(n); render(); }
function clearGsel(){ GSEL.clear(); render(); }
function toggleGselPanel(){ GSELOPEN=!GSELOPEN; render(); }
function gridView(gs){
  const bkn=bookieName(WEEK), ppl=GSEL.size?D.players.filter(n=>GSEL.has(n)):D.players;
  const sel=[...GSEL];
  let h=`<div class="gsel"><button class="gselbtn${GSEL.size?' on':''}" onclick="toggleGselPanel()">👥 ${GSEL.size?esc(sel.slice(0,3).join(', '))+(sel.length>3?' +'+(sel.length-3):''):'Compare people'} <span class="caret">${GSELOPEN?'▴':'▾'}</span></button>
    ${GSEL.size?`<button class="gchip clr" onclick="clearGsel()">✕ Show all</button>`:''}
    ${GSELOPEN?`<div class="gselpanel"><div class="gselgrid">${D.players.map((n,i)=>`<label class="gselopt"><input type="checkbox" ${GSEL.has(n)?'checked':''} onchange="toggleGsel(D.players[${i}])"> ${esc(n)}</label>`).join('')}</div>
      <div class="gselfoot"><a href="#" onclick="clearGsel();return false;">Clear</a><button class="gchip on" onclick="toggleGselPanel()">Done</button></div></div>`:''}</div>`;
  h+='<div class="gridwrap"><table class="grid"><thead><tr><th class="stick">Team</th><th>Pts</th><th>Score</th><th>Adj</th>'+ppl.map(n=>`<th>${n===bkn?'★ ':''}${esc(n)}</th>`).join('')+'</tr></thead><tbody>';
  gs.forEach(g=>{
    const pm=D.pickMap[WEEK+'|'+g.game]||{}, fin=g.status==='Final';
    [['a',g.away,g.as,g.aadj],['h',g.home,g.hs,g.hadj]].forEach(([s,t,sc,adj])=>{
      const cov=fin&&g.winner===t;
      h+=`<tr class="${s==='h'?'home':''}"><td class="stick${cov?' cov':''}">${logo(t)}${esc(t)}</td><td class="${cov?'cov':''}">${t!==g.dog?'−'+g.spread:''}</td>
          <td class="${cov?'cov':''}">${sc}</td><td class="${cov?'cov':''}">${adj}</td>`+
        ppl.map(n=>{const p=pm[n]; let m=p===t?'X':(p==='Push'?'PUSH':''); const ok=fin&&((m==='X'&&g.winner===t)||(m==='PUSH'&&g.winner==='Push'));
          return `<td class="${ok?'ok':''}">${m}</td>`;}).join('')+'</tr>';
    });
  });
  const row=(lbl,f)=>`<tr><td class="stick">${lbl}</td><td></td><td></td><td></td>`+ppl.map(n=>`<td>${f(n)}</td>`).join('')+'</tr>';
  h+='</tbody><tfoot>'+
    row('Tie breaker',n=>{const v=(D.tiebreak[n]||[])[WEEK-1];return v==null?'':v;})+
    row('Wins this week',n=>{const v=D.wkPts[WEEK+'|'+n]||0;return weekFinal(WEEK)&&v<=3?`<span class="neg">${v} HTC</span>`:v;})+
    row('Wins prev. weeks',n=>prevPts(n))+
    row('Wins this year',n=>(D.wkPts[WEEK+'|'+n]||0)+prevPts(n))+
    row('$ this week',n=>money(thisWeekMoney(n,WEEK)))+
    row('$ prev. weeks',n=>money(weekMoney(n,WEEK-1)))+
    row('$ to date',n=>money(weekMoney(n,WEEK)))+
    '</tfoot></table></div>';
  return h;
}
function prevPts(n){let t=0;D.weeks.forEach(w=>{if(w<WEEK)t+=D.wkPts[w+'|'+n]||0;});return t;}
function maxPts(n,w){
  let m=D.wkPts[w+'|'+n]||0;
  D.games.filter(g=>g.week===w&&g.status!=='Final').forEach(g=>{
    if(isStarted(g)){ const p=(D.pickMap[w+'|'+g.game]||{})[n]; m+=p==='Push'?2:(p?1:0); }      // pick is known once the game starts
    else m+=(g.spread!==''&&Number(g.spread)%1===0)?2:1;                                         // not started: best case (a correct push is 2)
  });
  return m;
}
function boardView(){
  const race=(D.contention||{})[WEEK]||{};
  const rows=D.players.map(n=>({n,mx:race[n]?race[n].max:maxPts(n,WEEK),alive:race[n]?race[n].alive:null,wk:D.wkPts[WEEK+'|'+n]||0,tb:(D.tiebreak[n]||[])[WEEK-1],yr:(D.wkPts[WEEK+'|'+n]||0)+prevPts(n),m:weekMoney(n,WEEK)}))
    .sort((a,b)=>b.wk-a.wk||b.yr-a.yr);
  const max=rows.length?rows[0].wk:0, done=weekFinal(WEEK);
  return `<div class="card"><table><thead><tr><th class="l">Name</th><th>Wk ${WEEK}</th><th title="Most points still possible this week">Max</th><th>TB</th><th>Year</th><th>$ to date</th></tr></thead><tbody>`+
    rows.map(r=>`<tr class="${r.wk===max&&max>0?'top':''}"><td class="l">${esc(r.n)}${r.n===bookieName(WEEK)?' <span title="Bookie">★</span>':''}</td><td class="${weekFinal(WEEK)&&r.wk<=3?'neg':''}"><b>${r.wk}</b>${weekFinal(WEEK)&&r.wk<=3?' HTC':''}</td><td class="${done?'':((r.alive!=null?r.alive:r.mx>=max)?'alive':'outrun')}">${r.mx}</td><td>${r.tb==null?'':r.tb}</td><td>${r.yr}</td><td>${money(r.m)}</td></tr>`).join('')+
    '</tbody></table>'+(done?'':`<div class="foot" style="text-align:left;margin:6px 10px 8px"><b>Max</b> = most points still possible this week if every remaining game goes their way. <b>Green</b> = can still win or tie for the week (it checks everyone’s actual picks, so a rival who picked the same side gains too); <s>struck through</s> = can’t catch the leader.</div>`)+'</div>';
}
function cupSVG(){return `<svg width="86" height="96" viewBox="0 0 86 96" aria-label="Winner's stein">
  <defs><linearGradient id="sv" x1="0" x2="1"><stop offset="0" stop-color="#8e959c"/><stop offset=".35" stop-color="#f4f6f8"/><stop offset=".6" stop-color="#c3c8cd"/><stop offset="1" stop-color="#7c838a"/></linearGradient></defs>
  <path d="M62 30 q20 0 20 22 q0 22 -20 22" fill="none" stroke="url(#sv)" stroke-width="8"/>
  <rect x="10" y="22" width="54" height="66" rx="6" fill="url(#sv)" stroke="#6b7177"/>
  <rect x="6" y="14" width="62" height="12" rx="5" fill="url(#sv)" stroke="#6b7177"/>
  <path d="M30 14 q8 -12 18 -6 l-4 6z" fill="url(#sv)" stroke="#6b7177"/>
  <rect x="8" y="84" width="58" height="8" rx="3" fill="url(#sv)" stroke="#6b7177"/>
  <g stroke="#9aa1a7" stroke-width="1" opacity=".8"><line x1="18" y1="40" x2="56" y2="40"/><line x1="18" y1="50" x2="56" y2="50"/><line x1="18" y1="60" x2="56" y2="60"/><line x1="18" y1="70" x2="56" y2="70"/></g>
  <text x="37" y="36" font-size="7" text-anchor="middle" fill="#555" font-family="Georgia,serif">CHAMPION</text>
  <text x="37" y="80" font-size="7" text-anchor="middle" fill="#555" font-family="Georgia,serif">2026</text></svg>`;}
function loserSVG(){return '<img class="losercup" src="'+LOSER_CUP+'" alt="The loser\u2019s stein">';}
const LOSER_CUP='data:image/webp;base64,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';
function renderStand(){
  const S=D.standings; let pod='';
  if(S.length){ const top=S[0][2], bot=S[S.length-1][2];
    const leaders=S.filter(r=>r[2]===top).map(r=>r[1]), losers=S.filter(r=>r[2]===bot).map(r=>r[1]);
    pod=`<div class="podium"><div class="pod"><div class="lbl">🏆 Current #1</div>${cupSVG()}<div class="nm">${esc(leaders.join(' & '))}</div><div class="pts">${top} pts</div></div>
      <div class="pod last"><div class="lbl">Last place</div>${loserSVG()}<div class="nm">${esc(losers.join(' & '))}</div><div class="pts">${bot} pts</div></div></div>`; }
  return pod+`<div class="card standtbl" style="margin-bottom:0"><table><thead><tr><th>#</th><th class="l">Name</th><th>Pts</th><th>Behind</th><th>Wks Won</th><th>Won/Lost</th><th>Shots</th><th>HTC</th></tr></thead><tbody>`+
    D.standings.map(r=>`<tr class="${r[3]===0?'top':''}"><td>${r[0]}</td><td class="l">${esc(r[1])}</td><td><b>${r[2]}</b></td><td>${r[3]===0?'—':'−'+Math.abs(r[3])}</td><td>${r[4]}</td><td>${money(r[5])}</td><td>${r[6]?'🥃 '+r[6]:''}</td><td>${r[7]?r[7]:''}</td></tr>`).join('')+
    `</tbody></table><div class="foot" style="margin:10px 8px 14px">1 point per correct pick, 2 for a correct push · Week winner +$85, others −$5 · Correct push +$85, missed push −$5 (and a shot 🥃) · HTC entry −$5</div></div>`;
}

function layout(){
  const hd=document.querySelector('header'), wh=document.querySelector('.wkhead'), r=document.documentElement;
  const hh=hd?hd.offsetHeight:0, ww=wh?wh.offsetHeight:0;
  r.style.setProperty('--hh',(r.classList.contains('shell')?0:hh)+'px'); r.style.setProperty('--stack',(hh+ww)+'px');
}
window.addEventListener('resize',()=>{if(D)layout();});
function weekFinal(w){const gs=D.games.filter(g=>g.week===w);return gs.length>0&&gs.every(g=>g.status==='Final');}
function pickedWeeks(){return D.weeks.filter(w=>D.picks.some(p=>p[0]===w));}
function renderPush(){
  const cell={}, cor={}, mis={};
  D.picks.forEach(([w,n,g,p,pts])=>{ if(p!=='Push'||pts==null) return; const k=w+'|'+n; cell[k]=cell[k]||{c:0,m:0};
    if(pts===2){cell[k].c++;cor[n]=(cor[n]||0)+1;} else if(pts===0){cell[k].m++;mis[n]=(mis[n]||0)+1;} });
  let h='<div class="gridwrap"><table class="grid"><thead><tr><th class="stick">Wk</th>'+D.players.map(n=>`<th>${esc(n)}</th>`).join('')+'</tr></thead><tbody>';
  pickedWeeks().forEach(w=>{ h+=`<tr><td class="stick">${w}</td>`+D.players.map(n=>{const c=cell[w+'|'+n]; if(!c||(c.c+c.m===0)) return '<td></td>';
      const v=c.c-c.m; return `<td class="${v>0?'ok':v<0?'bad':''}">${v>0?'+'+v:v}</td>`;}).join('')+'</tr>'; });
  h+='</tbody><tfoot>'+
    `<tr><td class="stick">Correct</td>${D.players.map(n=>`<td>${cor[n]||0}</td>`).join('')}</tr>`+
    `<tr><td class="stick">Shots 🥃</td>${D.players.map(n=>`<td class="${mis[n]?'bad':''}">${mis[n]||0}</td>`).join('')}</tr>`+
    '</tfoot></table></div><div class="foot">+1 correct push (+$85) · −1 missed push (−$5 and a shot at the season-ending party)</div>';
  return h;
}
function renderHtc(){
  const tot={}; let h='<div class="gridwrap"><table class="grid"><thead><tr><th class="stick">Wk</th>'+D.players.map(n=>`<th>${esc(n)}</th>`).join('')+'</tr></thead><tbody>';
  pickedWeeks().forEach(w=>{ const fin=weekFinal(w);
    h+=`<tr><td class="stick">${w}${fin?'':' ⏳'}</td>`+D.players.map(n=>{ const pts=D.wkPts[w+'|'+n]||0; const inn=fin&&pts<=3; if(inn) tot[n]=(tot[n]||0)+1;
      return `<td class="${inn?'bad':''}">${inn?'HTC':''}</td>`;}).join('')+'</tr>'; });
  h+='</tbody><tfoot>'+`<tr><td class="stick">Entries</td>${D.players.map(n=>`<td class="${tot[n]?'bad':''}">${tot[n]||0}</td>`).join('')}</tr>`+
    '</tfoot></table></div><div class="foot">Hind Tit Club: 3 points or fewer in a week, −$5 per entry (counted once every game that week is final; ⏳ = week in progress)</div>';
  return h;
}

let GI=null, GD=null, GTIMER=null, TN='', HSIDE='a', NEWSOPEN=false, GCTAB=null, PBPF='all', BOXSIDE='a', GCOPEN=false;
function ago(s){ if(!s) return ''; const m=Math.round((Date.now()-new Date(s))/60000); if(isNaN(m)) return ''; if(m<60) return m+'m ago'; if(m<1440) return Math.round(m/60)+'h ago'; return Math.round(m/1440)+'d ago'; }
function newsList(items){ return items.map(a=>`<a href="${esc(a.href||'#')}" target="_blank" rel="noopener" style="display:flex;gap:8px;text-decoration:none;color:inherit;padding:6px 0;border-top:1px solid var(--line)">
   ${a.img?`<img src="${esc(a.img)}" alt="" style="width:64px;height:44px;object-fit:cover;border-radius:6px;flex:none">`:''}
   <span style="flex:1"><b style="font-size:13px">${esc(a.headline)}</b><br><span class="muted" style="font-size:12px">${esc(a.desc).slice(0,140)}${a.published?' · '+ago(a.published):''}</span></span></a>`).join(''); }
function teamNews(side){
  const d=GD||{}, t=side==='a'?d.away:d.home; const el=document.getElementById('tnews');
  if(!t||!t.id){ el.innerHTML='<div class="muted" style="font-size:13px">Team news loads once game details are in.</div>'; return; }
  el.innerHTML='<div class="muted" style="font-size:13px">Loading '+esc(t.name)+' news…</div>';
  google.script.run.withSuccessHandler(j=>{ TN=`<div style="margin-top:8px"><b style="font-size:13px">${esc(t.name)}</b>${newsList(JSON.parse(j))}</div>`; const e2=document.getElementById('tnews'); if(e2) e2.innerHTML=TN; })
    .withFailureHandler(e=>{ TN=`<div class="muted" style="font-size:13px">${esc(e.message)}</div>`; const e2=document.getElementById('tnews'); if(e2) e2.innerHTML=TN; })
    .getTeamNews(t.id, t.name);
}
function fieldSVG(A,H,sit,g){
  const m=String(sit.possessionText||'').match(/^([A-Z]{2,4})\s+(\d{1,2})$/), mid=/^(50|.*\s50)$/.test(String(sit.possessionText||''));
  let pos=null;
  if(m){ const n=Number(m[2]); pos = m[1]===H.abbr ? 100-n : m[1]===A.abbr ? n : null; }
  else if(mid) pos=50;
  if(pos==null) return '';
  const homeHas = sit.possession && sit.possession===H.id, awayHas = sit.possession && sit.possession===A.id;
  const dir = homeHas?-1:awayHas?1:0;
  let ltg=null; const dist=Number(sit.distance); if(dir&&!isNaN(dist)&&dist>0) ltg=Math.max(0,Math.min(100,pos+dir*dist));
  const X=p=>30+p*3, col=c=>c?'#'+c:'#555';
  let yl=''; for(let y=10;y<100;y+=10){ yl+=`<line x1="${X(y)}" y1="6" x2="${X(y)}" y2="104" stroke="rgba(255,255,255,.55)" stroke-width="1"/>`;
    const num=y<=50?y:100-y; yl+=`<text x="${X(y)}" y="98" font-size="9" fill="rgba(255,255,255,.8)" text-anchor="middle" font-family="Arial">${num}</text>`; }
  for(let y=5;y<100;y+=10) yl+=`<line x1="${X(y)}" y1="6" x2="${X(y)}" y2="12" stroke="rgba(255,255,255,.4)"/><line x1="${X(y)}" y1="98" x2="${X(y)}" y2="104" stroke="rgba(255,255,255,.4)"/>`;
  const ez=(x,t)=>`<rect x="${x}" y="4" width="30" height="102" fill="${col(t.color)}"/><text x="${x+15}" y="55" font-size="13" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial" transform="rotate(${x<100?-90:90} ${x+15} 55)" dominant-baseline="middle">${esc(t.abbr||'')}</text>`;
  const arrow = dir? `<path d="M${X(pos)+dir*16} 55 l${-dir*8} -6 v12 z" fill="#fff"/>`:'';
  const ballCol = homeHas?col(H.color):awayHas?col(A.color):'#7b4a1e';
  return `<svg viewBox="0 0 360 110" width="100%" style="margin-top:8px;border-radius:8px;display:block">
    <rect x="0" y="0" width="360" height="110" rx="8" fill="#2e7d32"/>
    <rect x="30" y="4" width="300" height="102" fill="url(#turf)"/>
    <defs><pattern id="turf" width="30" height="110" patternUnits="userSpaceOnUse"><rect width="15" height="110" fill="#2f8236"/><rect x="15" width="15" height="110" fill="#2b7a32"/></pattern></defs>
    ${ez(0,A)}${ez(330,H)}${yl}
    ${pos>=80&&dir===1||pos<=20&&dir===-1?`<rect x="${dir===1?X(80):X(0)}" y="4" width="60" height="102" fill="rgba(255,0,0,.12)"/>`:''}
    <line x1="${X(pos)}" y1="4" x2="${X(pos)}" y2="106" stroke="#4aa3ff" stroke-width="2.5"/>
    ${ltg!=null?`<line x1="${X(ltg)}" y1="4" x2="${X(ltg)}" y2="106" stroke="#ffd400" stroke-width="2.5"/>`:''}
    <ellipse cx="${X(pos)}" cy="55" rx="8" ry="5" fill="#7b4a1e" stroke="${ballCol}" stroke-width="2"/>
    <line x1="${X(pos)-3}" y1="55" x2="${X(pos)+3}" y2="55" stroke="#fff" stroke-width="1"/>
    ${arrow}
  </svg><div class="muted" style="font-size:11px;display:flex;justify-content:space-between;margin-top:3px"><span>◀ ${esc(A.abbr||g.away)} end zone</span><span>🟦 line of scrimmage · 🟨 first down</span><span>${esc(H.abbr||g.home)} end zone ▶</span></div>`;
}
function openGame(gi){GI=gi;GD=null;TN='';HSIDE='a';NEWSOPEN=false;GCTAB=null;PBPF='all';BOXSIDE='a';GCOPEN=false;document.getElementById('modal').classList.remove('hidden');document.body.style.overflow='hidden';drawDetail();loadDetail();}
(function(){                       // swipe down on the details panel to close it
  let y0=null, dy=0, sheet=null;
  document.addEventListener('touchstart',e=>{ sheet=e.target.closest&&e.target.closest('.sheetm'); if(!sheet||GI==null) return;
    const fromHead=!!e.target.closest('.mhead'); if(!fromHead&&sheet.scrollTop>0){ y0=null; return; }
    y0=e.touches[0].clientY; dy=0; sheet.classList.add('dragging'); },{passive:true});
  document.addEventListener('touchmove',e=>{ if(y0==null||!sheet) return; dy=e.touches[0].clientY-y0;
    if(dy>0){ sheet.style.transform=`translateY(${dy}px)`; if(e.cancelable) e.preventDefault(); } },{passive:false});
  document.addEventListener('touchend',()=>{ if(y0==null||!sheet) return; sheet.classList.remove('dragging');
    if(dy>110){ sheet.style.transform='translateY(100%)'; setTimeout(()=>{ closeGame(); sheet.style.transform=''; },180); }
    else sheet.style.transform=''; y0=null; dy=0; });
})();
function closeGame(){GI=null;document.getElementById('modal').classList.add('hidden');document.body.style.overflow='';if(GTIMER){clearTimeout(GTIMER);GTIMER=null;}}
function loadDetail(){
  if(GI==null) return; const g=D.games[GI]; const b=document.getElementById('mref'); b.textContent='…';
  google.script.run.withSuccessHandler(j=>{ if(GI==null||D.games[GI]!==g) return; GD=JSON.parse(j); b.textContent='↻'; drawDetail();
      if(GTIMER) clearTimeout(GTIMER); if(GD.state==='in') GTIMER=setTimeout(loadDetail,20000); })
    .withFailureHandler(e=>{ b.textContent='↻'; GD={error:e.message}; drawDetail(); })
    .getGameDetail(g.week,g.espnHome);
}
function toDots(n){n=(n==null||n==='')?null:Number(n); if(n==null) return ''; let s='<span class="to">'; for(let i=0;i<3;i++) s+=`<i class="${i<n?'':'u'}"></i>`; return s+'</span>';}

function setHist(side){ HSIDE=side; drawDetail(); }
function teamHistory(t){
  const rows=D.games.filter(g=>g.status==='Final'&&(g.away===t||g.home===t)&&g.as!==''&&g.hs!=='').sort((a,b)=>b.week-a.week);
  let su=[0,0,0], ats=[0,0,0];
  const body=rows.map(g=>{
    const home=g.home===t, opp=home?g.away:g.home, ts=Number(home?g.hs:g.as), os=Number(home?g.as:g.hs);
    const r=ts>os?'w':ts<os?'l':'p'; su[r==='w'?0:r==='l'?1:2]++;
    let line='—', c='';
    if(g.spread!==''){ const fav=g.dog===g.home?g.away:g.home; const sp=Number(g.spread);
      line=sp===0?'PK':(t===fav?'−':'+')+sp; c=g.winner===t?'w':g.winner==='Push'?'p':'l'; ats[c==='w'?0:c==='l'?1:2]++; }
    const icon=k=>k?`<span class="ic ${k}">${k==='w'?'✓':k==='l'?'✕':'–'}</span>`:'';
    return `<tr><td class="l">Wk ${g.week}</td><td class="l">${home?'vs':'@'}</td><td class="l"><span class="opp">${logo(opp)}${esc(opp)}</span></td>
      <td class="l">${icon(r)}${ts}-${os}</td><td class="l">${icon(c)}${line}</td></tr>`; }).join('');
  const rec=a=>a[0]+'-'+a[1]+(a[2]?'-'+a[2]:'');
  return {body, n:rows.length, sum:`Straight up ${rec(su)} · Against the spread ${rec(ats)}`};
}
function historySection(g){
  const t=HSIDE==='h'?g.home:g.away, h=teamHistory(t);
  return `<div class="sec"><h3>${SEASON_YEAR} season</h3>
    <div class="seg" style="margin-bottom:6px"><button class="${HSIDE==='a'?'on':''}" onclick="setHist('a')">${esc(g.away)}</button><button class="${HSIDE==='h'?'on':''}" onclick="setHist('h')">${esc(g.home)}</button></div>
    <div class="histsum">${esc(t)} · ${h.sum}</div>
    ${h.n?`<div style="overflow-x:auto"><table class="hist"><thead><tr><th class="l">Wk</th><th></th><th class="l">Opponent</th><th class="l">Result</th><th class="l">Spread</th></tr></thead><tbody>${h.body}</tbody></table></div>`
      :'<div class="muted" style="font-size:13px">No completed games yet this season.</div>'}
    <div class="foot" style="margin:6px 0 0;text-align:left">Spread = the league’s locked line for that game (✓ covered · ✕ didn’t · – push).</div></div>`;
}
function splitBar(g,grp){
  const tot=grp.a.length+grp.h.length+grp.p.length; if(!tot) return '';
  const pa=Math.round(100*grp.a.length/tot), ph=Math.round(100*grp.h.length/tot), pp=Math.round(100*grp.p.length/tot);
  const bar=(t,p,side)=>{ const c=teamColor(t), b=`<div class="sbar" style="width:calc(${p}% * .78);background:${c}"></div>`, l=`<span class="slogo">${logo(t)}</span>`;
    return `<div class="shalf ${side}">${side==='l'?l+b:b+l}</div>`; };
  return `<div class="split"><span class="spct">${pa}%</span>${bar(g.away,pa,'l')}<div class="smid"></div>${bar(g.home,ph,'r')}<span class="spct">${ph}%</span></div>
    <div class="ssub muted">${grp.a.length} picked ${esc(g.away)} · ${grp.h.length} picked ${esc(g.home)}${grp.p.length?` · ${grp.p.length} push (${pp}%)`:''}</div>`;
}
function gcPos(A,H,sit){
  const t=String(sit.possessionText||''), m=t.match(/^([A-Z]{2,4})\s+(\d{1,2})$/);
  if(m){ const n=Number(m[2]); return m[1]===H.abbr?100-n:m[1]===A.abbr?n:null; }
  return /(^|\s)50$/.test(t)?50:null;
}
let ANIMSEEN={}, LASTLBL='';
const FP=520, FA=38*Math.PI/180, FH=96;
function fScale(v){ return FP/(FP+v*Math.sin(FA)); }                       // v = depth into the field (0 = near edge, 96 = far edge)
function fx(pct,v){ return 50+(pct-50)*fScale(v); }                          // flat % → on-screen % at that depth
function fy(v){ return FH/2+((FH-v*Math.cos(FA))-FH/2)*fScale(v); }         // on-screen px from the top of the field box
const MIDV=FH/2;                                                             // the ball and goal posts sit at mid-depth   // last play already animated, per game (replays only when a new play comes in)
function goalPost(leftPct){ const flip=leftPct>50;
  // ESPN-style: padded base sits BEHIND the end zone; the gooseneck curves forward so the crossbar and
  // uprights stand directly over the back line of the end zone (the svg's center, x=20, is placed on that line).
  return `<svg class="gpost${flip?' r':''}" style="left:${leftPct}%" viewBox="0 0 40 100" aria-hidden="true">
    <rect x="3.5" y="84" width="6" height="15" rx="2" fill="#6b7280"/>
    <path d="M6.5 84 V70 C6.5 62 10 59 15 58" stroke="#e8c234" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M14 60 L27 52 M14 60 V10 M27 52 V2" stroke="#e8c234" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
const MINI_BALL='<ellipse cx="0" cy="0" rx="9" ry="5.5" fill="#8B4A1C" stroke="#fff" stroke-width="1.2"/><path d="M-3 0 H3 M-1.5 -1.6 V1.6 M0 -1.6 V1.6 M1.5 -1.6 V1.6" stroke="#fff" stroke-width=".9"/>';
function playOverlay(pos,dir,sit,X,poss,A,H){
  if(pos==null) return '';
  const W=400, GY=fy(MIDV), x=p=>fx(X(Math.max(0,Math.min(100,p))),MIDV)*W/100, bx=x(pos);
  const txt=String(sit.lastPlay||''), num=(m=>m?Number(m[1]):null)(txt.match(/(\d+)[\s-]*(?:yd|yard)/i));
  const type=String(sit.lastPlayType||''), yds=sit.lastPlayYards, sameTeam=!sit.lastPlayTeam||sit.lastPlayTeam===poss;
  const isInc=/incomplet/i.test(type), isPass=/pass/i.test(type)&&!/interception/i.test(type), isRun=/rush|run/i.test(type)&&!/fumble/i.test(type);
  let path='', endX=bx, endY=GY, kind='', kickGood=false;
  const kdir=sit.lastPlayTeam&&H&&sit.lastPlayTeam===H.id?-1:(sit.lastPlayTeam&&A&&sit.lastPlayTeam===A.id?1:0);   // kicking team's direction
  const isFG=/field goal/i.test(type), isPunt=/punt/i.test(type)&&!/block/i.test(type);
  if(isFG&&kdir){
    const dist=(yds!=null&&!isNaN(yds)&&yds>10)?yds:num; if(dist){
      const spot=kdir>0?100-(dist-10):(dist-10), s=x(spot), post=(kdir>0?fx(100,MIDV):fx(0,MIDV))*W/100;
      kickGood=/good/i.test(type+' '+txt)&&!/no good|miss|block/i.test(type+' '+txt);
      endX=kickGood?post:post+(kdir>0?-6:6); endY=kickGood?GY-50:GY-30;
      path=`M${s} ${GY} Q${(s+endX)/2} -60 ${endX} ${endY}`; kind='fg'; }
  }
  else if(isPunt&&kdir){
    const dist=(yds!=null&&!isNaN(yds)&&yds>0)?yds:num; if(dist){
      const e=bx, s=x(pos-kdir*dist); path=`M${s} ${GY} Q${(s+e)/2} -50 ${e} ${GY}`; endX=e; kind='punt'; }
  }
  else if(dir&&sameTeam&&isPass&&isInc){ const s=bx, e=x(pos+dir*12); path=`M${s} ${GY} Q${(s+e)/2} -22 ${e} ${GY}`; endX=e; kind='inc'; }
  else if(dir&&sameTeam&&(isPass||isRun)&&yds!=null&&!isNaN(yds)&&yds!==0){ const s=x(pos-dir*yds); path=isPass?`M${s} ${GY} Q${(s+bx)/2} -22 ${bx} ${GY}`:`M${s} ${GY} L${bx} ${GY}`; kind=isPass?'pass':'run'; }
  const key=(GI==null?'':GI)+'|'+(sit.lastPlayId||sit.lastPlay||''), fresh=kind&&ANIMSEEN[GI]!==key; if(kind) ANIMSEEN[GI]=key;
  const D1=kind==='run'?'1.1s':(kind==='fg'||kind==='punt')?'1.8s':'1.4s', id='pm'+Math.random().toString(36).slice(2,8);
  let svg=`<svg class="gplay" viewBox="0 0 ${W} 96" preserveAspectRatio="none" aria-hidden="true">`;
  if(kind){
    const sx=Number(path.split(' ')[0].slice(1));
    svg+=`<defs><clipPath id="${id}"><rect x="${Math.min(sx,endX)}" y="-80" height="200" width="${fresh?0:Math.abs(endX-sx)}">${fresh?`<animate attributeName="width" from="0" to="${Math.abs(endX-sx)}" dur="${D1}" fill="freeze"/>${endX<sx?`<animate attributeName="x" from="${sx}" to="${endX}" dur="${D1}" fill="freeze"/>`:''}`:''}</rect></clipPath></defs>
      <path d="${path}" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="5 5" stroke-linecap="round" clip-path="url(#${id})" opacity=".9" vector-effect="non-scaling-stroke"/>`;
    const fades=kind==='inc'||kind==='fg';
    if(fresh) svg+=`<g>${MINI_BALL}<animateMotion dur="${D1}" fill="freeze" ${kind==='run'?'':'rotate="auto"'} path="${path}"/>${fades?`<animate attributeName="opacity" values="1;1;0" keyTimes="0;.9;1" dur="${D1}" fill="freeze"/>`:''}</g>`;
    if(kind==='inc'||(kind==='fg'&&!kickGood)) svg+=`<g transform="translate(${endX} ${kind==='fg'?endY:GY})" opacity="${fresh?0:1}">${fresh?`<animate attributeName="opacity" from="0" to="1" begin="${D1}" dur=".2s" fill="freeze"/>`:''}<path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="#e5484d" stroke-width="4" stroke-linecap="round"/></g>`;
  }
  if(kind==='fg'&&kickGood) svg+=`<g transform="translate(${endX+(endX>200?-14:14)} ${GY-54})" opacity="${fresh?0:1}">${fresh?`<animate attributeName="opacity" from="0" to="1" begin="${D1}" dur=".2s" fill="freeze"/>`:''}<circle r="7" fill="#2e7d32"/><path d="M-3.5 0 L-1 2.8 L3.8 -2.6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
  // the ball sits on the line of scrimmage (appears there once the play animation finishes)
  svg+=`<g transform="translate(${bx} ${GY})" opacity="${fresh&&kind!=='inc'?0:1}">${fresh&&kind!=='inc'?`<animate attributeName="opacity" from="0" to="1" begin="${D1}" dur=".15s" fill="freeze"/>`:''}${MINI_BALL}</g></svg>`;
  LASTLBL=kind==='fg'?(kickGood?'Field goal — good':'Field goal — no good'):kind==='punt'?'Punt':kind?(kind==='inc'?'Incomplete pass':kind==='pass'?'Pass +'+yds:'Run '+(yds>0?'+':'')+yds):'';
  return svg;
}
function gamecast(A,H,sit,g,d){
  const pos=gcPos(A,H,sit), homeHas=sit.possession&&sit.possession===H.id, awayHas=sit.possession&&sit.possession===A.id;
  const posTeam=homeHas?g.home:awayHas?g.away:null, dir=homeHas?-1:awayHas?1:0;
  const X=p=>8+p*0.84;   // % across the field image (8% end zones)
  const dist=Number(sit.distance); const ltg=(pos!=null&&dir&&!isNaN(dist)&&dist>0)?Math.max(0,Math.min(100,pos+dir*dist)):null;
  const mascot=t=>String((t&&t.name)||'').split(' ').slice(-1)[0].toUpperCase();
  const ez=(side,t,team)=>`<div class="ez ${side}" style="background:${teamColor(team)};color:${inkOn(teamColor(team))}"><span>${esc(mascot(t)||team)}</span></div>`;
  let lines=''; for(let y=10;y<100;y+=10) lines+=`<i class="yl${y===50?' mid':''}" style="left:${X(y)}%"></i>`;
  const arrow=(pos!=null&&dir)?`<i class="garrow ${dir<0?'left':'right'}" style="left:${dir<0?X(Math.max(0,pos-14)):X(pos)}%;width:${0.84*Math.min(14,dir<0?pos:100-pos)}%"></i>`:'';
  const lastPlayTeam=posTeam?logo(posTeam):'';
  return `<div class="gc">
    <div class="gchead">${lastPlayTeam}<div><b>CURRENT DRIVE</b><div class="muted">${esc((d.drive&&d.drive.desc)||'')}</div></div>${sit.isRedZone?'<span class="rz">RED ZONE</span>':''}</div>
    <div class="gcdd"><div><span class="muted">Down:</span><b>${esc(sit.downDistanceText||'—').replace(/\s+at\s+.*$/,'')}</b></div><div><span class="muted">Ball on:</span><b>${esc(sit.possessionText||'—')}</b></div></div>
    ${pos!=null?`<div class="gfield"><div class="gplane">${ez('l',A,g.away)}${ez('r',H,g.home)}${lines}
        <i class="los" style="left:${X(pos)}%"></i>${ltg!=null?`<i class="fdl" style="left:${X(ltg)}%"></i>`:''}${arrow}</div>
      ${posTeam?`<div class="gpin" style="left:${fx(X(pos),FH)}%"><span>${logo(posTeam)}</span></div>`:''}
      ${goalPost(fx(0,MIDV))}${goalPost(fx(100,MIDV))}${playOverlay(pos,dir,sit,X,sit.possession,A,H)}</div>
      <div class="gnums"><span style="left:4%">${esc(A.abbr||'')}</span><span style="left:${X(20)}%">20</span><span style="left:${X(50)}%">50</span><span style="left:${X(80)}%">20</span><span style="left:96%">${esc(H.abbr||'')}</span></div>`:''}
    ${sit.lastPlay?`<div class="lp gclp"><b>Last play</b>${LASTLBL?` <span class="gplbl">${esc(LASTLBL)}</span>`:''}<div>${esc(sit.lastPlay)}</div></div>`:''}
    <table style="margin-top:6px"><tr><td class="l">${esc(g.away)} timeouts</td><td>${toDots(sit.awayTimeouts)}</td></tr><tr><td class="l">${esc(g.home)} timeouts</td><td>${toDots(sit.homeTimeouts)}</td></tr></table>
    ${d.drive&&d.drive.plays&&d.drive.plays.length?`<details class="drivebox"><summary>Drive plays (${d.drive.plays.length})</summary><ul>${d.drive.plays.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></details>`:''}</div>`;
}

/* ---------- game center (live + final) ---------- */
function setGc(t){GCTAB=t;drawDetail();}
function setPbp(f){PBPF=f;drawDetail();}
function setBox(s){BOXSIDE=s;drawDetail();}
const qName=q=>({1:'1st quarter',2:'2nd quarter',3:'3rd quarter',4:'4th quarter'})[q]||(q>4?'Overtime':'');
function teamByAbbr(ab,A,H,g){ return ab===A.abbr?g.away:ab===H.abbr?g.home:null; }
function lineScore(A,H,g,aSc,hSc){
  const al=A.lines||[], hl=H.lines||[]; const n=Math.max(al.length,hl.length,4);
  const hd=[...Array(n)].map((_,i)=>`<th>${i<4?i+1:'OT'}</th>`).join('');
  const rw=(t,ab,arr,sc)=>`<tr><td class="l"><span class="opp">${logo(t)}<b>${esc(ab||t)}</b></span></td>${[...Array(n)].map((_,i)=>`<td>${arr[i]!=null?arr[i]:''}</td>`).join('')}<td><b>${sc}</b></td></tr>`;
  return `<div style="overflow-x:auto"><table class="lsc"><thead><tr><th class="l"></th>${hd}<th>T</th></tr></thead>${rw(g.away,A.abbr,al,aSc)}${rw(g.home,H.abbr,hl,hSc)}</table></div>`;
}
function boxTab(d,g){
  const sides=d.box||[]; if(!sides.length) return '<div class="muted gcempty">Player stats will show up once the game is underway.</div>';
  const side=BOXSIDE==='h'?(sides.find(s=>s.teamId===d.home.id)||sides[1]):(sides.find(s=>s.teamId===d.away.id)||sides[0]); if(!side) return '';
  const t=BOXSIDE==='h'?g.home:g.away;
  return `<div class="seg"><button class="${BOXSIDE==='a'?'on':''}" onclick="setBox('a')">${logo(g.away)} ${esc(g.away)}</button><button class="${BOXSIDE==='h'?'on':''}" onclick="setBox('h')">${logo(g.home)} ${esc(g.home)}</button></div>`+
    side.cats.map(c=>`<div class="bxh">${logo(t)} ${esc(/^[A-Z]/.test(c.label)&&c.label.indexOf(' ')>0?c.label:esc(t)+' '+c.label)}</div>
      <div class="bxwrap"><table class="bx"><thead><tr><th class="l"></th>${c.labels.map(l=>`<th>${esc(l)}</th>`).join('')}</tr></thead><tbody>
      ${c.rows.map(r=>`<tr><td class="l"><b>${esc(r.name)}</b>${r.jersey?` <span class="muted">#${esc(r.jersey)}</span>`:''}</td>${r.stats.map(s=>`<td>${esc(s)}</td>`).join('')}</tr>`).join('')}
      ${c.totals&&c.totals.length&&c.totals.some(x=>x!=='')?`<tr class="tot"><td class="l">TEAM</td>${c.totals.map(s=>`<td>${esc(s)}</td>`).join('')}</tr>`:''}</tbody></table></div>`).join('');
}
function playRow(p,A,H,g){ const t=teamByAbbr(p.team,A,H,g);
  return `<div class="kp">${t?logo(t):'<span class="logo"></span>'}<div class="kpt"><div class="muted">${p.q?(p.q>4?'OT':'Q'+p.q):''} ${esc(p.clock||'')}${p.type?' · '+esc(p.type):''}</div>${esc(p.text)}</div><div class="kps">${p.away!=null?p.away+'–'+p.home:''}</div></div>`; }
function pbpTab(d,A,H,g){
  const seg=`<div class="seg"><button class="${PBPF==='all'?'on':''}" onclick="setPbp('all')">All plays</button><button class="${PBPF==='scoring'?'on':''}" onclick="setPbp('scoring')">Scoring plays</button><button class="${PBPF==='key'?'on':''}" onclick="setPbp('key')">Key plays</button></div>`;
  if(PBPF==='scoring'){ const s=(d.scoring||[]); return seg+(s.length?s.map(p=>playRow({...p,type:''},A,H,g)).join(''):'<div class="muted gcempty">No scoring yet.</div>'); }
  if(PBPF==='key'){ const k=(d.keyPlays||[]); return seg+(k.length?k.map(p=>playRow(p,A,H,g)).join(''):'<div class="muted gcempty">No key plays yet.</div>'); }
  let drives=(d.pbp||[]).slice(); if(!drives.length) return seg+'<div class="muted gcempty">Plays will show up once the game starts.</div>';
  const live=d.state==='in'; if(live) drives.reverse();   // newest drive first while the game is on
  let lastQ=null, out='';
  drives.forEach((dr,i)=>{ if(dr.q!==lastQ){ out+=`<div class="pbq">${esc(qName(dr.q))}</div>`; lastQ=dr.q; }
    const t=teamByAbbr(dr.team,A,H,g), plays=live?dr.plays.slice().reverse():dr.plays;
    out+=`<details class="drv"${live&&i===0?' open':''}><summary>${t?logo(t):'<span class="logo"></span>'}<div class="drt"><b>${esc(dr.result||'Drive')}</b><div class="muted">${esc(dr.desc)}</div></div>
      <div class="dsc"><b>${dr.away!=null?dr.away:''}</b><b>${dr.home!=null?dr.home:''}</b><span>${esc(A.abbr)}</span><span>${esc(H.abbr)}</span></div><span class="chev">▾</span></summary>
      <ul>${plays.map(p=>`<li class="${p.scoring?'scr':''}"><span class="muted">${p.dd?esc(p.dd)+' · ':''}${esc(p.clock)}</span><br>${esc(p.text)}</li>`).join('')}</ul></details>`; });
  return seg+out;
}
function statsTab(d,g){
  const s=d.teamStats||[]; if(!s.length) return '<div class="muted gcempty">Team stats will show up once the game is underway.</div>';
  return `<table class="tstat"><thead><tr><th class="l"></th><th>${logo(g.away)}</th><th>${logo(g.home)}</th></tr></thead><tbody>${s.map(r=>`<tr><td class="l">${esc(r.label)}</td><td>${esc(r.a)}</td><td>${esc(r.h)}</td></tr>`).join('')}</tbody></table>`;
}
const OUT_RE=new RegExp('out|ir|injured|doubtful','i');
function isOutStatus(s){ return OUT_RE.test(String(s||'')); }
function leadersHTML(d,A,H,g){
  if(!(d.leaderPairs&&d.leaderPairs.length)) return '';
    const who=(p,side)=>{ if(!p) return `<div class="lside ${side}"><div class="muted">—</div></div>`;
      const pic=p.headshot?`<img class="hs" src="${esc(p.headshot)}" alt="">`:`<div class="hs"></div>`;
      const top=side==='a'?`${pic}<span class="lv">${esc(p.value)}</span>`:`<span class="lv">${esc(p.value)}</span>${pic}`;
      return `<div class="lside ${side}"><div class="ltop">${top}</div>
        <div class="ln"><b>${esc(p.name)}</b> <span class="muted">${esc(p.pos)}</span>${isOutStatus(p.injured)?' <span class="inj">'+esc(p.injured==='Injured Reserve'?'IR':p.injured)+'</span>':''}</div>
        <div class="ld2 muted">${esc(p.detail)}</div></div>`; };
    return `<div class="ldblock"><div class="pvh">${esc(d.leadersTitle||'Leaders')}</div>
      <div class="lhead"><span>${logo(g.away)} <b>${esc(A.abbr||g.away)}</b></span><span><b>${esc(H.abbr||g.home)}</b> ${logo(g.home)}</span></div>`+
      d.leaderPairs.map(r=>`<div class="lrow">${who(r.away,'a')}<div class="lcat">${esc(r.label)}</div>${who(r.home,'h')}</div>`).join('')+'</div>';
}
function predictorHTML(d,g){
  const p=d.predictor; if(!p) return '';
  const pa=Math.max(0,Math.min(100,Number(p.away)||0)), ph=Math.max(0,Math.min(100,Number(p.home)||0)), C=2*Math.PI*54;
  const ca=teamColor(g.away), ch=teamColor(g.home);
  return `<div class="pvh">Matchup predictor</div><div class="pred"><div class="pp l"><b>${pa.toFixed(1)}%</b><span>${esc(g.away)}</span></div>
    <svg viewBox="0 0 140 140" class="donut"><circle cx="70" cy="70" r="54" fill="none" stroke="var(--line)" stroke-width="14"/>
      <circle cx="70" cy="70" r="54" fill="none" stroke="${ch}" stroke-width="14" stroke-dasharray="${C*ph/100} ${C}" transform="rotate(-90 70 70)"/>
      <circle cx="70" cy="70" r="54" fill="none" stroke="${ca}" stroke-width="14" stroke-dasharray="${C*pa/100} ${C}" transform="rotate(${-90+360*ph/100} 70 70)"/>
      <line x1="70" y1="40" x2="70" y2="100" stroke="var(--line)" stroke-dasharray="2 3"/></svg>
    <div class="dlogos">${logo(g.away)}${logo(g.home)}</div><div class="pp r"><b>${ph.toFixed(1)}%</b><span>${esc(g.home)}</span></div></div>
    <div class="muted" style="font-size:12px;text-align:center">According to ESPN Analytics</div>`;
}
function injuriesHTML(d,g){
  const t=d.injuries||[]; if(!t.length) return '';
  const RED=new RegExp('out|ir|reserve|doubtful','i'), ORANGE=new RegExp('question','i');
  const dot=function(s){ return RED.test(s)?'#d64545':(ORANGE.test(s)?'#f59e0b':'#3fa34d'); };
  const sideTeam=x=>x.teamId===d.away.id?g.away:x.teamId===d.home.id?g.home:x.team;
  return `<div class="pvh">Injury report</div>`+t.map(x=>`<div class="injt">${logo(sideTeam(x))}<b>${esc(x.team||sideTeam(x))}</b></div>
    <table class="injtbl"><thead><tr><th class="l">Name</th><th class="l">Status</th><th>Est. return</th></tr></thead><tbody>${x.list.map(i=>`<tr>
      <td class="l"><span class="injn">${i.headshot?`<img src="${esc(i.headshot)}" alt="">`:'<span class="hsx"></span>'}<span><b>${esc(i.name)}</b><br><span class="muted">${esc(i.pos)}</span></span></span></td>
      <td class="l"><b><i class="sdot" style="background:${dot(i.status)}"></i>${esc(i.status)}</b><br><span class="muted">${esc(i.part)}</span></td><td>${esc(i.ret||'—')}</td></tr>`).join('')}</tbody></table>`).join('');
}
function paraHTML(p){ return p.indexOf('## ')===0 ? '<h4>'+esc(p.slice(3))+'</h4>' : '<p>'+esc(p)+'</p>'; }
function articleHTML(r){
  // The ESPN player markup comes from the server (v.embedHtml) — keeping it out of this file avoids
  // Google's page server altering it, which previously broke the whole app.
  const VT='vid'+'eo', v=r.video;
  let media='';
  if(v&&v.url) media='<'+VT+' class="rcv" controls playsinline preload="none"'+(v.poster?' poster="'+esc(v.poster)+'"':'')+' src="'+esc(v.url)+'"></'+VT+'>'+(v.title?'<div class="rcvt">'+esc(v.title)+'</div>':'');
  else if(v&&v.embedHtml) media='<div class="rcvf">'+v.embedHtml+'</div>'+(v.title?'<div class="rcvt">'+esc(v.title)+'</div>':'');
  else if(v&&v.web) media='<a class="rcvl" href="'+esc(v.web)+'" target="_blank" rel="noopener">'+(v.poster?'<img src="'+esc(v.poster)+'" alt="">':'')+'<span>▶ '+esc(v.title||'Watch on ESPN')+'</span></a>';
  else if(r.image) media='<img class="rci" src="'+esc(r.image)+'" alt="">';
  return {media, text:`${r.headline?`<h2 class="rch">${esc(r.headline)}</h2>`:''}${r.byline?`<div class="muted" style="font-size:12px;margin:-4px 0 8px">${esc(r.byline)}</div>`:''}
    <div class="rcb">${(r.paragraphs||[]).map(paraHTML).join('')}</div>${r.link?`<a href="${esc(r.link)}" target="_blank" rel="noopener" style="font-size:13px">Read on ESPN ›</a>`:''}`};
}
function previewTab(d,g){
  const a=d.preview?articleHTML(d.preview):null;
  const parts=[a?a.media:'', a?a.text:''].filter(Boolean);
  return parts.length?parts.join('<div class="pvsep"></div>'):'<div class="muted gcempty">ESPN usually posts the preview video and article a few days before kickoff.</div>';
}
function recapTab(d){
  const r=d.recap; if(!r) return '<div class="muted gcempty">The recap is usually posted shortly after the game ends.</div>';
  const a=articleHTML(r); return a.media+a.text;
}
function gameCenter(A,H,sit,g,d,aSc,hSc){
  const live=d.state==='in', pre=d.state!=='in'&&d.state!=='post';
  const tabs=[];
  if(pre) tabs.push(['gc','Gamecast'],['preview','Preview']);
  else { if(d.state==='post'&&d.recap) tabs.push(['recap','Recap']); tabs.push(['gc','Gamecast'],['box','Box score'],['pbp','Play-by-play'],['stats','Team stats']); }
  if(!GCTAB||!tabs.find(t=>t[0]===GCTAB)) GCTAB=tabs[0][0];
  const lead=leadersHTML(d,A,H,g);
  const gcParts=[live&&sit?gamecast(A,H,sit,g,d):'', lead, pre?predictorHTML(d,g):'', pre?injuriesHTML(d,g):''].filter(Boolean);
  const gcBody=gcParts.join('<div class="pvsep"></div>')||'<div class="muted gcempty">Gamecast details will show up closer to kickoff.</div>';
  const body=GCTAB==='gc'?gcBody:GCTAB==='preview'?previewTab(d,g):GCTAB==='box'?boxTab(d,g):GCTAB==='pbp'?pbpTab(d,A,H,g):GCTAB==='stats'?statsTab(d,g):recapTab(d);
  const inner=`${pre?'':lineScore(A,H,g,aSc,hSc)}<div class="gctabs">${tabs.map(([k,l])=>`<button class="${GCTAB===k?'on':''}" onclick="setGc('${k}')">${l}</button>`).join('')}</div><div class="gcbody">${body}</div>`;
  if(live) return `<div class="sec"><h3>Live</h3>${inner}</div>`;
  return `<details class="sec gcbox" ${GCOPEN?'open':''} ontoggle="GCOPEN=this.open"><summary><h3>Game center</h3><span class="chev">▶</span></summary>${inner}</details>`;
}
function drawDetail(){
  if(GI==null) return; const g=D.games[GI], d=GD||{}, fin=g.status==='Final';
  const A=d.away||{}, H=d.home||{};
  document.getElementById('mtitle').textContent=`Week ${g.week}`;
  const aSc=A.score!=null&&A.score!==''?A.score:g.as, hSc=H.score!=null&&H.score!==''?H.score:g.hs;
  const sit=d.situation||null, possId=sit&&sit.possession;
  const tm=(t,info,sc,side)=>`<div class="tm${possId&&info.id===possId?' pos':''}">${info.logo?`<img src="${esc(info.logo)}" alt="">`:logo(t)}
      <div class="nm">${esc(t)}</div><div class="rc">${esc(info.record||(D.records||{})[t]||'')}</div></div>`;
  let h=`<div class="sec"><div class="sb">${tm(g.away,A,aSc,'a')}<div><span class="sc">${aSc===''?'–':aSc}</span> <span class="muted">–</span> <span class="sc">${hSc===''?'–':hSc}</span></div>${tm(g.home,H,hSc,'h')}</div>
     <div class="sub">${esc(d.detail||g.status)}${d.venue?' · '+esc(d.venue):''}${d.broadcast?' · '+esc(d.broadcast):''}</div></div>`;
  // spread
  const fav=g.spread!==''?(g.dog===g.home?g.away:g.home):null;
  h+=`<div class="sec"><h3>Against the spread</h3><table><tr><td class="l">Locked line</td><td>${fav?esc(fav)+' −'+g.spread:'—'}</td></tr>
     ${g.aadj!==''?`<tr><td class="l">Adjusted score</td><td>${esc(g.away)} ${g.aadj} – ${g.hadj} ${esc(g.home)}</td></tr>`:''}
     ${g.winner?`<tr><td class="l">${fin?'Covered':'Covering now'}</td><td><b>${esc(g.winner)}</b></td></tr>`:''}
     ${dkText(g)?`<tr><td class="l">${isStarted(g)?'DK line at close':'Current DK line'}</td><td>${dkText(g).replace(/^<span class="dknow">.*?<\/span> /,'')}</td></tr>`:''}</table></div>`;
  if(d.error) h+=`<div class="sec muted">Couldn’t load live details: ${esc(d.error)}</div>`;
  else if(!GD) h+=`<div class="sec">${spinner('Loading game details…',1)}</div>`;
  // game center: gamecast · box score · play-by-play · team stats · recap (stays here after the game)
  if(GD&&!d.error) h+=gameCenter(A,H,sit,g,d,aSc,hSc);
  h+=historySection(g);
  // news
  h+=`<details class="sec newsbox" ${NEWSOPEN?'open':''} ontoggle="NEWSOPEN=this.open"><summary><h3>News</h3><span class="chev">▶</span></summary>${d.news&&d.news.length?newsList(d.news):(GD&&!d.error?'<div class="muted" style="font-size:13px">No game articles yet.</div>':'')}
     <div class="acts" style="margin-top:8px"><a href="#" onclick="teamNews('a');return false;">📰 ${esc(g.away)}</a><a href="#" onclick="teamNews('h');return false;">📰 ${esc(g.home)}</a></div>
     <div id="tnews">${TN?TN:''}</div></details>`;
  // who picked
  const grp=pickGroups(g); const chips=(arr,team)=>arr.map(n=>`<span class="chip${fin&&g.winner===team?' ok':''}">${esc(n)}</span>`).join('')||'<span class="chip">—</span>';
  if(!picksVisible(g)) h+=`<div class="sec"><h3>Who picked</h3><div class="muted" style="font-size:13px"><svg class="lockic" viewBox="0 0 11 12" aria-hidden="true"><rect x="1" y="5" width="9" height="7" rx="1.5" fill="currentColor"/><path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>Picks are revealed when this game kicks off.</div></div>`;
  else h+=`<div class="sec"><h3>Who picked</h3>${splitBar(g,grp)}<div class="who" style="border:0;padding:0"><div class="lbl">${esc(g.away)}</div>${chips(grp.a,g.away)}
     <div class="lbl">${esc(g.home)}</div>${chips(grp.h,g.home)}${grp.p.length?`<div class="lbl">Push</div>${chips(grp.p,'Push')}`:''}
     ${grp.n.length?`<div class="lbl">No pick</div>${grp.n.map(n=>`<span class="chip">${esc(n)}</span>`).join('')}`:''}</div></div>`;
  document.getElementById('mbody').innerHTML=h;
}

const FLAGS={'england':'gb-eng','united kingdom':'gb','uk':'gb','scotland':'gb-sct','wales':'gb-wls','ireland':'ie','germany':'de','brazil':'br','spain':'es',
  'mexico':'mx','france':'fr','australia':'au','italy':'it','canada':'ca','netherlands':'nl','japan':'jp'};
function isIntl(ev){const c=String(ev.country||'').toLowerCase(); return c&&!['usa','us','united states','united states of america'].includes(c);}
function flagBadge(country){const code=FLAGS[String(country).toLowerCase()]; return code?`<span class="flag" title="${esc(country)}"><img src="https://flagcdn.com/w80/${code}.png" alt="${esc(country)}"></span>`:`<span class="pill" style="margin-left:6px">${esc(country)}</span>`;}
function byesFor(w){ const play={}; D.games.filter(g=>g.week===w).forEach(g=>{play[g.away]=1;play[g.home]=1;});
  return Object.keys(D.logos||{}).filter(t=>!play[t]).sort(); }
function byeLine(w){ const b=byesFor(w); return `<div class="sec byeline" style="font-size:13px"><b>Bye week:</b> ${b.length?b.map(t=>`${logo(t)} ${esc((D.abbrs||{})[t]||t)}`).join(' · '):'<span class="muted">No teams with a bye</span>'}</div>`; }
function lineFromSheet(g){   // e.g. "CHI -3" from the stored home-team line (used once ESPN stops showing odds)
  if(!g||g.line==null) return ''; const ab=t=>(D.abbrs||{})[t]||t;
  return g.line===0?'PK':(g.line<0?ab(g.home)+' -'+Math.abs(g.line):ab(g.away)+' -'+Math.abs(g.line)); }
function homeWeek(){ const ws=D.weeks.filter(w=>D.games.some(g=>g.week===w&&g.status!=='Final')); return ws.length?ws[0]:D.weeks[D.weeks.length-1]; }
function bookiesFor(w){ return (D.bookies||[]).filter(b=>b.week===w); }
function bookieName(w){ const b=bookiesFor(w); return b.length?b[0].name:''; }
function etInfo(d){
  const p={}; new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',month:'numeric',day:'numeric',hour:'numeric',hour12:false}).formatToParts(d).forEach(x=>p[x.type]=x.value);
  return {wd:p.weekday,m:Number(p.month),d:Number(p.day),h:Number(p.hour)%24};
}
function slotOf(d){
  const e=etInfo(d), key=e.m+'/'+e.d;
  if(e.m===12&&e.d===25) return {key:key+'xmas',label:'Christmas Day'};
  if(e.wd==='Thu'&&e.m===11&&e.d>=22&&e.d<=28) return {key:key+'tg',label:'Thanksgiving'};
  if(e.wd==='Thu') return {key:key+'tnf',label:'Thursday Night Football'};
  if(e.wd==='Fri') return {key:key+'fri',label:(e.m===11&&e.d>=23&&e.d<=29)?'Black Friday':'Friday'};
  if(e.wd==='Sat') return {key:key+'sat',label:'Saturday'};
  if(e.wd==='Sun'){ if(e.h<12) return {key:key+'intl',label:'Sunday Morning (International)'};
    if(e.h<16) return {key:key+'early',label:'Sunday Early Games'};
    if(e.h<19) return {key:key+'late',label:'Sunday Late Games'};
    return {key:key+'snf',label:'Sunday Night Football'}; }
  if(e.wd==='Mon') return {key:key+'mnf',label:'Monday Night Football'};
  return {key:key+e.wd,label:e.wd+' Games'};
}
function fmtCD(ms){ if(ms<=0) return 'Kickoff!'; const s=Math.floor(ms/1000), d=Math.floor(s/86400), h=Math.floor(s%86400/3600), m=Math.floor(s%3600/60), x=s%60;
  return (d?d+'d ':'')+(d||h?h+'h ':'')+m+'m '+String(x).padStart(2,'0')+'s'; }
function tick(){ document.querySelectorAll('.cd[data-t]').forEach(el=>{ el.textContent=fmtCD(Number(el.dataset.t)-Date.now()); }); }
function loadSchedule(w){
  google.script.run.withSuccessHandler(j=>{HS[w]=JSON.parse(j); if(TAB==='home'||TAB==='pick') render();})
    .withFailureHandler(e=>{HS[w]={error:e.message}; if(TAB==='home'||TAB==='pick') render();}).getWeekSchedule(w);
}
function contactCard(b,w,small){
  const digits=String(b.phone||'').replace(/[^0-9+]/g,'');
  return `<div class="sec"><div class="bk"><div class="star">★</div><div class="who2"><div class="muted" style="font-size:12px">${small?'Next week (Week '+w+')':'Week '+w+' bookie'}</div>
    <b>${esc((b.first||b.name)+' '+(b.last||''))}</b><div class="muted" style="font-size:13px">${esc(b.phone)}${b.email?' · '+esc(b.email):''}</div></div></div>
    ${small?'':`<div class="acts">${digits?`<a href="tel:${esc(digits)}">📞 Call</a><a href="sms:${esc(digits)}">💬 Text</a>`:''}${b.email?`<a href="mailto:${esc(b.email)}">✉️ Email</a>`:''}</div>`}</div>`;
}
function renderHome(){
  const w=homeWeek(); let h='';
  const bs=bookiesFor(w);
  if(bs.length) h+=bs.map(b=>contactCard(b,w,false)).join('')+(bs.length>1?'<div class="sec moved">More than one bookie is assigned to this week — check the Bookies tab.</div>':'');
  else h+=`<div class="sec muted">No bookie assigned for Week ${w} — check the Bookies tab.</div>`;
  const sched=HS[w];
  if(!sched){ loadSchedule(w); h+=`<div class="sec">${spinner('Loading kickoff times…',1)}</div>`; }
  else if(sched.error){ h+=`<div class="sec muted">Couldn’t load kickoff times: ${esc(sched.error)}</div>`; }
  else{
    const groups=[], byKey={};
    sched.slice().sort((a,b)=>new Date(a.date)-new Date(b.date)).forEach(ev=>{ const d=new Date(ev.date), s=slotOf(d);
      if(!byKey[s.key]){byKey[s.key]={label:s.label,start:d,evs:[]};groups.push(byKey[s.key]);} byKey[s.key].evs.push(ev); });
    h+=`<div class="sub" style="text-align:left;margin-top:12px"><b>Week ${w} kickoffs</b> · times shown in your time zone</div>`;
    groups.forEach(gp=>{
      const live=gp.evs.some(e=>e.state==='in'), done=gp.evs.every(e=>e.state==='post');
      const right=done?'<div class="cd done">Final</div>':live?'<div class="cd live">LIVE</div>':`<div class="cd" data-t="${gp.start.getTime()}">${fmtCD(gp.start-Date.now())}</div>`;
      const intl=[...new Set(gp.evs.filter(isIntl).map(e=>e.country))];
      const where=intl.length?' · '+gp.evs.filter(isIntl).map(e=>e.city).filter((v,i,a)=>v&&a.indexOf(v)===i).join(' / '):'';
      h+=`<div class="slot"><div class="sh"><div><b>${esc(gp.label)}</b>${intl.map(flagBadge).join('')}<div class="when">${gp.start.toLocaleString([], {weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})} · ${gp.evs.length} game${gp.evs.length>1?'s':''}${esc(where)}</div></div>${right}</div>`+
        gp.evs.map(ev=>{ const g=D.games.find(x=>x.week===w&&x.espnHome===ev.espnHome); const aw=g?g.away:ev.espnAway, hm=g?g.home:ev.espnHome;
          const fav=g&&g.spread!==''?(g.dog===g.home?g.away:g.home):null;
          const lockA=fav&&fav===aw?'−'+g.spread:'', lockH=fav&&fav===hm?'−'+g.spread:'';
          const showSc=ev.state!=='pre';
          const cov=t=>g&&g.status==='Final'&&g.winner===t;
          const tr=(t,sc,ln)=>`<div class="tr${cov(t)?' cover':''}" style="${cov(t)?'background:var(--green);color:var(--greenInk);border-radius:6px;padding:2px 4px':''}">${logo(t)}<span class="nm">${esc(t)} <span class="rec">(${esc((D.records||{})[t]||'')})</span></span><span class="sc">${showSc&&sc!=null&&sc!==''?sc:''}</span></div>`;
          const kick=ev.state==='pre'?new Date(ev.date).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})+(ev.tv?' · '+ev.tv:''):(ev.state==='in'?`<span class="moved">${esc(ev.detail)}</span>`:'Final');
          const place=[ev.venue,[ev.city,ev.st].filter(Boolean).join(', ')+(isIntl(ev)&&ev.country?(ev.city?', ':'')+ev.country:'')].filter(Boolean).join(' · ');
          const wx=ev.indoor?'🏟️ Indoors':(ev.weather&&(ev.weather.temp!=null||ev.weather.text)?`🌤️ ${ev.weather.temp!=null?ev.weather.temp+'° ':''}${esc(ev.weather.text||'')}`:'');
          const favAbbr=fav?(fav===aw?(ev.aAbbr||fav):(ev.hAbbr||fav)):'';
          const moved=!!(g&&dkText(g).indexOf('class="moved"')>=0);
          return `<div class="hg" ${g?`onclick="openGame(${D.games.indexOf(g)})"`:''}>
            <div class="kick">${kick}</div>
            <div class="hbox"><div class="teams">${tr(aw,ev.as,lockA)}${tr(hm,ev.hs,lockH)}</div>
              <table class="mt"><tr><th title="Locked line" aria-label="Locked line"><img class="dklogo" src="https://www.google.com/s2/favicons?domain=draftkings.com&sz=64" alt="" onerror="this.remove()"> <svg width="11" height="12" viewBox="0 0 11 12" style="vertical-align:-1px"><rect x="1" y="5" width="9" height="7" rx="1.5" fill="currentColor"/><path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></th><th title="DraftKings" aria-label="DraftKings"><img class="dklogo" src="https://www.google.com/s2/favicons?domain=draftkings.com&sz=64" alt="DK" onerror="this.replaceWith(document.createTextNode('DK'))"></th><th>O/U</th></tr>
              <tr><td>${fav?esc(favAbbr)+' −'+g.spread:'—'}</td><td class="${moved?'moved':''}">${ev.line?esc(ev.line):(lineFromSheet(g)?esc(lineFromSheet(g)):'—')}</td><td>${ev.ou!=null?ev.ou:'—'}</td></tr></table></div>
            <div class="info">${place?`<span>📍 ${esc(place)}</span>`:''}${wx?`<span>${wx}</span>`:''}</div></div>`; }).join('')+'</div>';
    });
  }
  h+=byeLine(w);
  const nb=bookiesFor(w+1); if(nb.length) h+=contactCard(nb[0],w+1,true);
  h+=`<div class="foot">Scores refreshed ${esc(D.refreshed)}</div>`;
  return h;
}
setInterval(()=>{ if(TAB==='home') tick(); },1000);

/* ---------- Picks entry ---------- */
let ME=null, MYPIN='', SEL={}, ORIG={}, ORIGTB='', SELWK=null, TBIN='', PMSG='', MYLOADED=false, NEEDPIN=false;
function retryPin(){ const p=(document.getElementById('pinRetry').value||'').trim(); if(!p) return; MYPIN=p; NEEDPIN=false; PMSG='';
  try{localStorage.setItem('pickemPin',p);}catch(e){} SELWK=null; render(); }
try{ ME=localStorage.getItem('pickemMe'); MYPIN=localStorage.getItem('pickemPin')||''; }catch(e){}
function pushSVG(){return `<span class="pushicon" role="img" aria-label="Push"></span>`;}
function pickWeek(){ return homeWeek(); }
function teamColor(t){ let c=String((D.colors||{})[t]||'').trim(); if(!c) return '#2e7d32'; if(c[0]!=='#') c='#'+c; return c; }
function inkOn(hex){ const m=hex.replace('#',''); if(m.length<6) return '#fff'; const r=parseInt(m.slice(0,2),16)/255,g=parseInt(m.slice(2,4),16)/255,b=parseInt(m.slice(4,6),16)/255;
  const lin=v=>v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4); const L=0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b); return L>0.4?'#111418':'#ffffff'; }
function myPin(){ const b=(D.bookies||[]).find(x=>x.name===ME); return !!(b&&b.pinRequired); }
function setMe(){ const n=document.getElementById('meSel').value, p=(document.getElementById('mePin')||{}).value||'';
  if(!n) return; ME=n; MYPIN=p; try{localStorage.setItem('pickemMe',n);localStorage.setItem('pickemPin',p);}catch(e){} SEL={}; SELWK=null; render(); }
function switchMe(){ NEEDPIN=false; PMSG=''; MYPIN=''; try{localStorage.removeItem('pickemPin');}catch(e){} ME=null; SEL={}; SELWK=null; try{localStorage.removeItem('pickemMe');}catch(e){} render(); }
function choose(gi,val){ const g=D.games[gi]; SEL[g.game]=SEL[g.game]===val?undefined:val; PMSG=''; render(); }
function changedGames(w){ return D.games.filter(g=>g.week===w&&(SEL[g.game]||'')!==(ORIG[g.game]||'')); }
function gameLocked(g,sched){ if(g.status&&g.status!=='Not started'&&g.status!=='Not found') return true;
  const ev=(sched||[]).find(e=>e.espnHome===g.espnHome); return !!(ev&&new Date(ev.date).getTime()<=Date.now()); }
function renderPick(){
  if(!ME) return `<div class="sec who-in" style="text-align:center"><h3>Sign in to make picks</h3><div class="muted" style="font-size:13px">Pick your name and enter your PIN — this phone will remember you.</div>${signinButton('Sign in')}</div>`;
  const w=pickWeek(), gs=D.games.filter(g=>g.week===w), sched=HS[w];
  if(!sched) loadSchedule(w);
  if(SELWK!==w){ SELWK=w; SEL={}; TBIN=''; MYLOADED=false;
    google.script.run.withSuccessHandler(j=>{ const r=JSON.parse(j); ORIG=Object.assign({},r.picks); ORIGTB=r.tiebreak||''; SEL=Object.assign({},r.picks,SEL); if(!TBIN) TBIN=ORIGTB; MYLOADED=true; if(TAB==='pick') render(); })
      .withFailureHandler(e=>{ MYLOADED=true; PMSG=`<span class="moved">⚠️ ${esc(e.message)}</span>`; if(/PIN/.test(e.message)){ MYPIN=''; NEEDPIN=true; try{localStorage.removeItem('pickemPin');}catch(x){} } if(TAB==='pick') render(); })
      .getMyPicks(w,ME,MYPIN); }
  if(NEEDPIN) return `<div class="sec who-in"><h3>Enter your PIN</h3><div style="font-size:13px">${esc(ME)}, type your PIN (if your phone fills something in automatically, clear it and type the PIN yourself).</div>
      ${PMSG?`<div style="margin-top:6px;font-size:13px">${PMSG}</div>`:''}
      <input id="pinRetry" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="gmp-pin-nofill" data-lpignore="true" data-1p-ignore style="-webkit-text-security:disc;text-security:disc" placeholder="PIN">
      <button class="gobtn" onclick="retryPin()">Unlock my picks</button>
      <div class="foot"><a href="#" onclick="switchMe();return false;" style="color:var(--navy)">Not ${esc(ME)}?</a></div></div>`;
  if(!MYLOADED) return spinner(`Loading your week ${w} picks…`);
  const evOf=g=>(Array.isArray(sched)?sched:[]).find(e=>e.espnHome===g.espnHome)||{};
  const order=gs.slice().sort((a,b)=>(new Date(evOf(a).date||0))-(new Date(evOf(b).date||0)));
  const open=order.filter(g=>g.spread!==''&&!gameLocked(g,sched));
  const picked=gs.filter(g=>SEL[g.game]).length;
  const tbGame=gs.find(g=>g.tb);
  let h=`<div class="sec"><div style="display:flex;justify-content:space-between;align-items:center"><div><b style="font-size:17px">Week ${w} picks</b><div class="muted" style="font-size:13px">${esc(ME)} · ${picked} of ${gs.length} picked${changedGames(w).length||String(TBIN)!==String(ORIGTB)?' · <span class="moved">unsaved changes</span>':''}</div></div>
     <a href="#" onclick="openSignin();return false;" style="font-size:13px;color:var(--navy)">not you?</a></div>
     ${PMSG?`<div style="margin-top:8px;font-size:13px">${PMSG}</div>`:''}</div>`;
  if(!gs.some(g=>g.spread!=='')) h+=`<div class="sec muted">The week ${w} lines haven’t been locked in yet. Check back after the bookie loads them.</div>`;
  order.forEach(g=>{
    const gi=D.games.indexOf(g), ev=evOf(g), locked=g.spread===''||gameLocked(g,sched);
    const whole=g.spread!==''&&Number(g.spread)%1===0, cur=SEL[g.game];
    const fav=g.spread!==''?(g.dog===g.home?g.away:g.home):null;
    const favAbbr=fav?(fav===g.away?(ev.aAbbr||fav):(ev.hAbbr||fav)):'';
    const tbtn=(t,side)=>{ const ln=fav?(t===fav?'−'+g.spread:'+'+g.spread):'';
      const src=(D.logos||{})[t];
      const sel=cur===t, saved=sel&&ORIG[g.game]===t, col=teamColor(t);
      const sty=sel?`style="background:${col};border-color:${saved?'#2e7d32':col};color:${inkOn(col)}"`:'';
      return `<button class="pbtn${sel?' sel tsel':''}${saved?' saved':''}" ${sty} ${locked?'disabled':''} onclick="choose(${gi},'${esc(t).replace(/'/g,"\\'")}')">${saved?'<span class="savedtag">✓ Saved</span>':''}
        ${src?`<img src="${esc(src)}" alt="">`:''}<div class="nm">${esc(t)}</div><div class="sub">${side} · (${esc((D.records||{})[t]||'')}) ${ln}</div></button>`; };
    const mid=`<div class="midcol"><div class="vs">@</div>${whole?`<button class="pbtn pushb${cur==='Push'?' sel':''}${cur==='Push'&&ORIG[g.game]==='Push'?' saved':''}" ${locked?'disabled':''} onclick="choose(${gi},'Push')" aria-label="Push">${pushSVG()}</button>`:''}</div>`;
    const kick=ev.date?new Date(ev.date).toLocaleString([], {weekday:'short',hour:'numeric',minute:'2-digit'})+(ev.tv?' · '+ev.tv:''):'';
    h+=`<div class="pk${locked?' locked':''}"><div class="top"><span>${esc(kick)}</span><span>${g.spread===''?'Line not set yet':locked?'🔒 Kicked off — locked':((cur||'')!==(ORIG[g.game]||'')?'<span class="moved">● Changed — not saved</span>':(cur?'✓ Saved · tap to change':'Tap a team'))}</span></div>
      <div class="row">${tbtn(g.away,'Away')}${mid}${tbtn(g.home,'Home')}</div>
      <div class="pkfoot"><table class="mt"><tr><th title="Locked line"><img class="dklogo" src="https://www.google.com/s2/favicons?domain=draftkings.com&sz=64" alt="" onerror="this.remove()"> <svg width="11" height="12" viewBox="0 0 11 12" style="vertical-align:-1px"><rect x="1" y="5" width="9" height="7" rx="1.5" fill="currentColor"/><path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></th><th title="DraftKings" aria-label="DraftKings"><img class="dklogo" src="https://www.google.com/s2/favicons?domain=draftkings.com&sz=64" alt="DK" onerror="this.replaceWith(document.createTextNode('DK'))"></th><th>O/U</th></tr>
      <tr><td>${fav?esc(favAbbr)+' −'+g.spread:'—'}</td><td class="${dkText(g).indexOf('moved')>=0?'moved':''}">${ev.line?esc(ev.line):(lineFromSheet(g)?esc(lineFromSheet(g)):'—')}</td><td>${ev.ou!=null?ev.ou:'—'}</td></tr></table>
      <button class="gdbtn" onclick="openGame(${gi})">Details ›</button></div></div>`;
  });
  if(tbGame) h+=`<div class="sec who-in"><h3>Tiebreaker</h3><div style="font-size:13px">Total points in <b>${esc(tbGame.away)} @ ${esc(tbGame.home)}</b></div>
     <input type="number" inputmode="numeric" value="${esc(TBIN)}" oninput="TBIN=this.value;const s=document.getElementById('saveBtn');if(s){s.disabled=false;}" ${gameLocked(tbGame,sched)?'disabled':''} placeholder="e.g. 45"></div>`;
  const nchg=changedGames(w).filter(g=>!gameLocked(g,sched)).length, tbchg=String(TBIN)!==String(ORIGTB);
  h+=`<div class="savebar"><button id="saveBtn" ${nchg||tbchg?'':'disabled'} onclick="savePicks()">${nchg||tbchg?`Save changes${nchg?' ('+nchg+')':''}`:'All picks saved ✓'}</button></div>`;
  h+=`<div class="foot"><svg class="lockic" viewBox="0 0 11 12" aria-hidden="true"><rect x="1" y="5" width="9" height="7" rx="1.5" fill="currentColor"/><path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>Your picks are private — nobody (including you, on other screens) sees anyone’s picks for a game until it kicks off. You can change or clear any pick (tap the selected team again to clear it) until that game kicks off — just tap Save. Each game locks at kickoff. Push is only offered when the locked line is a whole number. Your picks go straight into the league sheet.</div>`;
  return h;
}
function savePicks(){
  const w=pickWeek(), gs=D.games.filter(g=>g.week===w);
  const picks=changedGames(w).filter(g=>!gameLocked(g,HS[w])&&g.spread!=='').map(g=>({game:g.game,pick:SEL[g.game]||''}));
  const b=document.getElementById('saveBtn'); b.disabled=true; b.textContent='Saving…';
  google.script.run.withSuccessHandler(j=>{ const r=JSON.parse(j); PMSG=`✅ Saved ${r.saved} change${r.saved===1?'':'s'}${r.tiebreak?' and your tiebreaker':''}.`+(r.skipped.length?`<br><span class="moved">Not saved: ${esc(r.skipped.join('; '))}</span>`:'');
      SELWK=null; load(r.data); })
    .withFailureHandler(e=>{ PMSG=`<span class="moved">⚠️ ${esc(e.message)}</span>`; if(/PIN/.test(e.message)){ NEEDPIN=true; MYPIN=''; } render(); })
    .submitPicks({week:w,name:ME,pin:MYPIN,picks:picks,tiebreak:TBIN});
}


/* ---------- sign in (shared by Picks + Message board) ---------- */
let SIGNAFTER=null, SMSG='', SBUSY=false;
function updateSignBtn(){ const l=document.getElementById('signLbl'); if(l) l.textContent=ME?ME:'Sign in'; const b=document.getElementById('signBtn'); if(b) b.classList.toggle('in',!!ME); }
function signinButton(label){ return `<button class="gobtn signin-cta" onclick="openSignin(()=>{ if(TAB==='pick') render(); if(!document.getElementById('board').classList.contains('hidden')) drawBoard(); })">
  <svg viewBox="0 0 24 24" width="18" height="18" style="vertical-align:-3px;margin-right:6px"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" fill="currentColor"/></svg>${esc(label||'Sign in')}</button>`; }
function openSignin(after){ SIGNAFTER=after||null; SMSG=''; document.getElementById('signin').classList.remove('hidden'); drawSignin(); }
function closeSignin(){ document.getElementById('signin').classList.add('hidden'); }
function drawSignin(){
  const el=document.getElementById('sbody'); if(!el||!D) return;
  if(ME){ el.innerHTML=`<div class="sec who-in" style="text-align:center"><div style="display:flex;justify-content:center;margin:4px 0 8px">${avatar(ME,'','width:52px;height:52px;font-size:18px')}</div>
      <div>Signed in as <b>${esc(ME)}</b></div>
      <button class="gobtn" onclick="closeSignin()">Done</button>
      <button class="gobtn" style="background:var(--chip);color:var(--ink)" onclick="signOut()">Sign out / switch person</button></div>`; return; }
  const opts=D.players.map(n=>`<option>${esc(n)}</option>`).join('');
  el.innerHTML=`<div class="sec who-in"><h3>Who are you?</h3>
    <select id="sinName" onchange="document.getElementById('sinPinWrap').style.display=((D.bookies||[]).find(b=>b.name===this.value)||{}).pinRequired?'block':'none'"><option value="">Choose your name…</option>${opts}</select>
    <div id="sinPinWrap" style="display:none"><input id="sinPin" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="gmp-pin-nofill" data-lpignore="true" data-1p-ignore style="-webkit-text-security:disc;text-security:disc" placeholder="Your PIN"></div>
    ${SMSG?`<div style="margin-top:8px;font-size:13px">${SMSG}</div>`:''}
    <button class="gobtn" ${SBUSY?'disabled':''} onclick="doSignin()">${SBUSY?'Checking…':'Sign in'}</button>
    <div class="foot">This phone will remember you. Your sign-in is used for Picks and the Message board.</div></div>`;
}
function doSignin(){
  const n=document.getElementById('sinName').value, p=(document.getElementById('sinPin')||{}).value||'';
  if(!n){ SMSG='<span class="moved">Choose your name first.</span>'; drawSignin(); return; }
  SBUSY=true; SMSG=''; drawSignin();
  google.script.run.withSuccessHandler(j=>{ SBUSY=false; const r=JSON.parse(j); ME=n; MYPIN=p; BADMIN=!!r.admin; NEEDPIN=false; SEL={}; SELWK=null;
      try{ localStorage.setItem('pickemMe',n); localStorage.setItem('pickemPin',p); }catch(e){}
      updateSignBtn(); closeSignin(); const f=SIGNAFTER; SIGNAFTER=null; if(f) f(); else if(TAB==='pick') render(); })
    .withFailureHandler(e=>{ SBUSY=false; SMSG=`<span class="moved">⚠️ ${esc(e.message)}</span>`; drawSignin(); })
    .boardWhoAmI(n,p);
}
function signOut(){ ME=null; MYPIN=''; BADMIN=false; SEL={}; SELWK=null; NEEDPIN=false; try{ localStorage.removeItem('pickemMe'); localStorage.removeItem('pickemPin'); }catch(e){}
  updateSignBtn(); drawSignin(); if(TAB==='pick') render(); if(!document.getElementById('board').classList.contains('hidden')) drawBoard(); }
/* ---------- message board ---------- */
let BF={q:'',author:'',type:'',range:'',from:'',to:'',photo:false,file:false,replies:false}, BFOPEN=false;
let BD=null, BADMIN=false, BFILES=[], BTEXT='', BKIND='post', BMSG='', BBUSY=false, RTO=null, RTEXT='', RFILES=[], RBUSY=false, PICKFOR=null, BPOLL=null, PSEL={}, PCHANGE={};
let COLL={}; try{ COLL=JSON.parse(localStorage.getItem('gmpBoardCollapsed')||'{}'); }catch(e){}
function toggleColl(id){ if(COLL[id]) delete COLL[id]; else COLL[id]=1; try{ localStorage.setItem('gmpBoardCollapsed',JSON.stringify(COLL)); }catch(e){} keepScroll(drawBoard); }
function resetViewport(){ try{ if(document.activeElement) document.activeElement.blur(); window.scrollTo(0,0); }catch(e){} }   // iOS can leave the page shifted after the keyboard closes
document.addEventListener('focusout',e=>{ if(/TEXTAREA|INPUT/.test((e.target||{}).tagName||'')) setTimeout(()=>{ try{ window.scrollTo(0,0); }catch(x){} },60); });
/* polls */
function pollView(p){
  const pl=p.poll; if(!pl) return '';
  const votes=pl.votes||{}, mine=ME?(votes[ME]||[]):[], voters=Object.keys(votes), total=voters.length;
  const counts=pl.options.map((_,i)=>voters.filter(n=>(votes[n]||[]).indexOf(i)>=0));
  const showResults=pl.closed||!ME||(mine.length&&!PCHANGE[p.id]);
  let body;
  if(showResults){
    const max=Math.max(1,...counts.map(c=>c.length));
    body=pl.options.map((o,i)=>{ const n=counts[i].length, pct=total?Math.round(100*n/total):0, me=mine.indexOf(i)>=0, lead=n===max&&n>0;
      return `<div class="pr${me?' me':''}${lead?' lead':''}"><div class="prb" style="width:${pct}%"></div><div class="prt"><span>${me?'✓ ':''}${esc(o)}</span><b>${pct}%</b></div>
        <div class="prv">${n} vote${n===1?'':'s'}${n?' · '+esc(counts[i].slice(0,6).join(', '))+(n>6?' +'+(n-6):''):''}</div></div>`; }).join('');
  } else {
    const sel=PSEL[p.id]||mine.slice();
    body=pl.options.map((o,i)=>`<button class="po${sel.indexOf(i)>=0?' on':''}" onclick="pickOpt('${p.id}',${i},${pl.multi?1:0})">${pl.multi?(sel.indexOf(i)>=0?'☑':'☐'):'○'} ${esc(o)}</button>`).join('')+
      (pl.multi?`<button class="bpost" style="margin-top:6px" onclick="castVote('${p.id}')">Vote</button>`:'');
  }
  const canClose=ME&&(p.author===ME||BADMIN);
  return `<div class="poll" id="pv-${p.id}"><div class="pmeta">📊 Poll · ${total} voter${total===1?'':'s'}${pl.multi?' · pick any':''}${pl.closed?' · <b>Closed</b>':''}</div>${body}
    <div class="pact">${(!pl.closed&&ME&&mine.length&&!PCHANGE[p.id])?`<a href="#" onclick="PCHANGE['${p.id}']=1;PSEL['${p.id}']=null;swapPoll('${p.id}');return false;">Change vote</a>`:''}
    ${canClose?`<a href="#" onclick="boardCall('closePoll','${p.id}',${pl.closed?'false':'true'});return false;">${pl.closed?'Reopen voting':'Close voting'}</a>`:''}</div></div>`;
}
function pickOpt(id,i,multi){ if(!multi){ PSEL[id]=[i]; castVote(id); return; }
  const s=(PSEL[id]||((boardItem(id)||{}).poll.votes||{})[ME]||[]).slice(); const k=s.indexOf(i); if(k>=0) s.splice(k,1); else s.push(i); PSEL[id]=s; swapPoll(id); }
function castVote(id){ const s=PSEL[id]||[]; delete PCHANGE[id]; delete PSEL[id];
  const it=boardItem(id); if(it&&it.poll&&ME){ it.poll.votes=Object.assign({},it.poll.votes); if(s.length) it.poll.votes[ME]=s; else delete it.poll.votes[ME]; }
  swapPoll(id);
  google.script.run.withSuccessHandler(j=>{ BD=JSON.parse(j); swapPoll(id); })
    .withFailureHandler(e=>{ BMSG=`<span class="moved">⚠️ ${esc(e.message)}</span>`; keepScroll(drawBoard); })
    .voteBoard(ME,MYPIN,id,s); }
function pollEditor(){ if(!BPOLL) return '';
  return `<div class="pedit">${BPOLL.options.map((o,i)=>`<div class="pei"><input value="${esc(o)}" placeholder="Option ${i+1}" oninput="BPOLL.options[${i}]=this.value">${BPOLL.options.length>2?`<a href="#" onclick="BPOLL.options.splice(${i},1);drawBoard();return false;">✕</a>`:''}</div>`).join('')}
    ${BPOLL.options.length<10?`<a href="#" class="padd" onclick="BPOLL.options.push('');drawBoard();return false;">+ Add option</a>`:''}
    <label class="bann"><input type="checkbox" ${BPOLL.multi?'checked':''} onchange="BPOLL.multi=this.checked"> Allow more than one choice</label></div>`; }
function boardSeen(){ try{ return localStorage.getItem('gmpBoardSeen')||''; }catch(e){ return ''; } }
function updateBoardDot(){ const latest=(D&&D.boardLatest)||'', unseen=latest&&latest>boardSeen();
  ['boardDot','menuDot'].forEach(id=>{ const e=document.getElementById(id); if(e) e.hidden=!unseen; }); }
function openBoard(){ document.getElementById('board').classList.remove('hidden'); document.body.style.overflow='hidden';
  drawBoard(); loadBoard(); if(ME) google.script.run.withSuccessHandler(j=>{ BADMIN=!!JSON.parse(j).admin; drawBoard(); }).withFailureHandler(()=>{}).boardWhoAmI(ME,MYPIN); }
function closeBoard(){ document.getElementById('board').classList.add('hidden'); document.body.style.overflow='';
  if(BD&&BD.posts.length){ const all=BD.posts.flatMap(p=>[p.ts].concat((p.replies||[]).map(r=>r.ts))); try{ localStorage.setItem('gmpBoardSeen',all.sort().pop()); }catch(e){} } updateBoardDot(); }
function loadBoard(){ google.script.run.withSuccessHandler(j=>{ BD=JSON.parse(j); drawBoard(); })
  .withFailureHandler(e=>{ BMSG=`<span class="moved">⚠️ ${esc(e.message)}</span>`; drawBoard(); }).getBoard(); }
function linkify(s){ return esc(s).replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>').replace(/\n/g,'<br>'); }
// First + last initials from the Bookies tab (falls back to the name itself)
function initials(n){
  const b=(D&&D.bookies||[]).find(x=>x.name===n);
  const f=String((b&&b.first)||'').trim(), l=String((b&&b.last)||'').trim();
  if(f||l) return ((f[0]||'')+(l[0]||'')).toUpperCase()||'?';
  return String(n||'?').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
}
// One distinct color per league member (by sheet order), readable on light and dark backgrounds
const PCOLORS=['#e5484d','#2f80ed','#1fa35c','#d97706','#9b51e0','#0d9488','#db2777','#65a30d','#0891b2','#ea580c','#4f46e5','#059669','#c026d3','#b45309','#2563eb','#dc2626','#7c3aed','#0f766e','#be185d','#4d7c0f'];
function personColor(n){
  const i=D&&D.players?D.players.indexOf(n):-1;
  if(i>=0) return PCOLORS[i%PCOLORS.length];
  let h=0; for(const c of String(n||'')) h=(h*31+c.charCodeAt(0))>>>0; return PCOLORS[h%PCOLORS.length];
}
function avatar(n,cls,style){ return `<span class="av${cls?' '+cls:''}" style="background:${personColor(n)};${style||''}">${esc(initials(n))}</span>`; }
function nameTag(n){ return `<b class="pname" style="color:${personColor(n)}">${esc(n)}</b>`; }
function rxBar(p){
  const rx=p.reactions||{}, keys=Object.keys(rx).filter(k=>rx[k]&&rx[k].length);
  const chips=keys.map(k=>`<button class="rx${ME&&rx[k].indexOf(ME)>=0?' me':''}" title="${esc(rx[k].join(', '))}" onclick="react('${p.id}','${k}')">${k} ${rx[k].length}</button>`).join('');
  const picker=PICKFOR===p.id?`<div class="rxpick">${(BD.emojis||[]).map(e=>`<button onclick="react('${p.id}','${e}')">${e}</button>`).join('')}</div>`:'';
  return `<div class="rxwrap" id="rxw-${p.id}"><div class="rxbar">${chips}${ME?`<button class="rx add" onclick="togglePicker('${p.id}')" aria-label="Add reaction">☺<sup>+</sup></button>`:''}</div>${picker}</div>`;
}
function postBody(p){
  const imgs=p.att.filter(a=>a.img), files=p.att.filter(a=>!a.img);
  return `${p.text?`<div class="bpt">${linkify(p.text)}</div>`:''}${pollView(p)}
    ${imgs.length?`<div class="bpi n${Math.min(imgs.length,3)}">${imgs.map(a=>`<a href="${esc(a.url)}" target="_blank" rel="noopener"><img src="${esc(a.src)}" alt="${esc(a.name)}" loading="lazy"></a>`).join('')}</div>`:''}
    ${files.map(a=>`<a class="bpf" href="${esc(a.url)}" target="_blank" rel="noopener">📎 ${esc(a.name)} <span class="muted">${Math.max(1,Math.round(a.size/1024))} KB</span></a>`).join('')}`;
}
function postActs(p,isReply){
  const mine=ME&&p.author===ME, ageMin=(Date.now()-new Date(p.ts))/60000, canEdit=mine&&(BADMIN||ageMin<=(BD.editMinutes||15));
  return [ (!isReply&&ME)?`<button onclick="openReply('${p.id}')">↩ Reply</button>`:'', canEdit?`<button onclick="editPost('${p.id}')">Edit</button>`:'',
    (mine||BADMIN)?`<button onclick="delPost('${p.id}')">Delete</button>`:'',
    (!isReply&&BADMIN)?`<button onclick="kindPost('${p.id}','${p.kind==='announcement'?'post':'announcement'}')">${p.kind==='announcement'?'Unpin':'Pin'}</button>`:''].join('');
}
function bpost(p){
  const reps=p.replies||[];
  const replies=reps.map(r=>`<div class="br"><div class="bph">${avatar(r.author,'sm')}<div>${nameTag(r.author)} <span class="muted">${ago(r.ts)}${r.edited?' · edited':''}</span></div></div>
      ${postBody(r)}<div class="bfoot">${rxBar(r)}<div class="bpa">${postActs(r,true)}</div></div></div>`).join('');
  const composer=RTO===p.id?`<div class="brc"><textarea id="rtext" rows="2" placeholder="Reply to ${esc(p.author)}…" oninput="RTEXT=this.value">${esc(RTEXT)}</textarea>
      ${RFILES.length?`<div class="bsel">${RFILES.map((f,i)=>`<span>${f.mime.startsWith('image/')?'🖼️':'📎'} ${esc(f.name)} <a href="#" onclick="RFILES.splice(${i},1);drawBoard();return false;">✕</a></span>`).join('')}</div>`:''}
      <div class="bbar"><label class="bbtn">📷<input type="file" accept="image/*" multiple hidden onchange="addReplyFiles(this.files);this.value=''"></label>
      <button class="bbtn" onclick="RTO=null;RTEXT='';RFILES=[];drawBoard()">Cancel</button>
      <button class="bpost" ${RBUSY?'disabled':''} onclick="sendReply('${p.id}')">${RBUSY?'Sending…':'Reply'}</button></div></div>`:'';
  const col=!!COLL[p.id], nrx=Object.values(p.reactions||{}).reduce((s,a)=>s+(a?a.length:0),0);
  const preview=col?`<div class="bprev">${p.poll?'📊 ':''}${esc(String(p.text||'').split('\n')[0]||(p.att.length?'📎 attachment':''))}</div><div class="muted bcnt">${reps.length?reps.length+' repl'+(reps.length===1?'y':'ies'):''}${reps.length&&nrx?' · ':''}${nrx?nrx+' reaction'+(nrx===1?'':'s'):''}</div>`:'';
  return `<div class="bp${p.kind==='announcement'?' ann':''}${col?' col':''}"><div class="bph" onclick="toggleColl('${p.id}')">${avatar(p.author)}<div style="flex:1;min-width:0">${nameTag(p.author)}
      <div class="muted">${p.kind==='announcement'?'📌 Announcement · ':''}${ago(p.ts)}${p.edited?' · edited':''}</div>${preview}</div><span class="bchev" aria-label="${col?'Expand':'Collapse'}">${col?'▸':'▾'}</span></div>
    ${col?'':`${postBody(p)}<div class="bfoot">${rxBar(p)}<div class="bpa">${postActs(p,false)}</div></div>
    ${reps.length?`<div class="brs"><div class="brn">${reps.length} repl${reps.length===1?'y':'ies'}</div>${replies}</div>`:''}${composer}`}</div>`;
}
function openReply(id){ RTO=id; RTEXT=''; RFILES=[]; delete COLL[id]; drawBoard(); setTimeout(()=>{ const t=document.getElementById('rtext'); if(t) t.focus({preventScroll:true}); },50); }
async function addReplyFiles(list){ try{ for(const f of Array.from(list)) RFILES.push(await shrinkImage(f)); }catch(e){} drawBoard(); }
function sendReply(id){ RTEXT=(document.getElementById('rtext')||{}).value||RTEXT; if(!RTEXT.trim()&&!RFILES.length) return;
  RBUSY=true; drawBoard();
  google.script.run.withSuccessHandler(j=>{ BD=JSON.parse(j); RTO=null; RTEXT=''; RFILES=[]; RBUSY=false; resetViewport(); drawBoard(); })
    .withFailureHandler(e=>{ RBUSY=false; BMSG=`<span class="moved">⚠️ ${esc(e.message)}</span>`; drawBoard(); })
    .postBoard({name:ME,pin:MYPIN,text:RTEXT,parent:id,files:RFILES}); }
function boardItem(id){ for(const p of (BD&&BD.posts)||[]){ if(p.id===id) return p; const r=(p.replies||[]).find(x=>x.id===id); if(r) return r; } return null; }
function boardScroller(){ return document.querySelector('#board .sheetm'); }
function keepScroll(fn){ const sc=boardScroller(), y=sc?sc.scrollTop:0; fn(); if(sc){ sc.scrollTop=y; requestAnimationFrame(()=>{ sc.scrollTop=y; }); } }
function swapRx(id){ const it=boardItem(id), el=document.getElementById('rxw-'+id); if(!it||!el){ keepScroll(drawBoard); return; } keepScroll(()=>{ el.outerHTML=rxBar(it); }); }
function swapPoll(id){ const it=boardItem(id), el=document.getElementById('pv-'+id); if(!it||!el){ keepScroll(drawBoard); return; } keepScroll(()=>{ el.outerHTML=pollView(it); }); }
function togglePicker(id){ const prev=PICKFOR; PICKFOR=PICKFOR===id?null:id; if(prev&&prev!==id) swapRx(prev); swapRx(id); }
function react(id,emoji){
  PICKFOR=null; const it=boardItem(id);
  if(it&&ME){ const rx=it.reactions=it.reactions||{}, l=rx[emoji]=(rx[emoji]||[]).slice(), i=l.indexOf(ME); if(i>=0) l.splice(i,1); else l.push(ME); if(!l.length) delete rx[emoji]; }
  swapRx(id);                                             // show it instantly, then confirm with the server
  google.script.run.withSuccessHandler(j=>{ BD=JSON.parse(j); swapRx(id); })
    .withFailureHandler(e=>{ BMSG=`<span class="moved">⚠️ ${esc(e.message)}</span>`; keepScroll(drawBoard); })
    .reactBoard(ME,MYPIN,id,emoji);
}
function drawBoard(){
  const el=document.getElementById('bbody'); if(!el) return; let h='';
  if(!ME) h+=`<div class="sec who-in" style="text-align:center"><h3>Sign in to post</h3><div class="muted" style="font-size:13px">You can read the board without signing in.</div>${signinButton('Sign in')}</div>`;
  else h+=`<div class="sec bcomp"><div class="muted" style="font-size:12px;margin-bottom:4px">Posting as <b>${esc(ME)}</b>${BADMIN?' · admin':''}</div>
     <textarea id="btext" rows="3" placeholder="${BPOLL?'Ask your poll question…':'Share something with the league…'}" oninput="BTEXT=this.value">${esc(BTEXT)}</textarea>${pollEditor()}
     ${BFILES.length?`<div class="bsel">${BFILES.map((f,i)=>`<span>${f.mime.startsWith('image/')?'🖼️':'📎'} ${esc(f.name)} <a href="#" onclick="BFILES.splice(${i},1);drawBoard();return false;">✕</a></span>`).join('')}</div>`:''}
     <div class="bbar"><label class="bbtn">📷 Photo<input type="file" accept="image/*" multiple hidden onchange="addFiles(this.files,true);this.value=''"></label>
       <label class="bbtn">📎 File<input type="file" multiple hidden onchange="addFiles(this.files,false);this.value=''"></label>
       <button class="bbtn${BPOLL?' on':''}" onclick="BTEXT=(document.getElementById('btext')||{}).value||BTEXT;BPOLL=BPOLL?null:{options:['',''],multi:false};drawBoard()">📊 Poll</button>
       ${BADMIN?`<label class="bann"><input type="checkbox" ${BKIND==='announcement'?'checked':''} onchange="BKIND=this.checked?'announcement':'post'"> Announcement</label>`:''}
       <button class="bpost" ${BBUSY?'disabled':''} onclick="sendPost()">${BBUSY?'Posting…':'Post'}</button></div>
     ${BMSG?`<div style="font-size:13px;margin-top:6px">${BMSG}</div>`:''}</div>`;
  if(BD) h+=filterBar();
  h+=`<div id="blist">${boardListHTML()}</div>`;
  el.innerHTML=h;
}
function bfActive(){ return !!(BF.q||BF.author||BF.type||BF.range||BF.photo||BF.file||BF.replies); }
function bfMatch(p){
  const all=[p].concat(p.replies||[]);
  if(BF.author&&!all.some(x=>x.author===BF.author)) return false;
  if(BF.type==='announcement'&&p.kind!=='announcement') return false;
  if(BF.type==='post'&&(p.kind==='announcement'||p.poll)) return false;
  if(BF.type==='poll'&&!p.poll) return false;
  if(BF.photo&&!all.some(x=>(x.att||[]).some(a=>a.img))) return false;
  if(BF.file&&!all.some(x=>(x.att||[]).some(a=>!a.img))) return false;
  if(BF.replies&&!(p.replies||[]).length) return false;
  if(BF.range){ const now=new Date(), t=new Date(p.ts); let lo=null, hi=null;
    if(BF.range==='today'){ lo=new Date(now.getFullYear(),now.getMonth(),now.getDate()); }
    else if(BF.range==='7') lo=new Date(now-7*864e5); else if(BF.range==='30') lo=new Date(now-30*864e5);
    else if(BF.range==='custom'){ if(BF.from) lo=new Date(BF.from+'T00:00:00'); if(BF.to) hi=new Date(BF.to+'T23:59:59'); }
    const any=all.some(x=>{ const d=new Date(x.ts); return (!lo||d>=lo)&&(!hi||d<=hi); }); if(!any) return false; }
  if(BF.q){ const q=BF.q.toLowerCase(); const hay=all.map(x=>[x.text,x.author].concat((x.att||[]).map(a=>a.name)).join(' ')).join(' ')+' '+(p.poll?p.poll.options.join(' '):'');
    if(hay.toLowerCase().indexOf(q)<0) return false; }
  return true;
}
function boardListHTML(){
  if(!BD) return `<div class="sec">${spinner('Loading the board…',1)}</div>`;
  const posts=BD.posts.filter(bfMatch), on=bfActive();
  const ann=posts.filter(p=>p.kind==='announcement'), rest=posts.filter(p=>p.kind!=='announcement');
  let h=on?`<div class="bfres">Showing ${posts.length} of ${BD.posts.length} post${BD.posts.length===1?'':'s'} · <a href="#" onclick="clearBf();return false;">Clear filters</a></div>`:'';
  if(ann.length) h+=`<div class="bsect">📌 Announcements</div>`+ann.map(bpost).join('');
  h+=`<div class="bsect">League board</div>`+(rest.length?rest.map(bpost).join(''):`<div class="muted gcempty">${on?'No posts match these filters.':'No posts yet — be the first.'}</div>`);
  return h;
}
function renderBoardList(){ const el=document.getElementById('blist'); if(el) keepScroll(()=>{ el.innerHTML=boardListHTML(); }); }
function setBf(k,v){ BF[k]=v; if(k==='range'&&v!=='custom'){ BF.from=''; BF.to=''; } keepScroll(drawBoard); }
function clearBf(){ BF={q:'',author:'',type:'',range:'',from:'',to:'',photo:false,file:false,replies:false}; keepScroll(drawBoard); }
function filterBar(){
  const authors=[...new Set(BD.posts.flatMap(p=>[p.author].concat((p.replies||[]).map(r=>r.author))))].sort();
  const chip=(k,v,l)=>`<button class="gchip${BF[k]===v?' on':''}" onclick="setBf('${k}',${typeof v==='string'?`'${v}'`:v})">${l}</button>`;
  const tog=(k,l)=>`<button class="gchip${BF[k]?' on':''}" onclick="setBf('${k}',${!BF[k]})">${l}</button>`;
  return `<div class="bfbar"><input class="bfq" type="search" placeholder="🔎 Search posts, names, files…" value="${esc(BF.q)}" oninput="BF.q=this.value;renderBoardList()">
    <button class="gchip${BFOPEN||bfActive()&&!BF.q?' on':''}" onclick="BFOPEN=!BFOPEN;keepScroll(drawBoard)">⚙︎ Filters${bfActive()?' •':''}</button></div>
  ${BFOPEN?`<div class="sec bfp">
    <div class="bfrow"><span>Posted by</span><select onchange="setBf('author',this.value)"><option value="">Anyone</option>${ME?`<option value="${esc(ME)}" ${BF.author===ME?'selected':''}>Me (${esc(ME)})</option>`:''}${authors.filter(a=>a!==ME).map(a=>`<option ${BF.author===a?'selected':''}>${esc(a)}</option>`).join('')}</select></div>
    <div class="bfrow"><span>Type</span><div>${chip('type','','All')}${chip('type','announcement','📌 Announcements')}${chip('type','post','Posts')}${chip('type','poll','📊 Polls')}</div></div>
    <div class="bfrow"><span>When</span><div>${chip('range','','Any time')}${chip('range','today','Today')}${chip('range','7','Last 7 days')}${chip('range','30','Last 30 days')}${chip('range','custom','Dates…')}</div></div>
    ${BF.range==='custom'?`<div class="bfrow"><span></span><div class="bfdates"><input type="date" value="${esc(BF.from)}" onchange="setBf('from',this.value)"> to <input type="date" value="${esc(BF.to)}" onchange="setBf('to',this.value)"></div></div>`:''}
    <div class="bfrow"><span>Has</span><div>${tog('photo','🖼️ Photo')}${tog('file','📎 File')}${tog('replies','💬 Replies')}</div></div>
    ${bfActive()?`<div style="text-align:right"><a href="#" onclick="clearBf();return false;" style="font-size:13px">Clear all</a></div>`:''}</div>`:''}`;
}
function shrinkImage(file){ return new Promise((res,rej)=>{ const r=new FileReader(); r.onerror=rej; r.onload=()=>{ const im=new Image(); im.onerror=()=>res({name:file.name,mime:file.type,data:String(r.result).split(',')[1]});
  im.onload=()=>{ const max=1600, s=Math.min(1,max/Math.max(im.width,im.height)); const c=document.createElement('canvas'); c.width=Math.round(im.width*s); c.height=Math.round(im.height*s);
    c.getContext('2d').drawImage(im,0,0,c.width,c.height); res({name:file.name.replace(/\.\w+$/,'')+'.jpg',mime:'image/jpeg',data:c.toDataURL('image/jpeg',0.82).split(',')[1]}); }; im.src=r.result; }; r.readAsDataURL(file); }); }
function readFile(file){ return new Promise((res,rej)=>{ if(file.size>10*1024*1024){ rej(new Error(file.name+' is larger than 10 MB.')); return; }
  const r=new FileReader(); r.onerror=rej; r.onload=()=>res({name:file.name,mime:file.type||'application/octet-stream',data:String(r.result).split(',')[1]}); r.readAsDataURL(file); }); }
async function addFiles(list,asPhoto){ BMSG=''; try{ for(const f of Array.from(list)){ BFILES.push((asPhoto||/^image\//.test(f.type))&&!/gif$/.test(f.type)?await shrinkImage(f):await readFile(f)); } }
  catch(e){ BMSG=`<span class="moved">⚠️ ${esc(e.message)}</span>`; } drawBoard(); }
function sendPost(){ BTEXT=(document.getElementById('btext')||{}).value||BTEXT;
  if(BPOLL&&(!BTEXT.trim()||BPOLL.options.filter(o=>o.trim()).length<2)){ BMSG='<span class="moved">Type a question and at least 2 options.</span>'; drawBoard(); return; }
  if(!BTEXT.trim()&&!BFILES.length){ BMSG='<span class="moved">Write something or add a photo first.</span>'; drawBoard(); return; }
  BBUSY=true; BMSG=''; drawBoard();
  google.script.run.withSuccessHandler(j=>{ BD=JSON.parse(j); BTEXT=''; BFILES=[]; BKIND='post'; BPOLL=null; BBUSY=false; BMSG='✅ Posted.'; resetViewport(); drawBoard(); })
    .withFailureHandler(e=>{ BBUSY=false; BMSG=`<span class="moved">⚠️ ${esc(e.message)}</span>`; drawBoard(); })
    .postBoard({name:ME,pin:MYPIN,text:BTEXT,kind:BKIND,files:BFILES,poll:BPOLL?{options:BPOLL.options.filter(o=>o.trim()),multi:BPOLL.multi}:null}); }
function boardCall(fn,...args){ google.script.run.withSuccessHandler(j=>{ BD=JSON.parse(j); BMSG=''; keepScroll(drawBoard); })
  .withFailureHandler(e=>{ BMSG=`<span class="moved">⚠️ ${esc(e.message)}</span>`; drawBoard(); })[fn](ME,MYPIN,...args); }
function delPost(id){ if(confirm('Remove this post from the board?')) boardCall('deleteBoardPost',id); }
function editPost(id){ const p=BD.posts.flatMap(x=>[x].concat(x.replies||[])).find(x=>x.id===id); const t=prompt('Edit your post',p?p.text:''); if(t!=null) boardCall('editBoardPost',id,t); }
function kindPost(id,kind){ boardCall('setBoardKind',id,kind); }
/* Keep taps lined up with what's on screen. In the home-screen app all scrolling happens inside the app's
   own scroll area, so the page itself should never be scrolled. iOS can nudge it (keyboard, rubber-band,
   long sessions), which shifts every tap by that amount — snap it back whenever that happens. */
function fixPageShift(){
  const se=document.scrollingElement||document.documentElement;
  if((window.scrollY||se.scrollTop||document.body.scrollTop)&&document.documentElement.classList.contains('shell')){ window.scrollTo(0,0); se.scrollTop=0; document.body.scrollTop=0; }
}
['scroll','resize','orientationchange','focusout','visibilitychange','pageshow'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(fixPageShift,50),{passive:true}));
document.addEventListener('visibilitychange',()=>setTimeout(fixPageShift,50));
if(window.visualViewport){ visualViewport.addEventListener('resize',()=>setTimeout(fixPageShift,50)); visualViewport.addEventListener('scroll',()=>setTimeout(fixPageShift,50)); }
setInterval(fixPageShift,3000);
// Refresh button (circular arrow) in the top bar, just left of the menu
(function addRefreshButton(){
  const mb=document.getElementById('menuBtn'); if(!mb||document.getElementById('hdrRefresh')) return;
  const b=document.createElement('button'); b.id='hdrRefresh'; b.className='hrefresh'; b.setAttribute('aria-label','Refresh scores');
  b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  b.onclick=()=>{ if(b.classList.contains('spin')) return; b.classList.add('spin');
    quietRefresh(true,()=>{ b.classList.remove('spin'); if(GI!=null&&typeof loadDetail==='function') loadDetail(); if(!document.getElementById('board').classList.contains('hidden')) loadBoard(); }); };
  mb.parentNode.insertBefore(b,mb);
})();
function anyLive(){ return !!(D&&D.games.some(g=>isStarted(g)&&g.status!=='Final')); }
let QBUSY=false;
function quietRefresh(force,done){
  if(QBUSY){ if(done) done(); return; } QBUSY=true;
  google.script.run.withSuccessHandler(j=>{ QBUSY=false; HS={}; const sc=document.getElementById('scroller'), y=sc?sc.scrollTop:0; load(j); if(sc) sc.scrollTop=y; if(done) done(); })
    .withFailureHandler(()=>{ QBUSY=false; if(done) done(); }).refreshAndGet(!!force);
}
// While any game is live: refresh scores every minute (skipped while typing or making picks, or if the app is in the background)
setInterval(()=>{ const ae=document.activeElement, typing=ae&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName);
  if(document.hidden||!D||!anyLive()||TAB==='pick'||typing) return; quietRefresh(false); },60000);
// Pull down at the top of any main tab to refresh
(function(){
  let y0=null, x0=0, dy=0, armed=false, t0=0;
  const PULL=230;   // how far (px) you have to drag down before a release refreshes
  const sc=()=>document.getElementById('scroller'), ind=()=>document.getElementById('ptr');
  (function addIndicator(){ const s=sc(), app=document.getElementById('app'); if(!s||!app||document.getElementById('ptr')) return;
    const el=document.createElement('div'); el.id='ptr'; el.innerHTML='<i></i><span>Pull to refresh</span>'; s.insertBefore(el,app); })();
  const atTop=()=>{ const s=sc(); return (s?s.scrollTop:0)<=0&&(window.scrollY||0)<=0; };
  document.addEventListener('touchstart',e=>{ if(!e.target.closest||!e.target.closest('#scroller')||!atTop()||!D){ y0=null; return; } y0=e.touches[0].clientY; x0=e.touches[0].clientX; t0=Date.now(); dy=0; armed=false; },{passive:true});
  document.addEventListener('touchmove',e=>{ if(y0==null) return; dy=e.touches[0].clientY-y0; const el=ind(); if(!el) return;
    if(Math.abs(e.touches[0].clientX-x0)>45){ y0=null; armed=false; el.style.height='0px'; el.classList.remove('armed'); return; }   // sideways swipe — not a pull
    if(dy>0&&atTop()){ const h=Math.min(64,dy*.28); el.style.height=h+'px';                                  // more resistance
      armed=dy>PULL&&Date.now()-t0>250; el.querySelector('span').textContent=armed?'Release to refresh':'Keep pulling to refresh'; el.classList.toggle('armed',armed); } },{passive:true});
  document.addEventListener('touchend',()=>{ if(y0==null) return; y0=null; const el=ind(); if(!el) return;
    if(armed){ el.style.height='56px'; el.classList.add('busy'); el.querySelector('span').textContent='Refreshing…';
      quietRefresh(true,()=>{ el.classList.remove('busy','armed'); el.style.height='0px'; }); }
    else el.style.height='0px'; armed=false; });
})();
function refresh(){
  const b=document.getElementById('rf'); b.textContent='Refreshing…'; b.disabled=true;
  google.script.run.withSuccessHandler(j=>{b.textContent='↻ Refresh scores';b.disabled=false;HS={};load(j);toggleMenu(false);})
    .withFailureHandler(e=>{b.textContent='↻ Refresh scores';b.disabled=false;alert('Refresh failed: '+e.message);}).refreshAndGet();
}
google.script.run.withSuccessHandler(load).withFailureHandler(e=>{document.getElementById('app').innerHTML='<div class="loading">Couldn’t load: '+esc(e.message)+'</div>';}).getAppData();
