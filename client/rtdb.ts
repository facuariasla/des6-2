import firebase from "firebase";

const firebaseConfig = {
  apiKey: 'y3RONoSnh1wmYpAqrLTVbtb4peiZbEcBzRa6KbT2',
  authDomain: 'rps-gamedwfm6.firebaseapp.com',
  databaseURL: "https://rps-gamedwfm6-default-rtdb.firebaseio.com"
};

const app = firebase.initializeApp(firebaseConfig);

const realtimeDB = firebase.database();

export{
  realtimeDB
}