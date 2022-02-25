import * as express from "express";
// Usar para archivos estaticos:
import * as path from "path";
import * as cors from "cors";
import { rtdb, firestore } from "./database";
import { nanoid } from "nanoid";

const app = express();
const port = process.env.PORT || 3050;

//midlewares
app.use(express.json());
app.use(express.static("../dist"));
app.use(cors());

const usersCollection = firestore.collection("users");
const roomsColl = firestore.collection("rooms");

app.get("/testeo", (req, res) => {
  res.json({ parece: "que anda este get" });
});

app.post("/signup", (req, res) => {
  // const tagname = req.body.tagname;
  //Es lo mismo que:
  const { tagname } = req.body;
  const { password } = req.body;
  usersCollection
    .where("tagname", "==", tagname)
    .get()
    .then((searchResponse) => {
      // .empty si no existe ese tagname
      if (searchResponse.empty) {
        usersCollection
          .add({ tagname: tagname, password: password })
          .then((newUserRef) => {
            usersCollection;
            res.status(200).json({
              id: newUserRef.id,
              new: true,
              message: `El usuario ${tagname} ha sido creado`,
            });
          });
        // Si el tagname ya existe en la base de datos...
      } else {
        res.status(400).json({
          message: "El tagname ingresado ya se encuentra en uso.",
        });
      }
    });
});

app.post("/auth", (req, res) => {
  const { tagname } = req.body;
  const { password } = req.body;

  usersCollection
    .where("tagname", "==", tagname)
    .get()
    .then((searchRes) => {
      if (searchRes.empty) {
        res.status(400).json({
          message: "El usuario ingresado no existe",
        });
      } else {
        searchRes.forEach((documentSnapshot) => {
          console.log(`Found document at ${documentSnapshot.ref.path}`);
          res.json(documentSnapshot.data().password == password);
        });
      }
    });
});

// create-or ***********************************************************

app.post("/rooms", (req, res) => {
  //requisito usar el userId para crear room nueva
  //recordar que cada user tiene un tagname, userId
  const { tagname } = req.body;
  //buscar en coll /users el doc con el userId
  usersCollection
    .where("tagname", "==", tagname)
    .get()
    .then((searchRes) => {
      if (searchRes.empty) {
        res.status(401).json({
          message: "User no identificado en la base de datos. Error en registro o login",
        });
      } else {
        const roomRef = rtdb.ref("rooms/" + nanoid());
        // Room las sig propiedades
        // seteo en userOne al que CREA la sala? 
        // y en userTwo al que intenta ingresar?
        roomRef
          .set({
            currentGame: {
              userOne: {
                tagname: "",
                userId: "",
                pick: "",
                online: false,
                ready: false,
              },
              userTwo: {
                tagname: "",
                userId: "",
                pick: "",
                online: false,
                ready: false,
              },
            },
            owner: searchRes.docs[0].id,
          })
          .then(() => {
            const roomIdNano = roomRef.key;
            const roomId = 1000 + Math.round(Math.random() * 999);

            roomsColl
              .doc(roomId.toString())
              .set({
                // y dentro le ponemos el id largo
                rtdbRoomId: roomIdNano,
                history: {
                  userOne: 0,
                  userTwo: 0,
                },
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                  userId: searchRes.docs[0].id,
                });
              });
          });
      }
    });
});

app.get("/get-room", (req, res) => {
  // lee la data posteada por /rooms
  // la logica si puede ingresar a la rtdb o no, se maneja en state (?)
});

app.listen(port, () => {
  console.log(`API listenting in ${port}`);
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
