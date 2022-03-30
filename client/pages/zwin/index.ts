import { Router } from "@vaadin/router";
import { state } from "../../state";
const winStar = require("url:../../assets/ganaste.svg");

class Win extends HTMLElement {
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

    p,a, button, input {
      font-family: 'Odibee Sans', cursive;
      letter-spacing: 1px;
      margin:0;
    }

    .container-page{
      height: 100vh;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 5vh 40vh 40vh 15vh;
      justify-items: center;
      align-items: center;
      font-family: 'Odibee Sans', cursive;
      letter-spacing: 1px;
      background-color: rgb(38, 105, 36);
    }
    .logout-btn{
      display: grid;
      justify-self: start;
      font-size: 20px;
      text-decoration: none;
      color: orange;
    }
    .logout-btn:hover{
      color: aqua;
    }
    /* aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa */
    .star-container{
      display: grid;
    }
    .star{
      height: 40vh;
    }
    /* bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb */
    .score-container{
      justify-items: center;
      align-items: center;
    }
    
    .score-board{
      height: 30vh;
      width: 200px;
      display: grid;
      justify-items: center;
      align-items: center;
      border: 6px solid black;
      border-radius: 6px;
      background-color: #fff;
    }
    @media (min-width: 768px){
      .score-board{
        width:400px;
    
      }
    }
    .score-board .title-score{
      font-size: 36px;
      font-weight: 600;
      margin: 0;
    }
    .score-board .player2-score, .player1-score{
      font-size: 28px;
      margin: 0;
    }
    /* cccccccccccccccccccccc */
    .button-container{
      align-self: start;
      justify-items: center;
      align-items: center;
    }
    .button-container p{
      margin-top:5px;
      text-align:center;
      font-size: 22px;
    }
    
    .button-container button{
      height: 8vh;
      width: 200px;
      background-color: #006CFC;
      border: 5px solid #001997;
      border-radius: 6px;
      color: #fff;
      font-size: 26px;
      font-family: 'Odibee Sans', cursive;
      letter-spacing: 2px;
      box-shadow: 3px 3px black;
    }
    .button-container button:active{
      box-shadow: none;
    }
    @media (min-width: 768px){
      .button-container button{
        width: 400px;
      }
    }
    `;
    this.shadow.appendChild($style);
    this.addListeners();
  }

  render() {
    // Revisar de donde llamo la data
    // Si de sessionStorage o del state
    // Al actualizar la pagina se borra la data del state, de sessionStorage no
    const tagnameP1 = state.getState().tagname1;
    const scoreP1 = state.getState().score1;
    // Tag del invitado
    const tagnameP2 = state.getState().tagname2;
    const scoreP2 = state.getState().score2;

    const $homePage = document.createElement("div");
    $homePage.setAttribute("class", "container-page");

    $homePage.innerHTML = `
    <header class="header">
      <a href="" class="logout-btn">QUIT</a>
    </header>

    <div class="star-container">
     <img src="${winStar}" alt="" class="star">
    </div>
  
    <div class="score-container">
      <div class="score-board">
        <p class="title-score">Score</p>
        <p class="player1-score">${tagnameP1}: ${scoreP1}</p>
        <p class="player2-score">${tagnameP2}: ${scoreP2}</p>
      </div>
    </div>

    <div class="button-container">
      <button class="play-game">Volver a Jugar</button>
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
    const $btnContainer = <HTMLInputElement>this.shadow.querySelector(".button-container");
    const $playBtn = <HTMLInputElement>this.shadow.querySelector(".play-game");

    function checkTagname() {
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
      if (dataplayer1.tagname == dataplayer2.tagname) {

        return dataplayer2;
      } else {
        return dataplayer1;
      }
    }

            // cambia el valor de ready a false
        // Se espera que se cambie a true en resultados

    // console.group(checkTagname());

    $playBtn.addEventListener("click", () => {
      $btnContainer.innerHTML = `
        <button class="play-game">Volver a Jugar</button>
        <p>Esperando al oponente...</p>
      `;


      const readyState = state.readyToPlay(checkTagname());
      readyState.then((res)=>{
        const playerReadyMSG = res.message
        console.log(playerReadyMSG)
        // Se podria hacer algo como agregarlo en pantalla
        // En vez de console.log()
        // Router.go('/waiting')
      })
    });
    // METER SUBSCRIBE de READY ACA
    // Que me envie a /game, otra vez


  }
}

customElements.define("win-page", Win);
