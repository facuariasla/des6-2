import { Router } from "@vaadin/router";
import { rtdb } from "../server/database";

// const API_BASE_URL = "https://des6-2.herokuapp.com";
const API_BASE_URL = "http://localhost:3050";

const state = {
  data:{
    tagname: null,
    password: null,
    userId: null,
    roomId: null,
    rtdbLongId:null,

    tagname2: null,
    userId2: null,

  },

  //array de funciones que devuelven data
  listeners:[],

  getState(){
    return this.data
  },

  setState(newState){
    this.data = newState;
    console.log("El nuevo estado es: ", newState)
    for(let callback of this.listeners){
      callback();
    }
  },


  setTagname(inputTagname: string){
    const currentState = this.getState();
    currentState.tagname = inputTagname;
    this.setState(currentState);
  },

  setPass(inputPass: string){
    const currentState = this.getState();
    currentState.password = inputPass;
    this.setState(currentState);
  },
  
  createNewUser(userData){
    return fetch(API_BASE_URL + "/signup", {
      method:'POST',
      headers: { "content-type": "application/json"},
      body: JSON.stringify(userData),
    })
    .then((res)=>{
      return res.json();
    })
    .then((data) => {
      return data;
    })
  },

  // La siguiente funcion trae 3 posibles resultados
  // 'Usuario no registrado'
  // false --> Contraseña incorrecta
  // true --> Contraseña y user correctos -> Ingresa
  userAuthentication(userData){
    return fetch(API_BASE_URL + "/auth", {
      method:'POST',
      headers: { "content-type": "application/json"},
      body: JSON.stringify(userData),
      
    })
    .then((res)=>{
      return res.json();
    })
    .then((data) => {
      return data;
    })
  },

  createRoom(userData){
    return fetch(API_BASE_URL + "/rooms", {
      method:'POST',
      headers: { "content-type": "application/json"},
      body: JSON.stringify(userData),
    })
    .then((res)=>{
      return res.json();
    })
    .then((data) => {
      return data;
    })
  },

  setRoomId(roomId: string){
    const currentState = this.getState();
    currentState.roomId = roomId;
    this.setState(currentState);
  },

  //El userId es el mismo valor que el id del documento de la database
  setUserId(userId: string){
    const currentState = this.getState();
    currentState.userId = userId;
    this.setState(currentState);
  },
  // page /create-or ****************************************************

  setIdToShare(rtdbLongId: string){
    const currentState = this.getState();
    currentState.rtdbLongId = rtdbLongId;
    this.setState(currentState);
  },

  getIntoARoom(roomCode){
    return fetch(API_BASE_URL + "/go-to-a-room", {
      method:'POST',
      headers: { "content-type": "application/json"},
      body: JSON.stringify(roomCode),
    })
    .then((res)=>{
      return res.json();
    })
    .then((data) => {
      return data;
    })
    // hacer un fetch a la API que tiene la informacion de la RTDB?
    // Si no coincide el roomCode, no ingresa. 'message'
    // Si el roomCode coincide, pero el owner no esta. 'message'
    // Si el roomCode coincide, y en el objeto room solo hay 1 objeto (es decir el owner) ---> Ingresar
    // El code va a parar al state
  },

  // tagname que se setea cuando se ingresa como INVITADO
  setTagnameTwo(inputTagname2: string){
    const currentState = this.getState();
    currentState.tagname2 = inputTagname2;
    this.setState(currentState);
  },

  waitingPlayer2(longRoomId: string){

  },


   // Recibe una func y se la agrega a listeners:[]
   subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },





}

export { state };