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
app.use(express.static("dist"));
app.use(cors());

const rutaRelativa = path.resolve(__dirname, "../dist/", "index.html");

const usersCollection = firestore.collection("users");
const roomsColl = firestore.collection("rooms");

app.get("/testeo", (req, res) => {
  res.json({ parece: "que anda este get" });
});

// Registrarse
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

// Iniciar sesion
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

//Creacion de room
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
            message:
              "User no identificado en la base de datos. Error en registro o login",
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
                player1: {
                  tagname: tagname,
                  userId: "",
                  pick: "",
                  online: true,
                  ready: false,
                },
                player2: {
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
                  score: {
                    //ver si pongo al creador en tagname 1 y al invitaod en 2
                    player1: {
                      tagname: tagname,
                      score: 0,
                    },
                    player2: {
                      tagname: null,
                      score: 0,
                    },
                  },
                })
                .then(() => {
                  res.json({
                    id: roomId.toString(),
                    userId: searchRes.docs[0].id,
                    rtdbLongId: roomIdNano
                  });
                });
            });
        }
      });
  } catch (err) {
    next(err);
  }
});

// Entrar como invitado
app.post("/go-to-a-room", (req, res) => {
  // const { rtdbLongId } = req.body;
  const { roomId } = req.body;
  const { tagname2 } = req.body;

  
  roomsColl
    .doc(roomId)
    .get()
    .then((searchRes) => {
      if (!searchRes.exists) {
        res.status(401).json({
          message: "El c??digo de sala ingresado no es v??lido",
        });
      } else {
        const roomDBData = searchRes.data();
        const rtdbRoomId = roomDBData.rtdbRoomId;
        const tagnameInDB = roomDBData.score.player2.tagname;

        if(tagnameInDB == null ){
          console.log(rtdbRoomId);
          // Realtime databse
          const roomRef = rtdb.ref("rooms/" + rtdbRoomId + "/currentGame");
          roomRef
            .update({
              player2: {
                tagname: tagname2,
                userId: "",
                pick: "",
                online: true,
                ready: false,
              },
            })
            .then(() => {
              roomsColl
                .doc(roomId)
                .get()
                .then((snap) => {
                  const roomDBData = snap.data();
                  roomDBData.score.player2.tagname = tagname2;
                  // De igual manera para cambiar el SCORE
                  roomsColl
                    .doc(roomId)
                    .update(roomDBData)
                    .then((res) => {
                      console.log(
                        `Document updated at ${res.writeTime.toDate()}`
                      );
                    });
                });
              res.status(201).json({
                tagname2: tagname2,
                roomId: roomId,
                rtdblongId: rtdbRoomId
              });
            });
        } else {
          res.status(401).json({
            message2: 'La sala ya esta llena'
          });
        }
      }
    });
});

// Cambia valor a ready en rtdb
app.post("/readytoplay", (req, res) => {
  const { player } = req.body;
  const { ready } = req.body;
  const { tagname } = req.body;
  const { nanoCode } = req.body;

  roomsColl
    .doc(nanoCode)
    .get()
    .then((snap) => {
      const roomDBData = snap.data();
      const longId = roomDBData.rtdbRoomId;
      console.log(longId);

      const roomRef = rtdb.ref(`rooms/${longId}/currentGame/${player}/`);
      roomRef
        .update({
          online: true,
          pick: "",
          ready: ready,
          tagname: tagname,
          userId: "",
        })
        .then(() => {
          res.status(201).json({
            message: `El ${player} cambio su ready a ${ready}`,
          });
        });
    });
});

app.post("/setting-picks", (req, res) => {
  const { player } = req.body;
  const { pick } = req.body;
  const { nanoCode } = req.body;

  roomsColl
    .doc(nanoCode)
    .get()
    .then((snap) => {
      const roomDBData = snap.data();
      const longId = roomDBData.rtdbRoomId;
      console.log(longId);

      const roomRef = rtdb.ref(`rooms/${longId}/currentGame/${player}/`);
      roomRef
        .update({
          online: true,
          pick: pick,
          // ready: false
        })
        .then(() => {
          res.status(201).json({
            message: `El ${player} ha escogido ${pick}`,
            pick: pick,
          });
        });
    });
});

// Agrega 1 punto al ganador en la db
app.post("/add-points", (req, res) => {
  const { nanoCode } = req.body;
  const { player } = req.body;
  const { tagname } = req.body;

  roomsColl
    .doc(nanoCode)
    .get()
    .then((snap) => {
      const roomDBData = snap.data();
      roomDBData.score[player].score += 1;
      roomDBData.score[player].tagname = tagname;
      // De igual manera para cambiar el SCORE
      roomsColl
        .doc(nanoCode)
        .update(roomDBData)
        .then((res) => {
          console.log(`Point added to ${player} at ${res.writeTime.toDate()}`);
        });
      res.status(201).json({
        score: roomDBData.score,
        message: `Point added to ${player}`,
        tagname: tagname,
        nanoCode: nanoCode,
      });
    });
});

// Usar en RESULTADOS, win lose o tie
app.post("/get-score", (req, res) => {
  const { nanoCode } = req.body;

  roomsColl
    .doc(nanoCode)
    .get()
    .then((snap) => {
      const roomDBData = snap.data();
      console.log(roomDBData);
      res.status(201).json({
        score: roomDBData.score,
      });
    });
});

// Elimina los valores de la rtdb actual y se desconecta (va a home)
// Utilizado en el boton QUIT. 
// A partir del ingreso a la sala en adelante (?)
app.post("/disconect", (req, res) =>{
  const { player } = req.body;
  const { nanoCode } = req.body;

  roomsColl
  .doc(nanoCode)
  .get()
  .then((snap) => {
    const roomDBData = snap.data();
    const longId = roomDBData.rtdbRoomId;
    console.log(longId);

    const roomRef = rtdb.ref(`rooms/${longId}/currentGame/${player}/`);
    roomRef
      .update({
        online: false,
        ready: false,
        pick: "",
        tagname:"",
        userId:""
      })
      .then(() => {
        res.status(201).json({
          message: `El ${player} se ha desconectado`
        });
      });
  });



})


app.listen(port, () => {
  console.log(`API listenting in ${port}`);
});

app.get("*", (req, res) => {
  res.sendFile(`${rutaRelativa}`);
});
