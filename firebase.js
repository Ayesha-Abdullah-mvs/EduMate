const firebaseConfig = {
  apiKey: "AIzaSyD1wtbJh4IedR_rT66rkxugIPL3Wqd8l8I",
  authDomain: "edumate-klam.firebaseapp.com",
  projectId: "edumate-klam",
  storageBucket: "edumate-klam.firebasestorage.app",
  messagingSenderId: "603074031695",
  appId: "1:603074031695:web:adc57aa9370f7a1fa7ba3a",
  measurementId: "G-KS1HCZQSN1"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function signup(){
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  auth.createUserWithEmailAndPassword(email,password)
    .then(()=>{
      document.getElementById('signupStatus').innerText='Account created successfully!';

      setTimeout(()=>{
        window.location.href='dashboard.html';
      },1200);
    })
    .catch(err=>{
      document.getElementById('signupStatus').innerText=err.message;
    });
}

function login(){
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  auth.signInWithEmailAndPassword(email,password)
    .then(()=>{
      document.getElementById('loginStatus').innerText='Login successful!';

      setTimeout(()=>{
        window.location.href='dashboard.html';
      },1200);
    })
    .catch(err=>{
      document.getElementById('loginStatus').innerText=err.message;
    });
}

function googleAuth(){
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(()=>{
      window.location.href='dashboard.html';
    })
    .catch(err=>{
      alert(err.message);
    });
}

firebase.auth().onAuthStateChanged(user=>{
  if(user){
    console.log('User logged in:',user.email);
  }
});
