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

const SUBJECT_NAMES = {oop:'OOP with C#',bio:'Biology',math:'Mathematics',chem:'Chemistry'};
const CH = {
  oop:[
    {t:'Ch.1 — Introduction to OOP',done:true,subs:['Classes vs objects','Four pillars of OOP','C# program structure']},
    {t:'Ch.2 — Classes & Objects',done:true,subs:['Fields and methods','Constructors','Object lifecycle','Access modifiers','Static members']},
    {t:'Ch.3 — Encapsulation',done:true,subs:['Properties','Getters and setters','Data hiding','Validation rules']},
    {t:'Ch.4 — Inheritance & Polymorphism',done:false,subs:['Base and derived classes','Method overriding','Virtual methods','Runtime polymorphism','Sealed classes','Object casting']},
    {t:'Ch.5 — Interfaces & Abstract Classes',done:false,subs:['Interface contracts','Abstract members','Multiple interfaces','Dependency inversion']},
    {t:'Ch.6 — Exception Handling',done:false,subs:['Try/catch/finally','Custom exceptions','Debugging errors']}
  ],
  bio:[
    {t:'Ch.1 — Cell Biology & Structure',done:true,subs:['Cell organelles','Membrane transport','Microscopy','Cell cycle','Specialized cells']},
    {t:'Ch.2 — Genetics & DNA',done:false,subs:['DNA structure','Genes and alleles','Mendelian inheritance','Punnett squares','Mutations','Genetic disorders']},
    {t:'Ch.3 — Evolution',done:false,subs:['Natural selection','Adaptation','Speciation','Evidence of evolution']},
    {t:'Ch.4 — Ecosystems',done:false,subs:['Food chains','Energy flow','Biogeochemical cycles','Population changes','Human impact']}
  ],
  math:[
    {t:'Ch.1 — Sets & Functions',done:true,subs:['Set notation','Domain and range','Composite functions','Inverse functions']},
    {t:'Ch.2 — Algebra & Equations',done:true,subs:['Linear equations','Quadratics','Inequalities','Matrices','Sequences','Word problems','Graphing']},
    {t:'Ch.3 — Trigonometry',done:false,subs:['Ratios','Identities','Graphs','Solving triangles','Applications']},
    {t:'Ch.4 — Calculus Basics',done:false,subs:['Limits','Derivatives','Rules of differentiation','Tangents','Optimization','Intro integration']}
  ],
  chem:[
    {t:'Ch.1 — Atomic Structure',done:true,subs:['Protons neutrons electrons','Isotopes','Electron configuration','Periodic trends']},
    {t:'Ch.2 — Chemical Bonding',done:false,subs:['Ionic bonding','Covalent bonding','Metallic bonding','Polarity','Intermolecular forces']},
    {t:'Ch.3 — Stoichiometry',done:false,subs:['Moles','Balancing equations','Limiting reagent','Percentage yield']}
  ]
};
let curSub = 'oop';
let expCh = null;
let studyMode = 'chapters';
let selectedTopics = new Set();
let unlockedPhase = 0;

function filt(el,sub){
  document.querySelectorAll('#subfilter .chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  curSub = sub;
  expCh = null;
  selectedTopics = new Set();
  studyMode = 'chapters';
  closeStudyPlanner();
  updateChapterLabel();
  renderChapters();
}
function chapterTopicCount(chapter){return (chapter.subs || []).length || chapter.n || 0;}
function updateChapterLabel(){
  const label = document.getElementById('ch-label');
  if(label) label.textContent = `${SUBJECT_NAMES[curSub]} — Chapters`;
}
function renderChapters(){
  const con = document.getElementById('ch-container');
  if(!con) return;
  updateChapterLabel();
  con.innerHTML = '';
  (CH[curSub] || []).forEach((c,i) => {
    const exp = expCh === i;
    const d = document.createElement('article');
    d.className = 'ch';
    const subList = (c.subs || []).map(s => `<span>${s}</span>`).join('');
    d.innerHTML = `<div class="ch-top" onclick="expCh=${exp ? 'null' : i};renderChapters()"><div class="ch-left"><div class="ch-num ${c.done ? 'done' : ''}">${c.done ? '✓' : i+1}</div><div><h4>${c.t}</h4><p>${chapterTopicCount(c)} topics</p></div></div><span style="color:rgba(255,255,255,.35);transform:rotate(${exp ? 180 : 0}deg);transition:.2s">⌄</span></div>${exp ? `<div class="chapter-subtopics">${subList}</div><div class="ch-actions"><button class="note">📖 Notes</button><button class="flash">🃏 Flashcards</button><button class="quiz">📝 Quiz</button><button class="ask">🤖 Ask AI</button><button class="wide" onclick="goTo('s-focus');setNav('nav-focus')">⏱ Start Focus Session</button><button class="wide past">📄 View Past Papers</button></div>` : ''}`;
    con.appendChild(d);
  });
}
function openStudyPlanner(){
  studyMode = 'planner';
  selectedTopics = new Set();
  const planner = document.getElementById('study-planner');
  const roadmap = document.getElementById('study-roadmap');
  const chapters = document.getElementById('chapter-list');
  if(!planner) return;
  if(roadmap) roadmap.classList.add('hidden');
  if(chapters) chapters.classList.add('hidden');
  planner.classList.remove('hidden');
  renderStudyPlanner();
}
function closeStudyPlanner(){
  const planner = document.getElementById('study-planner');
  const roadmap = document.getElementById('study-roadmap');
  const chapters = document.getElementById('chapter-list');
  if(planner) planner.classList.add('hidden');
  if(roadmap) roadmap.classList.add('hidden');
  if(chapters) chapters.classList.remove('hidden');
}
function flattenTopics(){
  return (CH[curSub] || []).flatMap((chapter, chapterIndex) => (chapter.subs || []).map((topic, topicIndex) => ({
    id:`${chapterIndex}-${topicIndex}`,
    chapter:chapter.t,
    topic
  })));
}
function renderStudyPlanner(){
  const planner = document.getElementById('study-planner');
  if(!planner) return;
  const topics = flattenTopics();
  const timeValue = document.getElementById('plan-time')?.value || '2';
  const unitValue = document.getElementById('plan-unit')?.value || 'hours';
  const countValue = document.getElementById('plan-topic-count')?.value || Math.min(6, topics.length);
  planner.innerHTML = `
    <div class="planner-head"><div><div class="lbl">AI Roadmap Builder</div><h3>${SUBJECT_NAMES[curSub]} study plan</h3><p>Tell AI your available time, then choose chapters and subtopics.</p></div><button class="mini-close" onclick="closeStudyPlanner()">×</button></div>
    <div class="planner-form">
      <label><span>How much time do you have?</span><input id="plan-time" class="inp" type="number" min="1" value="${timeValue}" inputmode="numeric"></label>
      <label><span>Time unit</span><select id="plan-unit" class="inp">${['hours','days','weeks','months'].map(unit => `<option ${unit === unitValue ? 'selected' : ''}>${unit}</option>`).join('')}</select></label>
      <label><span>How many topics?</span><input id="plan-topic-count" class="inp" type="number" min="1" max="${topics.length}" value="${countValue}" inputmode="numeric"></label>
    </div>
    <div class="planner-toolbar"><button class="btn-ghost" onclick="autoPickTopics()">✨ AI pick topics</button><button class="btn-ghost" onclick="selectedTopics.clear();renderStudyPlanner()">Clear</button></div>
    <div class="topic-picker">${topics.map(item => `<button class="topic-chip ${selectedTopics.has(item.id) ? 'on' : ''}" onclick="toggleTopic('${item.id}')"><strong>${item.topic}</strong><span>${item.chapter.replace(' — ',' · ')}</span></button>`).join('')}</div>
    <button class="btn" onclick="generateStudyRoadmap()">Generate locked AI roadmap →</button>`;
}
function toggleTopic(id){
  if(selectedTopics.has(id)) selectedTopics.delete(id); else selectedTopics.add(id);
  renderStudyPlanner();
}
function autoPickTopics(){
  const topics = flattenTopics();
  const count = Math.max(1, Number(document.getElementById('plan-topic-count')?.value) || 6);
  selectedTopics = new Set(topics.slice(0, count).map(t => t.id));
  renderStudyPlanner();
}
function generateStudyRoadmap(){
  const topics = flattenTopics();
  const time = Math.max(1, Number(document.getElementById('plan-time')?.value) || 1);
  const unit = document.getElementById('plan-unit')?.value || 'hours';
  const count = Math.max(1, Number(document.getElementById('plan-topic-count')?.value) || selectedTopics.size || 1);
  if(selectedTopics.size === 0) selectedTopics = new Set(topics.slice(0, count).map(t => t.id));
  const chosen = topics.filter(t => selectedTopics.has(t.id)).slice(0, count);
  const planner = document.getElementById('study-planner');
  const roadmap = document.getElementById('study-roadmap');
  if(planner) planner.classList.add('hidden');
  if(!roadmap) return;
  unlockedPhase = 0;
  roadmap.classList.remove('hidden');
  renderRoadmap(chosen, time, unit);
}
function timeBlock(i, total, unit){
  if(unit === 'hours') return `Hour ${Math.min(i + 1, total)} of ${total}`;
  if(unit === 'days') return `Day ${Math.min(i + 1, total)} of ${total}`;
  if(unit === 'weeks') return `Week ${Math.floor(i / 2) + 1} sprint`;
  return `Month ${Math.floor(i / 3) + 1} milestone`;
}
function renderRoadmap(topics, time, unit){
  const roadmap = document.getElementById('study-roadmap');
  if(!roadmap) return;
  const topicNames = topics.map(t => t.topic).join(', ');
  const phases = [
    {icon:'📘',title:'Learn Definitions',desc:'Master terms, concepts, and basic understanding before moving forward.',material:'AI provides glossary cards, simple definitions, and quick examples.'},
    {icon:'🧠',title:'Detailed Notes',desc:'Read simplified notes with explanations, examples, and visual learning prompts.',material:'AI creates structured notes, diagrams to draw, and example walkthroughs.'},
    {icon:'📝',title:'Quiz System',desc:'Answer MCQs, short questions, and practice checks to prove understanding.',material:'AI generates a mixed quiz and unlocks next only after completion.'},
    {icon:'🃏',title:'Flashcards',desc:'Memorize high-value facts, formulas, keywords, and common mistakes.',material:'AI turns each topic into spaced-repetition flashcards.'},
    {icon:'📄',title:'Past Papers',desc:'Practice previous exam patterns, important questions, and marking schemes.',material:'AI recommends exam-style questions for the selected chapters.'},
    {icon:'🔁',title:'Revision',desc:'Final revision mode with weak-area review and confidence checklist.',material:'AI builds a last-pass revision sheet and rapid test.'}
  ];
  roadmap.innerHTML = `
    <div class="roadmap-hero"><button class="mini-close" onclick="openStudyPlanner()">←</button><div><div class="lbl">AI generated smart roadmap</div><h3>${SUBJECT_NAMES[curSub]}</h3><p>${time} ${unit} · ${topics.length} topics · locked game progression</p></div></div>
    <div class="selected-summary"><strong>Selected topics</strong><p>${topicNames}</p></div>
    <div class="timeline-card"><strong>Time-by-time plan</strong>${topics.map((t,i) => `<div><span>${timeBlock(i, time, unit)}</span><p><b>${t.topic}</b> — definitions → notes → quiz checkpoint.</p></div>`).join('')}</div>
    <div class="phase-list">${phases.map((phase,i) => renderPhase(phase,i)).join('')}</div>`;
}
function renderPhase(phase, i){
  const locked = i > unlockedPhase;
  const done = i < unlockedPhase;
  const action = done ? 'Completed ✓' : locked ? 'Locked' : 'Complete to unlock next';
  return `<article class="phase-card ${locked ? 'locked' : ''} ${done ? 'done' : ''}"><div class="phase-badge">${locked ? '🔒' : phase.icon}</div><div><div class="phase-top"><h4>Phase ${i+1} — ${phase.title}</h4><span>${done ? 'Done' : locked ? 'Locked' : 'Active'}</span></div><p>${phase.desc}</p><em>${phase.material}</em><button ${locked || done ? 'disabled' : ''} onclick="unlockNextPhase()">${action}</button></div></article>`;
}
function unlockNextPhase(){
  unlockedPhase = Math.min(unlockedPhase + 1, 6);
  generateStudyRoadmapFromCurrent();
}
function generateStudyRoadmapFromCurrent(){
  const topics = flattenTopics().filter(t => selectedTopics.has(t.id));
  const time = Math.max(1, Number(document.getElementById('plan-time')?.value) || topics.length || 1);
  const unit = document.getElementById('plan-unit')?.value || 'days';
  renderRoadmap(topics, time, unit);
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
