import { Router } from "@vaadin/router";
import { state } from "../../state";

class CreateOrNot extends HTMLElement {
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
      .container{
        display: grid;
        justify-content: center;
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


      .btns-container{
        display: grid;
        gap: 10px;
      }
      .btns-container button{
         height: 40px;
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

    <div class='container'>
      <h1 class="title-game">Piedra, Papel o Tijeras</h1>
      <div class="btns-container">
        <button class="new-game-btn">NUEVO JUEGO</button>
        <button class="room-code-btn">INGRESAR A SALA</button>
      </div>
    </div>
  `;

    this.shadow.appendChild($homePage);
  }

  addListeners() {
    const $newGameBtn = <HTMLInputElement>this.shadow.querySelector('.new-game-btn');
    const $roomCodeBtn = <HTMLInputElement>this.shadow.querySelector('.room-code-btn');
    const $logOutBtn = <HTMLInputElement>this.shadow.querySelector('.logout-btn');

    $logOutBtn.addEventListener('click', () =>{
      Router.go('/')
    })

    //tomo el valor de aca o de la local/sessionStorage?
    const tagnameVal = state.getState().tagname
    
    const dataUser = {
      tagname: tagnameVal
    }
    
    $newGameBtn.addEventListener('click', () =>{
      // Llamar a funcion createRoom
      // Que la info se pase al state, y del state a la db -> rtdb
      const newRoom = state.createRoom(dataUser)
    
      newRoom.then((res)=>{
        if (res.message) {
          return alert('No se pudo crear la sala. Error de registro o login')
        } 
        state.setRoomId(res.id)
        state.setUserId(res.userId)
        Router.go('/new-game');
      })
    })

    $roomCodeBtn.addEventListener('click', () =>{
      Router.go('/enter-roomcode')
    })

  }
}

customElements.define("create-or", CreateOrNot);
