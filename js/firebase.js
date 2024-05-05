import {initializeApp} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDjlQ4tOex_17q9CdWEPrtSE8ry0kR2pQ",
  authDomain: "oleg-filimonov.firebaseapp.com",
  projectId: "oleg-filimonov",
  storageBucket: "oleg-filimonov.appspot.com",
  messagingSenderId: "1058156134200",
  appId: "1:1058156134200:web:bf88f69568916b178e8bcd",
  measurementId: "G-G1BNTWHCF7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
