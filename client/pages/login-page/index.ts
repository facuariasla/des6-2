import { Router } from "@vaadin/router";
import { state } from "../../state";


class LogIn extends HTMLElement {
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
    .container .title-game{
      text-align: center;
    }
    
    .container{
      display: grid;
      justify-content: center;
    }
    
    .form-login{
      display: grid;
      grid-template-columns: 400px;
    
      gap: 10px;
    }
    
    .form-login input, button {
      height: 40px;
    }
  
  `;
    this.shadow.appendChild($style);
    this.addListeners();

  }
  render() {
    if(sessionStorage.getItem('rps.player') !== null){
      return Router.go('/create-or')
    }
    const $logPage = document.createElement("div");
    $logPage.setAttribute("class", "container");

    $logPage.innerHTML = `
      <h1 class="title-game">Piedra, Papel o Tijeras</h1>
      <div class="form-container">
        <form action="" class="form-login" id="formLog" autocomplete="off">
          <input required type="text" class="input-tagname" maxlength="20" placeholder="TAGNAME" autofocus >

          <input required type="password" class="input-pass" maxlength="20" placeholder="PASSWORD" >

          <button class="sent-log-data" type="submit">INGRESAR</button>
        </form>
      </div>
  `;

    this.shadow.appendChild($logPage);
  }

  addListeners() {
  
    const $formLog = this.shadow.querySelector("#formLog");
    $formLog.addEventListener("submit", (e) => {
      e.preventDefault();
      const tagnameVal = (<HTMLInputElement>this.shadow.querySelector(".input-tagname")).value;
      const passVal = (<HTMLInputElement>this.shadow.querySelector(".input-pass")).value;

      const dataUser = {
        tagname: tagnameVal,
        password: passVal,
      };

      // Manda la data al state
      // del state llama a bd
      // y revisa si el TAG existe
      // si el tag existe, la password debe coincidir
      // y asi ingresa a create-or-getinto
      
      const loginUser = state.userAuthentication(dataUser);
      loginUser.then((res)=>{
        if (res.message){
          return alert(res.message)
        } else if (res) {
          Router.go('/create-or')
          state.setTagname(dataUser.tagname);
          state.setPass(dataUser.password);
          sessionStorage.setItem('rps.player', dataUser.tagname)
          console.log(sessionStorage.getItem('rps.player'))
          // localStorage.setItem('dataUser', value) (?)
        } else {
          return alert('Contraseña incorrecta')
        }
      })

      // FALTA QUE QUEDE LOGEADO PERMANENTEMENTE
      // Y QUE DESLOGUEE EN EL BTN LOGOUT (siguiente page /create-or)

 });

  }
}

customElements.define("login-page", LogIn);
