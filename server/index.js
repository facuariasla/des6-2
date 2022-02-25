"use strict";
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var database_1 = require("./database");
var nanoid_1 = require("nanoid");
var app = express();
var port = process.env.PORT || 3050;
//midlewares
app.use(express.json());
app.use(express.static("../dist"));
app.use(cors());
var usersCollection = database_1.firestore.collection("users");
var roomsColl = database_1.firestore.collection("rooms");
app.get("/testeo", function (req, res) {
    res.json({ parece: "que anda este get" });
});
//MINUTO 35 clase 5 rooms
// el tagname (se revisa si ya existe en la database)
app.post("/signup", function (req, res) {
    // const tagname = req.body.tagname;
    //Es lo mismo que:
    var tagname = req.body.tagname;
    var password = req.body.password;
    usersCollection
        .where("tagname", "==", tagname)
        .get()
        .then(function (searchResponse) {
        // .empty si no existe ese tagname
        if (searchResponse.empty) {
            usersCollection
                .add({ tagname: tagname, password: password })
                .then(function (newUserRef) {
                res.status(200).json({
                    id: newUserRef.id,
                    "new": true,
                    message: "El usuario ".concat(tagname, " ha sido creado")
                });
            });
            // Si el tagname ya existe en la base de datos...
        }
        else {
            res.status(400).json({
                message: "El tagname ingresado ya se encuentra en uso."
            });
        }
    });
});
//Se pasa un tagname, y un password
// revisa si el tagname existe, si no existe da un 'not found'
// si existe, revisa el password de la database con el ingresado
// si no es da FALSE, si es da TRUE
// En el STATE, solo ingresa si es TRUE la respuesta a un fetch
// CHECKEAR SI TENDRIA QUE SER ASI EL MECANISMO
app.post("/auth", function (req, res) {
    var tagname = req.body.tagname;
    var password = req.body.password;
    usersCollection
        .where("tagname", "==", tagname)
        .get()
        .then(function (searchRes) {
        if (searchRes.empty) {
            res.status(400).json({
                message: "El usuario ingresado no existe"
            });
        }
        else {
            searchRes.forEach(function (documentSnapshot) {
                console.log("Found document at ".concat(documentSnapshot.ref.path));
                res.json(documentSnapshot.data().password == password);
            });
        }
    });
});
app.post("/rooms", function (req, res) {
    //requisito usar el userId para crear room nueva
    //recordar que cada user tiene un tagname, userId
    var userId = req.body.userId;
    //buscar en coll /users el doc con el userId
    usersCollection
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        //Si el doc existe crear una room con un id generico
        if (doc.exists) {
            var roomRef_1 = database_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
            //setea la room con las propiedades siguientes
            roomRef_1
                .set({
                currentGame: {
                    userOne: {
                        tagname: "",
                        userId: "",
                        pick: "",
                        online: false,
                        ready: false
                    },
                    userTwo: {
                        tagname: "",
                        userId: "",
                        pick: "",
                        online: false,
                        ready: false
                    }
                },
                owner: userId
            })
                .then(function () {
                //Guardamos el id creado por nanoid para el room
                var roomIdNano = roomRef_1.key;
                var roomId = 1000 + Math.round(Math.random() * 999);
                //roomId usado como nombre del doc de la room collection
                roomsColl
                    .doc(roomId.toString())
                    .set({
                    // y dentro le ponemos el id largo
                    rtdbRoomId: roomIdNano,
                    history: {
                        userOne: 0,
                        userTwo: 0
                    }
                })
                    .then(function () {
                    res.json({
                        id: roomId.toString()
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "User no identificado en la base de datos"
            });
        }
    });
});
app.get('/get-room', function (req, res) {
    // lee la data posteada por /rooms
    // la logica si puede ingresar a la rtdb o no, se maneja en state (?)
});
app.listen(port, function () {
    console.log("API listenting in ".concat(port));
});
// version inicial
// estructura (carpetas/archivos)
// front basico (una pantalla que llame al back)
//back basico (1 endpoint)
//deploy a heroku
//version avanzada
//funciona
//ajustes
//optimizar codigo: volumen, y lectura
//chequeo paso a paso
