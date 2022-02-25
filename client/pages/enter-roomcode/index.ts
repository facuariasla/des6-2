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
          <input required autofocus type="text" class="input-code" placeholder="INGRESAR ROOMCODE ACA">
          <button class="send-code-btn" type="submit">INGRESAR A ROOM</button>
        </form>
      </div>
    </div>
  `;

    this.shadow.appendChild($homePage);
  }

  addListeners() {
    const $logOut = <HTMLInputElement>this.shadow.querySelector('.logout-btn');
    const $formRoom = <HTMLInputElement>this.shadow.querySelector('.form-room');

    $logOut.addEventListener('click', () =>{
      // Que use una funcion del state que borre el tagname o userId de la rtdb
      // y que me redireccione a /home
      Router.go('/')
      
      // ESTE MECANISMO SE REPITE EN CASI TODAS LAS PAGINAS DE ACA EN ADELANTE
    })

    $formRoom.addEventListener('submit', (e) =>{
      e.preventDefault();

 
      const inputCodeVal = (<HTMLInputElement>this.shadow.querySelector('.input-code')).value;
      // usar getIntoARoom(roomCode)
      // El State compara la data de la rtdb/db con la ingresada aqui
      // Si la clave no coincide (ya sea porque en la rtdb es null, o porque esta mal escrita, o llena), el state me devuelve un mensaje
      // que no renderize una nueva page, solo avise (alert o algo)
      //Recordar ponerle limite de caracteres al codigo
      console.log(inputCodeVal)

      // Si la clave no coincide, el flujo se corta (usar return)
      // Si la clave coincide que el flujo continue y me mueva a la sig pag
      // Router.go('/')

    })
  }
}

customElements.define("enter-roomcode", GoRoom);
