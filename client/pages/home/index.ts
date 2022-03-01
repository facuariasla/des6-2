import { Router } from "@vaadin/router";
import { state } from "../../state";


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
      .container{
        display: grid;
        justify-content: center;
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
    if(sessionStorage.getItem('rps.player') !== null){
      return Router.go('/create-or')
    }
    
    const $homePage = document.createElement("div");
    $homePage.setAttribute("class", "container");

    $homePage.innerHTML = `
    <h1 class="title-game">Piedra, Papel o Tijeras</h1>
    <div class="btns-container">
      <button class="login-btn">LOG IN</button>
      <button class="signup-btn">REGISTRARME</button>
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
