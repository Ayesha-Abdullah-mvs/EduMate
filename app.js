function switchTab(tab){

  document.getElementById('f-login').style.display = tab === 'login' ? 'block' : 'none';

  document.getElementById('f-signup').style.display = tab === 'signup' ? 'block' : 'none';

  document.getElementById('tb-login').classList.toggle('on', tab === 'login');

  document.getElementById('tb-signup').classList.toggle('on', tab === 'signup');
}
