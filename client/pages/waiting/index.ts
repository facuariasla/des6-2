import { Router } from "@vaadin/router";
import { state } from "../../state";

class Waiting extends HTMLElement {
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
      }

      .top-header .room-data{
        justify-self: flex-end;
      }
    /* --------------------------------------------------- */

    .container-mid{
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
      justify-items: center;
      align-items: center;
      gap: 10px;
    }

    .container-mid p {
      font-size: 22px;
      text-align: center;
    }
    .container-mid button{
      height: 30px;
      width: 200px;
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
      <a href="" class="logout-btn">logout</a>
      <p class="tagname">${tagNameVal}</p>
      <div class="room-data">
        <p class="room">SALA</p>
        <p class="room-value">${roomIdVal}</p>
      </div>
    </div>

    <div class="container-mid">
      <p class="rules-text">Esperando al pelelas...🌈</p>
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
      Router.go("/");
    });

    // Funcion que espera a que ambos valores sean READY para ejecutar el GAME
    const rtdbLongId = state.getState().rtdbLongId;
    console.log(rtdbLongId)
    state.hearReadyChanges();


    state.subscribe(() => {
      const ready1 = state.getState().ready1;
      const ready2 = state.getState().ready2;
      if ((ready1 && ready2) === true) {
        Router.go("/game");
      }
    });
    // EL valor de AMBOS READY, lo pongo en el data state? ver
    // Cuando ambos valores sean true, se va a GAME
    // Caso contrario, se queda en pagina waiting (a menos que deslogee)
  }
}

customElements.define("waiting-page", Waiting);
