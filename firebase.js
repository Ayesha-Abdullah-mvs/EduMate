// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1wtbJh4IedR_rT66rkxugIPL3Wqd8l8I",
  authDomain: "edumate-klam.firebaseapp.com",
  projectId: "edumate-klam",
  storageBucket: "edumate-klam.firebasestorage.app",
  messagingSenderId: "603074031695",
  appId: "1:603074031695:web:adc57aa9370f7a1fa7ba3a",
  measurementId: "G-KS1HCZQSN1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();


// SIGN UP
function signup() {

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  auth.createUserWithEmailAndPassword(email, password)

    .then((userCredential) => {

      document.getElementById("signupStatus").innerText =
        "Account created successfully!";

      console.log("User Created:", userCredential.user);

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);

    })

    .catch((error) => {

      console.error(error);

      document.getElementById("signupStatus").innerText =
        error.message;
    });
}


// LOGIN
function login() {

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)

    .then((userCredential) => {

      document.getElementById("loginStatus").innerText =
        "Login successful!";

      console.log("Logged In:", userCredential.user);

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);

    })

    .catch((error) => {

      console.error(error);

      document.getElementById("loginStatus").innerText =
        error.message;
    });
}


// GOOGLE AUTH
function googleAuth() {

  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)

    .then((result) => {

      console.log("Google Login:", result.user);

      window.location.href = "dashboard.html";
    })

    .catch((error) => {

      console.error(error);

      alert(error.message);
    });
}


// AUTH STATE
auth.onAuthStateChanged((user) => {

  if (user) {
    console.log("Current User:", user.email);
  } else {
    console.log("No user logged in");
  }
});
