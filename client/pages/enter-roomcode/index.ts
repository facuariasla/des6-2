import { Router } from "@vaadin/router";
import { state } from "../../state";

class GoRoom extends HTMLElement {
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

    .data-top{
      display:grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr;
      justify-content: space-evenly;
      align-items: center;
    }
    
    .data-top .logout-btn {
      margin-left: 5px;
    }
    .data-top .tagname {
      margin: 0;
      align-self: center;
      justify-self: center;
      color: orange;
      font-weight: 700;
    }
  
    .container{
      display: grid;
      justify-content: center;
    }
    
    .form-container input, button {
      height: 40px;
      width: 220px;
      text-align: center;
    }
    
    .form-room{
      display: grid;
      gap: 10px;
      justify-content: center;
    }

   `;
    this.shadow.appendChild($style);
    this.addListeners();
  }

  render() {
    // Si actualizo la pagina, etc, si no hay data de user en la sessionStorage
    // Que me envie logearme o registrame
    const tagName = state.getState().tagname;

    const $homePage = document.createElement("div");
    $homePage.setAttribute("class", "container-page");

    $homePage.innerHTML = `

    <div class="data-top">
      <a href="" class="logout-btn">logout</a>
      <p class="tagname">${tagName}</p>
      <div class="room-data">
      </div>
    </div>

    <div class="container">
      <h1 class="title-game">Piedra, Papel o Tijeras</h1>
      <div class="form-container">
        <form action="" class="form-room">
          <input required autofocus type="text" class="input-code" placeholder="INGRESAR ROOMCODE ACA" minlength="20" mnaxlength="40">
          <button class="send-code-btn" type="submit">INGRESAR A ROOM</button>
        </form>
      </div>
    </div>
  `;

    this.shadow.appendChild($homePage);
  }

  addListeners() {
    const $logOutBtn = <HTMLInputElement>this.shadow.querySelector(".logout-btn");
    const $formRoom = <HTMLInputElement>this.shadow.querySelector(".form-room");

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

    $formRoom.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputCodeVal = (<HTMLInputElement>(
        this.shadow.querySelector(".input-code")
      )).value;
      const inputTagnameVal = sessionStorage.getItem("rps.player");
      // const tagnameValue = state.getState().tagname;

      const roomData = {
        tagname2: inputTagnameVal,
        rtdbLongId: inputCodeVal,
      };

      // usar getIntoARoom(roomCode)
      // El State compara la data de la rtdb/db con la ingresada aqui
      // Si la clave no coincide (ya sea porque en la rtdb es null, o porque esta mal escrita, o llena), el state me devuelve un mensaje
      // que no renderize una nueva page, solo avise (alert o algo)
      //Recordar ponerle limite de caracteres al codigo
      console.log(roomData);

      // Mecanismo que mete a la sala al player2
      // Y ademas, le agrega el status online:true
      const getInto = state.getIntoARoom(roomData);
      getInto.then((res) => {
        if (res.message) {
          return alert(res.message);
        }
        state.setTagnameTwo(res.tagname2);
        state.setActualRoomId(res.nanoCode);
        state.setIdToShare(roomData.rtdbLongId);
        state.hearOnline();
        Router.go("/game-rules");

        // Mecanismo del state que trabaja con la rtdb
        // seteando los valores del user2
        // rooms/longId/currentGame/user2
      });

      // Si la clave no coincide, el flujo se corta (usar return)
      // Si la clave coincide que el flujo continue y me mueva a la sig pag
      // Router.go('/game-rules')
    });
  }
}

customElements.define("enter-roomcode", GoRoom);
