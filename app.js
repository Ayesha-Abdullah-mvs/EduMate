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

const MAIN = ['s-dash','s-study','s-focus','s-analytics','s-groups','s-group-detail'];
let prevScreen = 's-ob1';
let curScreen = 's-ob1';
const IND = {'s-ob1':'① Onboarding — Class Level','s-ob2':'② Onboarding — Subjects','s-dash':'③ Dashboard','s-study':'④ Study Section','s-focus':'⑤ Focus Timer','s-analytics':'⑥ Analytics','s-groups':'⑦ Groups','s-group-detail':'⑧ Group Detail'};

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
  if(id === 's-group-detail') renderGroupLeaderboard('weekly');
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
let activeGroupFilter = 'all';
const groupDetails = {
  uet:{title:'UET CS Batch 2026',desc:'Computer science batch group for OOP, DSA, exams, and daily focus sessions.',icon:'🎓',meta:['243 members','1,284h this week','Very active']},
  bio:{title:'FBISE Biology Toppers',desc:'Board-focused Biology prep circle with quizzes, diagrams, and weekly revision goals.',icon:'🧬',meta:['821 members','2,610h this week','52 live']},
  oop:{title:'OOP C# Night Coders',desc:'Late-night C# learners practicing classes, inheritance, polymorphism, and past-paper questions.',icon:'💻',meta:['1,120 members','3,420h this week','94% activity']},
  fast:{title:'FAST CS Prep Circle',desc:'University CS prep group for programming fundamentals, math, and entry test routines.',icon:'🏫',meta:['678 members','1,980h this week','89% activity']},
  bio9:{title:'9th Biology Sprint',desc:'Matric Biology group for daily topic revision, flashcards, and short quiz streaks.',icon:'🌱',meta:['342 members','940h this week','Public']},
  entry:{title:'UET Entry Test Warriors',desc:'High-energy ECAT preparation group for physics, math, chemistry, and timed practice.',icon:'🚀',meta:['2,034 members','5,110h this week','91% activity']},
  chem12:{title:'12th Chemistry Private Pod',desc:'Small private study pod for FSc Chemistry revision, numericals, and weekly accountability.',icon:'⚗️',meta:['96 members','410h this week','Private']}
};
const leaderboardRows = {
  weekly:[['#1','Ali','12,450 XP'],['#2','Sara','11,900 XP'],['#3','Ayesha','10,120 XP']],
  monthly:[['#1','Sara','48,300 XP'],['#2','Ali','46,870 XP'],['#3','Hamza','39,500 XP']],
  alltime:[['#1','Ahmed','220,450 XP'],['#2','Sara','201,900 XP'],['#3','Ayesha','188,120 XP']]
};
function switchGroupsTab(tab){
  document.getElementById('groups-my')?.classList.toggle('hidden', tab !== 'my');
  document.getElementById('groups-discover')?.classList.toggle('hidden', tab !== 'discover');
  document.getElementById('groups-tab-my')?.classList.toggle('on', tab === 'my');
  document.getElementById('groups-tab-discover')?.classList.toggle('on', tab === 'discover');
}
function setGroupFilter(el,filter){
  activeGroupFilter = filter;
  document.querySelectorAll('.discover-filters .chip').forEach(chip => chip.classList.remove('on'));
  el.classList.add('on');
  filterGroups();
}
function filterGroups(){
  const q = (document.getElementById('group-search')?.value || '').toLowerCase().trim();
  document.querySelectorAll('#discover-list .group-card').forEach(card => {
    const matchesText = !q || card.dataset.search.includes(q) || card.textContent.toLowerCase().includes(q);
    const matchesFilter = activeGroupFilter === 'all' || card.dataset.filter.includes(activeGroupFilter);
    card.style.display = matchesText && matchesFilter ? 'flex' : 'none';
  });
}
function joinGroup(btn){
  btn.textContent = 'Joined ✓';
  btn.disabled = true;
  btn.closest('.group-card')?.classList.add('joined-now');
}
function leaveGroup(btn){
  const card = btn.closest('.group-card');
  if(card){
    card.style.opacity = '.55';
    btn.textContent = 'Left';
    btn.disabled = true;
  }
}
function openGroupDetail(key='uet'){
  const data = groupDetails[key] || groupDetails.uet;
  document.getElementById('detail-title').textContent = data.title;
  document.getElementById('detail-desc').textContent = data.desc;
  const banner = document.querySelector('.detail-banner');
  if(banner) banner.textContent = data.icon;
  const stats = document.querySelector('.detail-stats');
  if(stats) stats.innerHTML = data.meta.map(item => `<span>${item}</span>`).join('');
  goTo('s-group-detail');
  setNav('nav-groups');
}
function setLeaderboardTab(el,range){
  document.querySelectorAll('.leader-tabs button').forEach(btn => btn.classList.remove('on'));
  el.classList.add('on');
  renderGroupLeaderboard(range);
}
function renderGroupLeaderboard(range='weekly'){
  const box = document.getElementById('group-leaderboard');
  if(!box) return;
  box.innerHTML = (leaderboardRows[range] || leaderboardRows.weekly).map(row => `<div class="group-rank"><span>${row[0]}</span><strong>${row[1]}</strong><em>${row[2]}</em></div>`).join('');
}
function showGroups(){goTo('s-groups');setNav('nav-groups');}

updateInd();
renderChapters();
