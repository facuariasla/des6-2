import * as admin from "firebase-admin";
import * as serviceAccount from "./rps-game-key.json"
// const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://rps-gamedwfm6-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };

