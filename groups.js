let activeGroupFilter = 'all';
let activeGroupsTab = 'my';
const joinedGroupKeys = new Set(['uet', 'bio']);

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

function setActiveScreen(id){
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  const indicator = document.getElementById('scr-ind');
  if(indicator) indicator.textContent = id === 's-group-detail' ? '⑧ Group Detail' : '⑦ Groups';
}

function showGroupsList(){
  setActiveScreen('s-groups');
  refreshGroupState();
}

function switchGroupsTab(tab){
  activeGroupsTab = tab;
  document.getElementById('groups-my')?.classList.toggle('hidden', tab !== 'my');
  document.getElementById('groups-discover')?.classList.toggle('hidden', tab !== 'discover');
  document.getElementById('groups-tab-my')?.classList.toggle('on', tab === 'my');
  document.getElementById('groups-tab-discover')?.classList.toggle('on', tab === 'discover');
  refreshGroupState();
}

function setGroupFilter(el,filter){
  activeGroupFilter = filter;
  document.querySelectorAll('.discover-filters .chip').forEach(chip => chip.classList.remove('on'));
  el.classList.add('on');
  filterGroups();
}

function filterGroups(){
  const q = (document.getElementById('group-search')?.value || '').toLowerCase().trim();
  let visibleCount = 0;
  document.querySelectorAll('#discover-list .group-card').forEach(card => {
    const searchText = `${card.dataset.search || ''} ${card.textContent}`.toLowerCase();
    const filterText = card.dataset.filter || '';
    const matchesText = !q || searchText.includes(q);
    const matchesFilter = activeGroupFilter === 'all' || filterText.includes(activeGroupFilter);
    const isVisible = matchesText && matchesFilter;
    card.classList.toggle('hidden-card', !isVisible);
    if(isVisible) visibleCount++;
  });

  const empty = document.getElementById('discover-empty');
  if(empty) empty.classList.toggle('hidden', visibleCount !== 0);
  const count = document.getElementById('discover-count');
  if(count) count.textContent = `${visibleCount} group${visibleCount === 1 ? '' : 's'} found`;
}

function joinGroup(btn){
  const card = btn.closest('.group-card');
  const key = card?.dataset.group;
  if(key) joinedGroupKeys.add(key);

  const isRequest = btn.textContent.includes('Request');
  btn.textContent = isRequest ? 'Requested ✓' : 'Joined ✓';
  btn.disabled = true;
  card?.classList.add('joined-now');

  refreshGroupState();
  showGroupToast(isRequest ? 'Request sent! We’ll notify you after approval.' : 'Joined! Added to your study circles.');
}

function leaveGroup(btn){
  const card = btn.closest('.group-card');
  const key = card?.dataset.group;
  if(key) joinedGroupKeys.delete(key);
  if(card){
    card.style.opacity = '.55';
    btn.textContent = 'Left';
    btn.disabled = true;
  }
  refreshGroupState();
  showGroupToast('Group removed from your circles.');
}

function openGroupDetail(key='uet'){
  const data = groupDetails[key] || groupDetails.uet;
  document.getElementById('detail-title').textContent = data.title;
  document.getElementById('detail-desc').textContent = data.desc;
  const banner = document.querySelector('.detail-banner');
  if(banner) banner.textContent = data.icon;
  const stats = document.querySelector('.detail-stats');
  if(stats) stats.innerHTML = data.meta.map(item => `<span>${item}</span>`).join('');
  renderGroupLeaderboard('weekly');
  setActiveScreen('s-group-detail');
}

function setLeaderboardTab(el,range){
  document.querySelectorAll('.leader-tabs button').forEach(btn => btn.classList.remove('on'));
  el.classList.add('on');
  renderGroupLeaderboard(range);
}

function renderGroupLeaderboard(range='weekly'){
  const box = document.getElementById('group-leaderboard');
  if(!box) return;
  box.innerHTML = (leaderboardRows[range] || leaderboardRows.weekly)
    .map(row => `<div class="group-rank"><span>${row[0]}</span><strong>${row[1]}</strong><em>${row[2]}</em></div>`)
    .join('');
}

function refreshGroupState(){
  document.querySelectorAll('#discover-list .group-card').forEach(card => {
    const key = card.dataset.group;
    const primary = card.querySelector('.group-actions button:first-child');
    if(!key || !primary) return;
    const isPrivate = primary.textContent.includes('Request') || card.dataset.filter?.includes('private');
    if(joinedGroupKeys.has(key)){
      primary.textContent = isPrivate ? 'Requested ✓' : 'Joined ✓';
      primary.disabled = true;
      card.classList.add('joined-now');
    }
  });

  const joinedCount = document.getElementById('joined-count');
  if(joinedCount) joinedCount.textContent = `${joinedGroupKeys.size} active circles`;
  filterGroups();
}

function showGroupToast(message){
  const toast = document.getElementById('group-toast');
  if(!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showGroupToast.timer);
  showGroupToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

renderGroupLeaderboard('weekly');
refreshGroupState();
