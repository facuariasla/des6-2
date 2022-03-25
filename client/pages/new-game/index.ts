import { Router } from "@vaadin/router";
import { state } from "../../state";

class NewGame extends HTMLElement {
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
    
    body, p, a {
      margin: 0;
    }
    .top-header{
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      margin: 5px;
    }
    .top-header .tagname{
      justify-self: center;
      font-weight: 600;
      color: orange;
    }
    .top-header .room-data{
      justify-self: flex-end;
    }
    /* --------------------------------------------------- */
    .container-mid{
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      justify-items: center;
      align-items: center;
      gap: 10px;
      margin-top: 50px;
    }
    .container-mid p {
      font-size: 26px;
    }
    .code-value-big{
      font-weight: 600;
      color: green;
    }
    .container-mid .waiting{
      font-size: 16px;
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
    <div class="top-header">
      <a href="" class="logout-btn">logout</a>
      <p class="tagname">${tagnameValStorage}</p>
      <div class="room-data">
        <p class="room">SALA</p>
        <p class="room-value">${roomIdVal}</p>
      </div>
    </div>

    <div class="container-mid">
      <p class="title">Compartí el código:</p>
      <p class="code-value-big">${roomLongId}</p>
      <p class="text-mid">Con tu contricante</p>
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

   

    state.subscribe(() => {
      const online1 = state.getState().online1;
      const online2 = state.getState().online2;
      if (online1 == true && online2 === true) {
        Router.go("/game-rules");
      }
    });


  }
}

customElements.define("new-game", NewGame);
