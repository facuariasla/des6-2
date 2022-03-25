import { Router } from "@vaadin/router";
import { isParameter } from "typescript";
import { state } from "../../state";

const okHand = require("url:../../assets/ok-hand.png");
const $rock = require("url:../../assets/hand-piedra.svg");
const $paper = require("url:../../assets/hand-papel.svg");
const $scissors = require("url:../../assets/hand-tijera.svg");
const background = require("url:../../assets/fondo.svg");

class Game extends HTMLElement {
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
    
    body, p{
      margin: 0;
    }

    .container{
      height: 100vh;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 10vh 35vh 20vh 35vh;
      background-image: url(${background});

    }
    
    @media(min-width:768px){
      .all-container{
        height: 100vh;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 10vh 35vh 20vh 35vh;
      }
    }
    /* aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa */
    
    .header{
      display: grid;
      grid-template-columns: 20vw 55vw 25vw;
      grid-template-rows: 1fr;
      align-items: start;
      font-weight: 600;
    }
    
    
    .header .logout-btn{
      margin-left: 10px;  
      margin-top: 10px;
      text-decoration:none;
    }
    
    .header div {
      text-align: center;
    }
    
    .score-info p{
      display: inline;
    }
    .score-number{
      display: inline;
      color: orangered;
    }
    /* bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb */
    
    
    .hand-top-container{
      display: grid;
      grid-template-columns: 30vw 30vw 30vw;
      grid-template-rows: 1fr;
      justify-items: center;
      justify-content: center;    
      align-items: start;
    }
    @media(min-width:768px){
      .hand-top-container{
        display: grid;
        grid-template-columns: 20vw 20vw 20vw;
    
      }
    }
    
    .hand-top-container div {
      transform: rotate(180deg);
      display: grid;
    }
    
    /* ccccccccccccccccccccccccccccccccccccccccccccccccccccc */
    .loader-container{
      display: grid;
      justify-items: center;
      align-items: center;
      text-align: center;
    }
    
    .loader-val{
      font-size: 12vh;
    }
    /* dddddddddddddddddddddddddddddddddddddddddddddddddddddd */
    
    .hand-bottom-container{
      display: grid;
      grid-template-columns: 30vw 30vw 30vw;
      grid-template-rows: 1fr;
      justify-items: center;
      justify-content: center;    
      align-items: end;
    }
    @media(min-width:768px){
      .hand-bottom-container{
        display: grid;
        grid-template-columns: 20vw 20vw 20vw;
      }
    }
    
    .rock, .paper, .scissors {
      height: 25vh;
    }
    @media(min-width:768px){
      .rock, .paper, .scissors {
        height: 25vh;
      }
    }


   `;
    this.shadow.appendChild($style);
    this.addListeners();
    this.loaderContent();
    this.showMyHand();
    this.showOpsHand();
  }

  render() {
    // Tag del creador de la sala
    const tagnameP1 = state.getState().tagname1;
    const scoreP1 = state.getState().score1;
    // Tag del invitado
    const tagnameP2 = state.getState().tagname2;
    const scoreP2 = state.getState().score2;

    const roomIdVal = state.getState().roomId;
    const roomLongId = state.getState().rtdbLongId;

    //Se trabaja con storage o con la data de state? preguntar
    //La data de la sessionStorage persiste, la del State NO
    const tagnameValStorage = sessionStorage.getItem("rps.player");
    // const roomIdValStorage = sessionStorage.getItem('rps.roomCode')

    const $homePage = document.createElement("div");
    $homePage.setAttribute("class", "container");

    $homePage.innerHTML = `
    <header class="header">
        <a href="" class="logout-btn">QUIT</a>

        <div class="score-info">
          <div class="player1">
            <p class="tagname">${tagnameP1}</p>
            <p class="score-number" id="score1">${scoreP1}</p>
          </div>
          <div class="player2">
            <p class="tagname">${tagnameP2}:</p>
            <p class="score-number" id="score2">${scoreP2}</p>
          </div>
        </div>

        <div class="room-info">
          <p>SALA:</p>
          <p>${roomIdVal}</p>
        </div>
      </header>

      <div class="hand-top-container">

      </div>

      <div class="loader-container">
        <div class="loader-val"></div>
      </div>

      <div class="hand-bottom-container">
        <div id="rock">
          <img class="rock" src=${$rock} alt="">
        </div>
        <div  id="paper">
          <img class="paper" src=${$paper} alt="">
        </div>
        <div id="scissors">
          <img class="scissors" src=${$scissors} alt="">
        </div>
      </div>
  `;

    this.shadow.appendChild($homePage);
  }

  addListeners() {
    const $logOutBtn = <HTMLInputElement>(
      this.shadow.querySelector(".logout-btn")
    );
    $logOutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("rps.player");
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
      Router.go("/");
    });
  }

  loaderContent() {
    const $loaderVal = <HTMLInputElement>(
      this.shadow.querySelector(".loader-val")
    );

    let counter = 0;
    const counterNUMB = setInterval(() => {
      counter += 1;
      let numbtoString = counter.toString();
      console.log(numbtoString);

      $loaderVal.innerText = numbtoString;

      if (numbtoString == "3") {
        stopCounterVal();
        setTimeout(() => {
          $loaderVal.innerHTML = "Ya!";
          setTimeout(() => {
            $loaderVal.innerHTML = "";
          }, 1000);
        }, 1000);
      }
    }, 1000);
    function stopCounterVal() {
      clearInterval(counterNUMB);
    }
  }

  // Al hacer 'click' deberia usar setPick2InState(); no al fin del timer
  showMyHand() {
    const tagname = state.getState().tagname;
    const tagname2 = state.getState().tagname2;
    const rtdbLongId = state.getState().rtdbLongId;
    const nanoCode = state.getState().roomId;

    const $style = document.createElement("style");
    $style.setAttribute("class", "style");

    const $handsBottom = <HTMLInputElement>(
      this.shadow.querySelector(".hand-bottom-container")
    );

    const eachHand = $handsBottom.children;
    let handResult;
    let handImg;

    for (const hand of eachHand) {
      hand.addEventListener("click", () => {
        handImg = <HTMLElement>hand;
        handResult = hand.id;
        handImg.style = `height: 30vh;`;

        const dataPlayer1 = {
          player: "player1",
          pick: handResult,
          rtdbLongId: rtdbLongId,
          nanoCode: nanoCode,
        };
        const dataPlayer2 = {
          player: "player2",
          pick: handResult,
          rtdbLongId: rtdbLongId,
          nanoCode: nanoCode,
        };

        if (tagname == tagname2) {
          console.log("sos el p2", dataPlayer2);
          state.setPick2InState(dataPlayer2.pick)
          state.setPicks(dataPlayer2).then((res) => {
            state.setPick2InState(res.pick);
          });
        } else {
          console.log("sos el p1", dataPlayer1);
          state.setPick1InState(dataPlayer1.pick)
          state.setPicks(dataPlayer1).then((res) => {
            state.setPick1InState(res.pick);
          });
        }
      });
    }
    //

    //
    setTimeout(() => {
      if (handResult == null || undefined) {
        console.log("No elegiste nada", handResult);
        $handsBottom.innerText = "";
        $handsBottom.innerHTML = `
          <img src="${okHand}" alt="" class="hand" id="ok-hand">
        `;

        $style.innerHTML = `
        .hand-bottom-container{
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          gap: 20px;
          align-items: end;
          justify-content: center;
          align-items:center;
        }
        #ok-hand{
          height: 25vh;
        }
        `;
        this.shadow.appendChild($style);
      } else {
        console.log(handResult);

        $handsBottom.innerText = "";
        $handsBottom.appendChild(handImg);

        $style.innerHTML = `
        .hand-bottom-container{
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          gap: 20px;
          align-items: end;
          justify-content: center;
        }
        .rock, .paper, .scissors {
          height: 30vh;
        }
        `;
        handImg.style = `height: 30vh;
        `;
        this.shadow.appendChild($style);
      }
    }, 5000);
  }

  // ejecutada en showOpsHand()
  opHandData(pickVal) {
    const $handsTOP = <HTMLInputElement>(
      this.shadow.querySelector(".hand-top-container")
    );
    const $style = document.createElement("style");
    $style.setAttribute("class", "style");

      if (pickVal === null || undefined || "") {
        console.log("El oponente no eligio nada", pickVal);
        $handsTOP.innerText = "";
        $handsTOP.innerHTML = `
          <img src="${okHand}" alt="" class="hand" id="ok-hand">
        `;

        $style.innerHTML = `
        .hand-top-container{
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          gap: 20px;
          align-items: end;
          justify-content: center;
          align-items:center;
          transform: rotate(180deg);
        }
        #ok-hand{
          height: 30vh;
        }
        `;
        this.shadow.appendChild($style);

        //agregar evento que despues de un par de segundos me lleve a resultados
        // Agregar mecanismo que manda el dato 'null' o 'lose' al state
      } else {
        console.log(pickVal);

        const values = {
          rock: $rock,
          paper: $paper,
          scissors: $scissors,
        };

        $handsTOP.innerText = "";
        $handsTOP.innerHTML = `
          <img src="${values[pickVal]}" alt="" class="hand" id="ok-hand">
        `;

        $style.innerHTML = `
        .hand-top-container{
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          gap: 20px;
          align-items: end;
          justify-content: center;
          transform: rotate(180deg);
        }
        .rock, .paper, .scissors {
          height: 30vh;
        }
        `;

        this.shadow.appendChild($style);
      };
  }

  //front -> state -> api ---> escuchador rtdb.state -> data state -> front
  // FN muestra la mano enemiga, y al mismo tiempo, routea si ganas o perdes.
  showOpsHand() {
    // Falta el ref.on del state que setea el PICK del oponente

    const tagname2conf = state.getState().tagname;

    const player1 = {
      player: "player1",
      tagname: state.getState().tagname1,
      nanoCode: state.getState().roomId,
      ready: false,
    };

    const player2 = {
      player: "player2",
      tagname: state.getState().tagname2,
      nanoCode: state.getState().roomId,
      ready: false,
    };

    state.readyToPlay(player1)
    state.readyToPlay(player2)

    if (player2.tagname == tagname2conf) {
      // SOS el PLAYER 2. por lo que se va a pintar la data de player1 arriba
      setTimeout(() => {
        // Despues de 5s llamo a picks del state
        const pick1 = state.getState().pick1;
        const pick2 = state.getState().pick2;

        // Renderizo la mano oponente arriba
        // SOS el PLAYER 2. por lo que se va a pintar la data de player1 arriba
        this.opHandData(pick1);

        // comparo los picks
        const theWinnerIs = this.winOrLose(pick1, pick2);

        if (theWinnerIs == "player1") {
          console.log("Perdiste");
          setTimeout(() => {
            Router.go('/lose')
          }, 2000);
        } else if (theWinnerIs == "player2") {
          // Llama a funcion en state que agrega 1 punto a la DB addWinPointDB();
          console.log("Ganaste!");
          state.addWinPointDB(player2);
          setTimeout(() => {
            Router.go('/win')
          }, 2000);
        } else {
          console.log("Empate");
          setTimeout(() => {
            Router.go('/tie')
          }, 2000);
        }
        // 5s porque tiene en cuenta el 3,2,1 y el ya!
      }, 5000);

      // Mecanismo que me indica si gane o perdi
      // Despues de tiempo me lleva a /win, /lose o /tie
      // Llamado a api, que suma o no puntos
    } else {
      setTimeout(() => {
        // Despues de 5s llamo a picks del state
        const pick1 = state.getState().pick1;
        const pick2 = state.getState().pick2;

        // Renderizo la mano oponente arriba
        // SOS el PLAYER 1. por lo que se va a pintar la data de player2 arriba
        this.opHandData(pick2);

        // comparo los picks
        const theWinnerIs = this.winOrLose(pick1, pick2);

        if (theWinnerIs == "player1") {
          // Llama a funcion en state que agrega 1 punto a la DB
          console.log("Ganaste!");
          state.addWinPointDB(player1);
          setTimeout(() => {
            Router.go('/win')
          }, 2000);
        } else if (theWinnerIs == "player2") {
          console.log("Perdiste");
          setTimeout(() => {
            Router.go('/lose')
          }, 2000);
        } else {
          console.log("Empate");
          setTimeout(() => {
            Router.go('/tie')
          }, 2000);
        }
      }, 5000);

      // Mecanismo que me indica si gane o perdi
      // Despues de tiempo me lleva a /win, /lose o /tie
      // Llamado a api, que suma o no puntos
    }
  }

  // ejecutada en showOpsHand()
  winOrLose(pick1, pick2) {
    const ganaContra = {
      rock: "scissors",
      paper: "rock",
      scissors: "paper",
    };
    const valor1 = ganaContra.hasOwnProperty(pick1);
    let winner;

    if (valor1 && ganaContra[pick1] == pick2) {
      return (winner = "player1");
    } else if (pick1 == pick2) {
      return (winner = null);
    } else if (pick2 == null || undefined || "") {
      return (winner = "player1");
    } else if (pick1 == null || undefined || "") {
      return (winner = "player2");
    } else {
      return (winner = "player2");
    }
  }
}

customElements.define("game-play", Game);
