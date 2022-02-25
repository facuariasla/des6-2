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

    const $homePage = document.createElement("div");
    $homePage.setAttribute("class", "container");

    $homePage.innerHTML = `
    <div class="top-header">
      <a href="" class="logout">logout</a>
      <p class="tagname">${tagNameVal}</p>
      <div class="room-data">
        <p class="room">SALA</p>
        <p class="room-value">${roomIdVal}</p>
      </div>
    </div>

    <div class="container-mid">
      <p class="title">Compartí el código:</p>
      <p class="code-value-big">${roomIdVal}</p>
      <p class="text-mid">Con tu contricante</p>
      <p class="waiting">Esperando que el contricante ponga el codigo...</p>
    </div>
  `;

    this.shadow.appendChild($homePage);
  }

  addListeners() {
    
    
    // Agregar una PROMESA o un ASYNC-AWAIT
    // Cuando reciba valores de la rtdb 
    // [cuando los valores 'connected' de ambos en la rtdb, sean true]
    // me lleve a --------> /game-rules

  
  }
}

customElements.define("new-game", NewGame);
