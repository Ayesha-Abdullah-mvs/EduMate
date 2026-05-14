function switchTab(tab){
  const login = document.getElementById('f-login');
  const signup = document.getElementById('f-signup');
  const loginTab = document.getElementById('tb-login');
  const signupTab = document.getElementById('tb-signup');
  if(login) login.style.display = tab === 'login' ? 'block' : 'none';
  if(signup) signup.style.display = tab === 'signup' ? 'block' : 'none';
  if(loginTab) loginTab.classList.toggle('on', tab === 'login');
  if(signupTab) signupTab.classList.toggle('on', tab === 'signup');
}

const MAIN = ['s-dash','s-study','s-focus','s-analytics'];
let prevScreen = 's-ob1';
let curScreen = 's-ob1';
const IND = {'s-ob1':'① Onboarding — Class Level','s-ob2':'② Onboarding — Subjects','s-dash':'③ Dashboard','s-study':'④ Study Section','s-focus':'⑤ Focus Timer','s-analytics':'⑥ Analytics'};

function goTo(id){
  const target = document.getElementById(id);
  if(!target) return;
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  target.classList.add('active');
  prevScreen = curScreen;
  curScreen = id;
  const nav = document.getElementById('bnav');
  if(nav) nav.style.display = MAIN.includes(id) ? 'flex' : 'none';
  if(id === 's-analytics') renderAnalytics();
  if(id === 's-study') renderChapters();
  updateInd();
}
function goBack(){goTo(MAIN.includes(prevScreen) ? prevScreen : 's-dash');}
function setNav(id){document.querySelectorAll('.ni').forEach(n => n.classList.remove('on')); const el = document.getElementById(id); if(el) el.classList.add('on');}
function updateInd(){const el = document.getElementById('scr-ind'); if(el) el.textContent = IND[curScreen] || '';}
function pickLvl(el){document.querySelectorAll('.lvl').forEach(c => c.classList.remove('on')); el.classList.add('on');}

const CH = {
  oop:[{t:'Ch.1 — Introduction to OOP',n:3,done:true},{t:'Ch.2 — Classes & Objects',n:5,done:true},{t:'Ch.3 — Encapsulation',n:4,done:true},{t:'Ch.4 — Inheritance & Polymorphism',n:6,done:false},{t:'Ch.5 — Interfaces & Abstract Classes',n:4,done:false},{t:'Ch.6 — Exception Handling',n:3,done:false}],
  bio:[{t:'Ch.1 — Cell Biology & Structure',n:5,done:true},{t:'Ch.2 — Genetics & DNA',n:6,done:false},{t:'Ch.3 — Evolution',n:4,done:false},{t:'Ch.4 — Ecosystems',n:5,done:false}],
  math:[{t:'Ch.1 — Sets & Functions',n:4,done:true},{t:'Ch.2 — Algebra & Equations',n:7,done:true},{t:'Ch.3 — Trigonometry',n:5,done:false},{t:'Ch.4 — Calculus Basics',n:6,done:false}],
  chem:[{t:'Ch.1 — Atomic Structure',n:4,done:true},{t:'Ch.2 — Chemical Bonding',n:5,done:false},{t:'Ch.3 — Stoichiometry',n:4,done:false}]
};
let curSub = 'oop';
let expCh = null;
function filt(el,sub){document.querySelectorAll('#subfilter .chip').forEach(c => c.classList.remove('on')); el.classList.add('on'); curSub = sub; expCh = null; const nm = {oop:'OOP with C#',bio:'Biology',math:'Mathematics',chem:'Chemistry'}; const label = document.getElementById('ch-label'); if(label) label.textContent = `${nm[sub]} — Chapters`; renderChapters();}
function renderChapters(){
  const con = document.getElementById('ch-container');
  if(!con) return;
  con.innerHTML = '';
  (CH[curSub] || []).forEach((c,i) => {
    const exp = expCh === i;
    const d = document.createElement('article');
    d.className = 'ch';
    d.innerHTML = `<div class="ch-top" onclick="expCh=${exp ? 'null' : i};renderChapters()"><div class="ch-left"><div class="ch-num ${c.done ? 'done' : ''}">${c.done ? '✓' : i+1}</div><div><h4>${c.t}</h4><p>${c.n} topics</p></div></div><span style="color:rgba(255,255,255,.35);transform:rotate(${exp ? 180 : 0}deg);transition:.2s">⌄</span></div>${exp ? `<div class="ch-actions"><button class="note">📖 Notes</button><button class="flash">🃏 Flashcards</button><button class="quiz">📝 Quiz</button><button class="ask">🤖 Ask AI</button><button class="wide" onclick="goTo('s-focus');setNav('nav-focus')">⏱ Start Focus Session</button><button class="wide past">📄 View Past Papers</button></div>` : ''}`;
    con.appendChild(d);
  });
}

let running=false, secs=1500, iv=null, earned=0; const TOTAL=1500, CIRC=597;
function toggleTimer(){
  const icon = document.getElementById('play-ico'); const label = document.getElementById('t-lbl');
  if(running){clearInterval(iv); running=false; if(icon) icon.textContent='▶'; if(label) label.textContent='Paused'; return;}
  running=true; if(icon) icon.textContent='Ⅱ'; if(label) label.textContent='Focusing...';
  iv=setInterval(()=>{if(secs>0){secs--; earned=Math.round((1-secs/TOTAL)*120); updTimer();} else {clearInterval(iv); running=false; if(label) label.textContent='Done! 🎉';}},1000);
}
function updTimer(){const display=document.getElementById('t-disp'); const ring=document.getElementById('t-ring'); const xp=document.getElementById('xp-preview'); const m=Math.floor(secs/60), s=secs%60; if(display) display.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; if(ring) ring.setAttribute('stroke-dashoffset', Math.round(CIRC*(secs/TOTAL))); if(xp) xp.textContent=`⚡ +${earned} XP`;}
function resetTimer(){clearInterval(iv); running=false; secs=TOTAL; earned=0; const icon=document.getElementById('play-ico'); const label=document.getElementById('t-lbl'); if(icon) icon.textContent='▶'; if(label) label.textContent='Focus Time'; updTimer();}
function saveSession(){const m=Math.floor((TOTAL-secs)/60); alert(`Session saved!\n📚 OOP (C#) · ${m} minutes\n⚡ +${earned} XP earned 🎉\n\nDatabase updated · Leaderboard refreshed`);}

function renderAnalytics(){
  const bc=document.getElementById('bar-chart');
  if(bc && bc.children.length===0){
    const hrs=[2.5,3,4,2,3.5,1.5,2]; const mx=Math.max(...hrs); const cols=['#7C3AED','#3B82F6','#7C3AED','#10B981','#3B82F6','#F59E0B','#EC4899'];
    hrs.forEach((h,i)=>{const hpx=Math.round((h/mx)*90); bc.innerHTML += `<div class="wbar-wrap"><em>${h}h</em><div class="wbar" style="height:${hpx}px;background:${cols[i]};opacity:${i===4?1:.68}"></div></div>`;});
  }
  const bd=document.getElementById('subj-breakdown');
  if(bd && bd.children.length===0){
    [{n:'OOP (C#)',h:7.5,c:'#3B82F6',p:41},{n:'Biology',h:5,c:'#10B981',p:27},{n:'Chemistry',h:3.5,c:'#EC4899',p:19},{n:'Mathematics',h:2.5,c:'#F59E0B',p:13}].forEach(s=>{bd.innerHTML += `<div class="breakdown-row"><div><strong>${s.n}</strong><span>${s.h}h · ${s.p}%</span></div><div class="ptrack"><div class="pfill" style="width:${s.p}%;background:${s.c}"></div></div></div>`;});
  }
}
function showGroups(){
  window.location.href = 'groups.html';
}

function openHashRoute(){
  const routes = {
    dash:['s-dash','nav-home'],
    study:['s-study','nav-study'],
    focus:['s-focus','nav-focus'],
    analytics:['s-analytics','nav-analytics']
  };
  const route = routes[window.location.hash.replace('#','')];
  if(route){
    goTo(route[0]);
    setNav(route[1]);
  }
}

updateInd();
renderChapters();
openHashRoute();
window.addEventListener('hashchange', openHashRoute);
