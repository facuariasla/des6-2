"use strict";
exports.__esModule = true;
exports.rtdb = exports.firestore = void 0;
var admin = require("firebase-admin");
var serviceAccount = require("./rps-game-key.json");
// const serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rps-gamedwfm6-default-rtdb.firebaseio.com"
});
var firestore = admin.firestore();
exports.firestore = firestore;
var rtdb = admin.database();
exports.rtdb = rtdb;
