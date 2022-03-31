import { Router } from "@vaadin/router";
import { realtimeDB } from "./rtdb";

// const API_BASE_URL = "https://des6-2.herokuapp.com";
const API_BASE_URL = "http://localhost:3050";

const state = {
  data: {
    // El tagname1 es el p1, y el tagname y tagname2 el p2
    tagname1: null,
    password: null,
    userId: null,
    roomId: null,
    rtdbLongId: null,
    ready1: false,
    online1: false,
    pick1: null,
    score1: 0,

    score2: 0,
    tagname: null,
    tagname2: null,
    userId2: null,
    ready2: false,
    online2: false,
    pick2: null,
  },

  //array de funciones que devuelven data
  listeners: [],

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    console.log("El nuevo estado es: ", newState);
    for (let callback of this.listeners) {
      callback();
    }
  },

  setTagname(inputTagname: string) {
    const currentState = this.getState();
    currentState.tagname = inputTagname;
    this.setState(currentState);
  },

  setPass(inputPass: string) {
    const currentState = this.getState();
    currentState.password = inputPass;
    this.setState(currentState);
  },

  createNewUser(userData) {
    return fetch(API_BASE_URL + "/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
  },

  // La siguiente funcion trae 3 posibles resultados
  // 'Usuario no registrado'
  // false --> Contraseña incorrecta
  // true --> Contraseña y user correctos -> Ingresa
  userAuthentication(userData) {
    return fetch(API_BASE_URL + "/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
  },

  createRoom(userData) {
    return fetch(API_BASE_URL + "/rooms", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
  },

  setRoomId(roomId: string) {
    const currentState = this.getState();
    currentState.roomId = roomId;
    this.setState(currentState);
  },

  //El userId es el mismo valor que el id del documento de la database
  setUserId(userId: string) {
    const currentState = this.getState();
    currentState.userId = userId;
    this.setState(currentState);
  },
  // page /create-or ****************************************************

  setIdToShare(rtdbLongId: string) {
    const currentState = this.getState();
    currentState.rtdbLongId = rtdbLongId;
    this.setState(currentState);
  },

  getIntoARoom(roomCode) {
    return fetch(API_BASE_URL + "/go-to-a-room", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(roomCode),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
        this.hearOnline()
      });
    // hacer un fetch a la API que tiene la informacion de la RTDB?
    // Si no coincide el roomCode, no ingresa. 'message'
    // Si el roomCode coincide, pero el owner no esta. 'message'
    // Si el roomCode coincide, y en el objeto room solo hay 1 objeto (es decir el owner) ---> Ingresar
    // El code va a parar al state
  },

  // tagname que se setea cuando se ingresa como INVITADO
  setTagnameTwo(inputTagname2: string) {
    const currentState = this.getState();
    currentState.tagname2 = inputTagname2;
    this.setState(currentState);
  },

  setActualRoomId(roomID: string) {
    const currentState = this.getState();
    currentState.roomId = roomID;
    this.setState(currentState);
  },

  setOnlineValP1(onlineVal: boolean) {
    const currentState = this.getState();
    currentState.online1 = onlineVal;
    this.setState(currentState);
  },


  // Funcion que escucha cambios del valor online, y los setea en state.data
  hearOnline() {
    const longRoomId = this.getState().rtdbLongId;
    const roomRef = realtimeDB.ref(`rooms/${longRoomId}/currentGame/`);
    // CHECKEAR ESTO DESDE OTRO NAVEGADOR
    // Para testear ambos online
    return roomRef.on("value", (SnapShot) => {
      const playerData = SnapShot.val();
      const p1ON = playerData.player1.online;
      const p2ON = playerData.player2.online;

      console.log('p1 online: ', p1ON);
      console.log('p2 online: ', p2ON);

      console.log(playerData);

      // setea el valor de la rtdb en el state
      const currentState = this.getState();
      currentState.online1 = p1ON;
      currentState.online2 = p2ON;

      this.setState(currentState);
    });
  },

  readyToPlay(player: object) {
    // El dato a enviar tiene que ser player1 o player2
    // En el cliente - page el invitado es el player2
    return fetch(API_BASE_URL + "/readytoplay", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(player),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
  },

  // Escucha a la RTDB y nos envia el 'child' (player1 o player2)
  // Al que se le haya modificado algo
  // En este caso solo actua en el caso que cambie la prop ready.
  hearReadyChanges() {
    const rtdbLongId = this.getState().rtdbLongId;
    const roomRef = realtimeDB.ref(`rooms/${rtdbLongId}/currentGame/`);

    return roomRef.on("value", (SnapShot) => {
      const playerData = SnapShot.val();
      const p1Ready = playerData.player1.ready;
      const p2Ready = playerData.player2.ready;
      const p1tag = playerData.player1.tagname;
      const p2tag = playerData.player2.tagname;

      console.log(playerData);
      console.log('p1 ready:', p1Ready);
      console.log('p2 ready:', p2Ready);

      // set ready in state.data
      const currentState = this.getState();
      currentState.ready1 = p1Ready;
      currentState.ready2 = p2Ready;
      currentState.tagname1 = p1tag;
      currentState.tagname2 = p2tag;
      this.setState(currentState);
    });
  },


  setPicks(playerData: object){
    // El dato a enviar tiene que ser player1 o player2
    // En el cliente - page el invitado es el player2
    return fetch(API_BASE_URL + "/setting-picks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(playerData),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
  },

  setPick1InState(pickVal: string){
    const currentState = this.getState();
    currentState.pick1 = pickVal;
    this.setState(currentState);
  },

  setPick2InState(pickVal: string){
    const currentState = this.getState();
    currentState.pick2 = pickVal;
    this.setState(currentState);
  },


  hearPicks() {
    const rtdbLongId = this.getState().rtdbLongId;

    const roomRef = realtimeDB.ref(`rooms/${rtdbLongId}/currentGame/`);
  
    return roomRef.on("value", (SnapShot) => {
      const playerData = SnapShot.val();
      const player1Pick = playerData.player1.pick;
      const player2Pick = playerData.player2.pick;
 

      console.log(playerData);
      console.log(player1Pick);
      console.log(player2Pick);

      // set picks in state.data
      const currentState = this.getState();
      currentState.pick1 = player1Pick;
      currentState.pick2 = player2Pick;
      this.setState(currentState);
    });
  },

  // Usado en GAME
  addWinPointDB(dataPlayer: object){
    return fetch(API_BASE_URL + "/add-points", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(dataPlayer),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
  },

  // Usado en RESULTS - actualmente no usado
  getScoreDB(roomId){
    return fetch(API_BASE_URL + "/get-score", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(roomId),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;

      });
  },

  // Usado en /win /lose /tie - actualmente no usado
  setActualScore(score){
    const currentState = this.getState();
    currentState.score1 = score.score1;
    currentState.score2 = score.score2;
    this.setState(currentState); 
  },



  // Usar tambien roomRef.off('child_changed... ?
  notReadyToPlay() {},


  // CREAR FUNCION QUE ACTUE CON EL BOTON LOGOUT
  // QUE BORRE o CAMBIE TODA LA INFO DEL PLAYER en cuestion

  // Recibe una func y se la agrega a listeners:[]
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  unsubscribe() {
    this.listeners = [];
  },

};

export { state };
