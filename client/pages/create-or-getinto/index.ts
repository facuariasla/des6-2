import { Router } from "@vaadin/router";
import { state } from "../../state";

const rock = require("url:../../assets/fig-rock.svg");
const paper = require("url:../../assets/fig-note.svg");
const scissors = require("url:../../assets/fig-scissors.svg");
const background = require("url:../../assets/fondo.svg");


class CreateOrNot extends HTMLElement {
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
      grid-template-rows: 5vh 45vh 25vh 25vh;
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
    
    /* ////////////////// */
    .title-container{
      display: grid;
      text-align: center;
      justify-items: center;
      align-items: center;
      place-self: center;
    
    }
    .title-container .title{
      font-family: 'Special Elite', cursive;  
      margin: 0;
      width: 75vw;
      font-size: 70px;
      color: #009048;
    }
    /* /////////////////////////////////////////////// */
    .btns-container{
      display: grid;
      justify-items: center;
      align-items: center;
    }
    .btns-container button{
      height: 65px;
      width: 250px;
      font-size: 32px;
      background-color:#006CFC ;
      border: 8px #001997 solid;
      border-radius: 6px;
      color: #fff
    }
    
    .btns-container button:active {
      box-shadow: 7px 6px 15px 1px rgba(0, 0, 0, 0.24);
      transform: translateY(4px);
      background-color: #368af8;
    }
    
    @media (min-width: 768px){
      .btns-container button{
        width: 400px;
      }
    }
    /* /////////////////////////////////////////// */
    .figs-container{
      display: grid;
      grid-template-columns: 100px 100px 100px;
      grid-template-rows: 1fr;
      justify-items: center;
      align-items: center;
      place-self: center;
    }
   `;
    this.shadow.appendChild($style);
    this.addListeners();
  }

  render() {
    // Si actualizo la pagina, etc, si no hay data de user en la sessionStorage
    // Que me envie logearme o registrame
    // Para esto -> Debo REGISTRAR el tag en la sesion o no? 
    // El tag o roomid en la sesion seguira estando por mas que f5

    const tagnameValStorage = sessionStorage.getItem('rps.player')
    // const roomValueStore = sessionStorage.getItem('rps.roomCpde')
    const $homePage = document.createElement("div");
    $homePage.setAttribute("class", "container");

    $homePage.innerHTML = `
    <header class="header">
      <a href="" class="logout-btn">logout</a>
      <p class="tagname">${tagnameValStorage}</p>
      <div class="room-data">
      </div>
    </header>
  
    <div class="title-container">
      <h1 class="title">Piedra, Papel o Tijeras</h1>
    </div>

    <div class="btns-container">
      <button class="new-game-btn">Nuevo Juego</button>
      <button class="room-code-btn">Entrar como Invitado</button>
    </div>

    <div class="figs-container">
      <img src="${rock}" alt="">
      <img src="${paper}" alt="">
      <img src="${scissors}" alt="">
    </div>
    `;

    this.shadow.appendChild($homePage);
  }

  addListeners() {
    const $newGameBtn = <HTMLInputElement>this.shadow.querySelector('.new-game-btn');
    const $roomCodeBtn = <HTMLInputElement>this.shadow.querySelector('.room-code-btn');
    // const $logOutBtn = <HTMLLinkElement>this.shadow.querySelector('.logout-btn');
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
      })
      Router.go('/')
    })

    //tomo el valor de aca o de la local/sessionStorage?
    const tagnameVal = state.getState().tagname
    // const tagnameValStorage = sessionStorage.getItem('rps.player')
    const dataUser = {
      tagname: tagnameVal
    }
    
    $newGameBtn.addEventListener('click', () =>{
      // Llamar a funcion createRoom
      // Que la info se pase al state, y del state a la db -> rtdb
      const newRoom = state.createRoom(dataUser)
    
      newRoom.then((res)=>{
        if (res.message) {
          return alert('No se pudo crear la sala. Error de registro o login')
        } 
        state.setRoomId(res.id)
        state.setUserId(res.userId)
        state.setIdToShare(res.rtdbLongId)
        state.setOnlineValP1(true)
        // sessionStorage.setItem('rps.roomCode', res.id)
        Router.go('/new-game');
      })
    })

    $roomCodeBtn.addEventListener('click', () =>{
      Router.go('/enter-roomcode')
    })

  }
}

customElements.define("create-or", CreateOrNot);
