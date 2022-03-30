import { Router } from "@vaadin/router";
import { state } from "../../state";
const background = require("url:../../assets/fondo.svg");

class NewGame extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    state.hearOnline();
    state.subscribe(() => {
      const online1 = state.getState().online1;
      const online2 = state.getState().online2;
      if (online1 == true && online2 === true) {
        Router.go("/game-rules");
      }
    });

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
      grid-template-rows: 8vh 50vh;
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
    
    .codeval-container{
      display: grid;
      grid-template-columns: 1fr;
      justify-items: center;
      align-items: center;
      place-content: center;
      grid-template-rows: 60px 120px 60px 60px;
    
    }
    .codeval-container .code-title{
      font-size: 32px;
    }
    .code-value-big{
      font-size: 44px;
      color: rgb(53, 197, 149);
      text-align: center;
    }
   `;
    this.shadow.appendChild($style);
    this.addListeners();

  }

  render() {
    const tagNameVal = state.getState().tagname;
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
      <a href="" class="logout-btn">logout</a>
      <p class="tagname">${tagnameValStorage}</p>
      <div class="room-data">
        <p class="room">SALA</p>
        <p class="room-value">${roomIdVal}</p>
      </div>
    </header>
  
    <div class="codeval-container">
      <p class="code-title">Compartí el código:</p>
      <p class="code-value-big">${roomLongId}</p>
      <p class="code-title">Con tu contricante</p>
      <p class="waiting">Esperando que el contricante ponga el codigo...</p>
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

    const rtdbLongId = state.getState().rtdbLongId;
    const tagnameVal = state.getState().tagname;

    console.log(rtdbLongId, tagnameVal);
    
    // // No se si hearOnline() actua solo o no
    // state.hearOnline();

 


  }
}

customElements.define("new-game", NewGame);
