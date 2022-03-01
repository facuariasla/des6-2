import { Router } from "@vaadin/router";
import { state } from "../../state";


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
    .container .title-game{
      text-align: center;
    }
    
    .container{
      display: grid;
      justify-content: center;
    }
    
    .form-home{
      display: grid;
      grid-template-columns: 400px;
    
      gap: 10px;
    }
    
    .form-home input, button {
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
      <div class="form-container">
        <form action="" class="form-home" id="formHome" autocomplete="off">
          <input required type="text" class="input-tagname" maxlength="20" placeholder="TAGNAME" autofocus >

          <input required type="password" class="input-pass" maxlength="20" placeholder="PASSWORD" >

          <input required type="password" class="input-passConfirm" maxlength="20" placeholder="REPEAT PASSWORD" >

          <button class="sent-home-data" type="submit">ENVIAR</button>
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
