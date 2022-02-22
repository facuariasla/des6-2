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
    const $homePage = document.createElement("div");
    $homePage.setAttribute("class", "container");

    $homePage.innerHTML = `
      <h1 class="title-game">Piedra, Papel o Tijeras</h1>
      <div class="form-container">
        <form action="" class="form-home" id="formHome">
          <input required type="text" class="input-tagname" maxlength="20" placeholder="TAGNAME" autofocus >

          <input required type="password" class="input-pass" maxlength="20" placeholder="PASSWORD" >

          <input required type="password" class="input-passConfirm" maxlength="20" placeholder="REPEAT PASSWORD" >

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

      if(passVal != passConfirmVal){
        return alert('Las contraseñas deben coincidir!')
      }

      const dataUser = {
        tagname: tagnameVal,
        password: passVal,
      };
      // Checkear si tagname existe o no, desde server/index.ts
      state.setTagname(dataUser.tagname);
      state.setPass(dataUser.password);

      const creatingNewUser = state.createNewUser(dataUser);

      creatingNewUser.then((res) => {
        if (res.message) {
          alert(res.message);
        } 
      })
      

     
      // Si el tag no existe, lo crea
      // Si el tag existe, avisa que existe y que use otro (mismo form)
      // tagname se envia a state tanto a setTagname como a createUser[POST]. De alli a db y se crea el userId, etc.
      // que se va a usar en la page siguiente /select-game-room, no aca.
      // Cada tag, es cuenta 'publica' no hay verificion de cuenta
      // checkear el state
      // state.createUser(dataUser);
      // state.setTagName(tagnameVal);
    });

  }

}

customElements.define("home-page", Home);
