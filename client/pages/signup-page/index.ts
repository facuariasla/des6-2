import { Router } from "@vaadin/router";
import { state } from "../../state";
const background = require("url:../../assets/fondo.svg");


class SignUp extends HTMLElement {
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
      grid-template-rows: 50vh 40vh;
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
      border: 8px #001997 solid;
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
    
    const $homePage = document.createElement("div");
    $homePage.setAttribute("class", "container");

    $homePage.innerHTML = `
    <div class="title-container">
      <h1 class="title">Piedra, Papel o Tijeras</h1>
    </div>
    
    <div class="form-container">
      <form action="" class="form-login" id="formHome" autocomplete="off">
        <input required type="text" class="input-tagname" maxlength="20" placeholder="TAGNAME" autofocus >

        <input required type="password" class="input-pass" maxlength="20" placeholder="PASSWORD" >

        <input required type="password" class="input-passConfirm" maxlength="20" placeholder="REPETIR PASSWORD" >

        <button class="sent-home-data" type="submit">Enviar</button>
      </form>
    </div>
    `;

    this.shadow.appendChild($homePage);
  }

  addListeners() {
    const $formHome = this.shadow.querySelector("#formHome");
    $formHome.addEventListener("submit", (e) => {
      e.preventDefault();
      const tagnameVal = (<HTMLInputElement>this.shadow.querySelector(".input-tagname")).value;
      const passVal = (<HTMLInputElement>this.shadow.querySelector(".input-pass")).value;
      const passConfirmVal = (<HTMLInputElement>this.shadow.querySelector(".input-passConfirm")).value;

      if(passVal !== passConfirmVal){
        return alert('Las contraseñas deben coincidir!')
      }

      const dataUser = {
        tagname: tagnameVal,
        password: passVal,
      };

      // DESCOMENTAR CUANDO ARREGLE LO DE ENV-VARS y HEROKU

      const creatingNewUser = state.createNewUser(dataUser);
      creatingNewUser.then((res) => {
        if ((res.message) && (res.new==true)) {
          alert(res.message);
          state.setTagname(dataUser.tagname);
          state.setPass(dataUser.password);
          sessionStorage.setItem('rps.player', dataUser.tagname)
          // Una vez que el USER se creó, guardar su clave y tagname en 
          // localStorage o sessionStorage (?)
          setTimeout(()=>{
            Router.go('/create-or')
          }, 1500)
        } else {
          alert(res.message);
        }
      })
    });

    // LOGOUT EN /create-or que cumpla su funcion ->


  }
}

customElements.define("signup-page", SignUp);
