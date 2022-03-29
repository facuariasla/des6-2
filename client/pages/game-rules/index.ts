import { Router } from "@vaadin/router";
import { state } from "../../state";
const background = require("url:../../assets/fondo.svg");

class GameRules extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    
    this.render();
    const $style = document.createElement("style");
    $style.setAttribute("class", "style");
    $style.innerHTML = `
    *{
      box-sizing: border-box;
    }
    body{
      margin: 0;
    }
    p, a, button, input {
      font-family: 'Odibee Sans', cursive;
      letter-spacing: 1px;
      margin: 0;
    }
    
    .container{
      height: 100vh;
      grid-template-columns: 1fr;
      grid-template-rows: 8vh 60vh;
      display: grid;
      background-image: url(${background});
    }
    /* //////////////////////////////////// */
    .header{
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: center;
      font-size: 16px;
    }
    .header .logout-btn{
      margin-left: 5px;
      text-decoration: none;
      color: red;
    }
    .header .tagname{
      display: grid;
      justify-items: center;
      font-size: 22px;
      color: orange;
    }
    .header .room-data{
      display: grid;
      justify-self: flex-end;
      margin-right: 5px;
      font-size: 18px;
    }
    /* ////////////////// */
    .container-mid{
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 40vh 20vh;
      justify-items: center;
      align-items: center;
      place-content: center;
    }
    .container-mid p{
      font-size: 42px;
      text-align: center;
      width: 70vw;
    }
    .container-mid button{
      height: 65px;
      width: 250px;
      font-size: 32px;
      background-color:#006CFC ;
      border: 8px #001997 solid;
      border-radius: 6px;
      color: #fff
    }
    .container-mid button:active {
      box-shadow: 7px 6px 15px 1px rgba(0, 0, 0, 0.24);
      transform: translateY(4px);
      background-color: #368af8;
    }
    `;
    this.shadow.appendChild($style);
    this.addListeners();
  }

  render() {
    const tagNameVal = state.getState().tagname;
    const roomIdVal = state.getState().roomId;

    const $homePage = document.createElement("div");
    $homePage.setAttribute("class", "container");

    $homePage.innerHTML = `
    <header class="header">
      <a href="" class="logout-btn">logout</a>
      <p class="tagname">${tagNameVal}</p>
      <div class="room-data">
        <p class="room">SALA:</p>
        <p class="room-value">${roomIdVal}</p>
      </div>
    </header>
  
    <div class="container-mid">
      <p class="rules-text">Presiona jugar y elegí: piedra, papel o tijeras antes de que pasen los 3 segundos</p>
      <button class="play-game">Jugar!</button>
    </div>

    `;
    this.shadow.appendChild($homePage);
  }

  addListeners() {
    const $logOutBtn = <HTMLInputElement>this.shadow.querySelector('.logout-btn');

    $logOutBtn.addEventListener('click', () =>{
      sessionStorage.removeItem('rps.player');
      state.setState({
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
      });
      Router.go('/')
    })

    const $playBtn = <HTMLInputElement>this.shadow.querySelector(".play-game");

      const dataplayer1 = {
        tagname: state.getState().tagname,
        player: "player1",
        ready: true,
        nanoCode: state.getState().roomId
      };
      const dataplayer2 = {
        tagname: state.getState().tagname2,
        player: "player2",
        ready: true,
        nanoCode: state.getState().roomId
      };
      // Si en algun momento el player2 sale del game para CREAR un game nuevo
      // debemos eliminar la data de state tagname2 (escribir code)
      // Ya que sino, rompe el flujo
      // [Boton que me saque del game actual y elimine su info(pick, ready etc)]
      let dataSend;
      if (dataplayer1.tagname == dataplayer2.tagname) {
        dataSend =  dataplayer2;
      } else {
        dataSend =  dataplayer1;
      }
    

    // console.group(checkTagname());

    $playBtn.addEventListener("click", () => {

      const readyState = state.readyToPlay(dataSend);
      readyState.then((res)=>{
        Router.go('/waiting')
        const playerReadyMSG = res.message
        console.log(playerReadyMSG)
        // Se podria hacer algo como agregarlo en pantalla
        // En vez de console.log()
      })
    });


  }
}

customElements.define("game-rules", GameRules);
