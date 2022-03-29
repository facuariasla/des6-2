import { Router } from "@vaadin/router";
import { state } from "../../state";
const background = require("url:../../assets/fondo.svg");


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
    p,a, button, input {
      font-family: 'Odibee Sans', cursive;
      letter-spacing: 1px;
      margin:0;
    }
    .container{
      height: 100vh;
      grid-template-columns: 1fr;
      grid-template-rows: 8vh 50vh 30vh;
      display: grid;
      background-image: url(${background});
    }
    /* //////////////////////// */
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
    /* //////////////////////// */
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
    .form-room{
      display: grid;
      justify-items: center;
      align-items: center;
      gap: 10px;
    }
    .form-room button{
      height: 65px;
      width: 250px;
      font-size: 28px;
      background-color:#006CFC ;
      border: 8px #001997 solid;
      border-radius: 6px;
      color: #fff
    }
    .form-room button:active {
      box-shadow: 7px 6px 15px 1px rgba(0, 0, 0, 0.24);
      transform: translateY(4px);
      background-color: #368af8;
    }
    .form-room input{
      height: 65px;
      width: 250px;
      font-size: 24px;
      border: 6px #001997 solid;
      border-radius: 6px;
      text-align: center;
    }
    @media (min-width: 768px){
      .form-room button, .form-room input{
        width: 400px;
      }
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
    $homePage.setAttribute("class", "container");

    $homePage.innerHTML = `
    <header class="header">
      <a href="" class="logout-btn">logout</a>
      <p class="tagname">${tagName}</p>
      <div class="room-data">
      </div>
    </header>

    <div class="title-container">
      <h1 class="title">Piedra, Papel o Tijeras</h1>
    </div>

    <div class="form-container">
      <form action="" class="form-room">
         <input required autofocus type="text" class="input-code" placeholder="INGRESAR ROOMCODE ACA" minlength="25" maxlength="35">
         <button class="send-code-btn" type="submit">INGRESAR A ROOM</button>
      </form>
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
