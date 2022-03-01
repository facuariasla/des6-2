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

const rutaRelativa = path.resolve(__dirname, "../dist/", "index.html");


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

app.post("/rooms", (req, res, next) => {
  try {
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
        // Creacion de la sala en la rtdb
        const roomRef = rtdb.ref("rooms/" + nanoid());
        // Room las sig propiedades
        // seteo en user1 al que CREA la sala? (igual para userId)
        // y en userTwo al que intenta ingresar? (endpoint /go-to-a-room)
        roomRef
          .set({
            currentGame: {
              user1: {
                tagname: tagname,
                userId: "",
                pick: "",
                online: false,
                ready: false,
              },
              user2: {
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
            //Creacion de la sala en la database
            const roomIdNano = roomRef.key;
            const roomId = 1000 + Math.round(Math.random() * 999);

            roomsColl
              .doc(roomId.toString())
              .set({
                // y dentro le ponemos el id largo
                rtdbRoomId: roomIdNano,
                history: {
                  //ver si pongo al creador en tagname 1 y al invitaod en 2
                  tagname1: tagname,
                  user1: 0,
                  tagname2:"",
                  user2: 0,
                },
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                  userId: searchRes.docs[0].id,
                  rtdbLongId: roomIdNano,
                });
              });
          });
      }
    });
 
  } catch (err) {
    next(err);
  }

});

app.post("/go-to-a-room", (req, res) => {

  const { rtdbLongId } = req.body;
  const { tagname2 } = req.body;

  roomsColl
    .where("rtdbRoomId", "==", rtdbLongId)
    .get()
    .then((searchRes) => {
      if (searchRes.empty) {
        res.status(401).json({
          message: "El código de sala ingresado no es válido",
        });
      } else {
        const roomRef = rtdb.ref("rooms/" + rtdbLongId + "/currentGame");
        roomRef.update({
          user2: {
            tagname: tagname2,
            userId: "",
            pick: "",
            online: true,
            ready: false,
          },
        })
        res.status(201).json({
          tagname2: tagname2,
          nanoCode: searchRes.docs[0].id
        });
      }

    })

  // lee la data posteada por /rooms
  // la logica si puede ingresar a la rtdb o no, se maneja en state (?)
  // Comienza a escribir en el objeto de la rtdb
  // El solo hecho de poenr el code, le da el valor de online:true
  // Poner RESTRICCION de que si el objeto SALA tiene una longitud de 2, no te deje ingresar r
  //
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



// Cualquier ruta no existente me envia a /index.html
app.get("*", (req, res) => {
  res.sendFile(`${rutaRelativa}`);
});
 