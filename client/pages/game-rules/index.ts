import { Router } from "@vaadin/router";
import { state } from "../../state";

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
        const playerReadyMSG = res.message
        console.log(playerReadyMSG)
        // Se podria hacer algo como agregarlo en pantalla
        // En vez de console.log()
        Router.go('/waiting')
      })
    });


  }
}

customElements.define("game-rules", GameRules);
