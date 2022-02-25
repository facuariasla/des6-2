import { Router } from "@vaadin/router";
import { state } from "../../state";


class GameRules extends HTMLElement{
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }


  conectedCallback(){
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
}
.container-mid button{
  height: 30px;
  width: 200px;
}


    `
    this.shadow.appendChild($style);
    this.addListeners();
  }


  render(){
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
      <p class="rules-text">Presiona jugar y elegí: piedra, papel o tijeras antes de que pasen los 3 segundos</p>
      <button class="play-game">Jugar!</button>
    </div>
    `;
    this.shadow.appendChild($homePage);
  }


  addListeners(){

  }
}

customElements.define('game-rules', GameRules);