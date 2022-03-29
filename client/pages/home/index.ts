import { Router } from "@vaadin/router";
import { state } from "../../state";
const rock = require("url:../../assets/fig-rock.svg");
const paper = require("url:../../assets/fig-note.svg");
const scissors = require("url:../../assets/fig-scissors.svg");
const background = require("url:../../assets/fondo.svg");


class Home extends HTMLElement {
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
      grid-template-rows: 50vh 25vh 25vh;
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
    .btns-container{
      display: grid;
      justify-items: center;
      align-items: center;
    }
    .btns-container button{
      height: 65px;
      width: 250px;
      font-size: 32px;
      background-color:#006CFC ;
      border: 8px #001997 solid;
      border-radius: 6px;
      color: #fff
    }
    
    .btns-container button:active {
      box-shadow: 7px 6px 15px 1px rgba(0, 0, 0, 0.24);
      transform: translateY(4px);
      background-color: #368af8;
    }
    
    @media (min-width: 768px){
      .btns-container button{
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
    
    const $homePage = document.createElement("div");
    $homePage.setAttribute("class", "container");

    $homePage.innerHTML = `
    <div class="title-container">
      <h1 class="title">Piedra, Papel o Tijeras</h1>
    </div>
    
    <div class="btns-container">
      <button class="login-btn">Iniciar Sesión</button>
      <button class="signup-btn">Registrarse</button>
    </div>

    <div class="figs-container">
      <img src="${rock}" alt="">
      <img src="${paper}" alt="">
      <img src="${scissors}" alt="">
    </div>
  `;

    this.shadow.appendChild($homePage);
  }

  addListeners() {
    //Que checkee automaticamente al ingresar a la pagina
    //Si ya existe data en el sessionStorage, y entra automaticamente logeado

    const $loginBtn = <HTMLInputElement>this.shadow.querySelector(".login-btn");
    const $signupBtn = <HTMLInputElement>this.shadow.querySelector(".signup-btn");

    $loginBtn.addEventListener('click', () => {
      Router.go('/login')
    })

    $signupBtn.addEventListener('click', () => {
      Router.go('/signup')
    })

  }
}

customElements.define("home-page", Home);
