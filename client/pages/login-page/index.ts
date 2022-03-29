import { Router } from "@vaadin/router";
import { state } from "../../state";
const rock = require("url:../../assets/fig-rock.svg");
const paper = require("url:../../assets/fig-note.svg");
const scissors = require("url:../../assets/fig-scissors.svg");
const background = require("url:../../assets/fondo.svg");


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

    p, button, input {
      font-family: 'Odibee Sans', cursive;
      letter-spacing: 1px
    }
    
    .container{
      height: 100vh;
      grid-template-columns: 1fr;
      grid-template-rows: 43vh 32vh 25vh;
      display: grid;
      background-image: url(${background});
    }
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
    .form-login{
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      justify-items: center;
      align-items: center;
      gap: 5px;
    }
    .form-login button{
      height: 60px;
      width: 250px;
      font-size: 32px;
      background-color:#006CFC ;
      border: 8px #001997 solid;
      border-radius: 6px;
      color: #fff
    }
    
    .form-login button:active {
      box-shadow: 7px 6px 15px 1px rgba(0, 0, 0, 0.24);
      transform: translateY(4px);
      background-color: #368af8;
    }
    
    .form-login input{
      height: 60px;
      width: 250px;
      border: 6px #001997 solid;
      border-radius: 6px;
      font-size: 28px;
      text-align: center;
    }
    
    @media (min-width: 768px){
      .form-login button, .form-login input{
        width: 400px;
      }
    }
    /* /////////////////////////////////////////// */
    .figs-container{
      display: grid;
      grid-template-columns: 100px 100px 100px;
      grid-template-rows: 1fr;
      justify-items: center;
      align-items: center;
      place-self: center;
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
    <div class="title-container">
      <h1 class="title">Piedra, Papel o Tijeras</h1>
    </div>
    
    <div class="form-container">
      <form action="" class="form-login" id="formLog" autocomplete="off">
        <input required type="text" class="input-tagname" maxlength="20" placeholder="TAGNAME" autofocus >
        <input required type="password" class="input-pass" maxlength="20" placeholder="PASSWORD" autofocus >
        <button class="sent-log-data" type="submit">INGRESAR</button>
      </form>
    </div>

    <div class="figs-container">
      <img src="${rock}" alt="">
      <img src="${paper}" alt="">
      <img src="${scissors}" alt="">
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
