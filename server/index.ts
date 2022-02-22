import * as express from "express";
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



// La comparacion de que la password, y la passwordConfirm sean iguales
// Se realiza en la parte del 'front', la data que llega aca son:
// el tagname (se revisa si ya existe en la database) y la password 

//MINUTO 35 clase 5 rooms

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


app.post("/rooms", (req, res) => {
  //requisito usar el userId para crear room nueva
  //recordar que cada user tiene un tagname, userId
  const { userId } = req.body;
  //buscar en coll /users el doc con el userId
  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      //Si el doc existe crear una room con un id generico
      if (doc.exists) {
        const roomRef = rtdb.ref("rooms/" + nanoid());
        //setea la room con las propiedades siguientes
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
            owner: userId,
          })
          .then(() => {
            //Guardamos el id creado por nanoid para el room
            const roomIdNano = roomRef.key;
            const roomId = 1000 + Math.round(Math.random() * 999);
            //roomId usado como nombre del doc de la room collection
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
                });
              });
          });
      } else {
        res.status(401).json({
          message: "User no identificado en la base de datos",
        });
      }
    });
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
