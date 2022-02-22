import { Router } from "@vaadin/router";

const API_BASE_URL = "link de heroku";

const state = {



  data:{
    tagname: null,
    password: null,
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
  
  subscribe(){},


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





}

export { state };