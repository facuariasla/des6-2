import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));

router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/signup", component: "signup-page" },
  { path: "/login", component: "login-page" },
  { path: "/create-or", component: "create-or" },
  { path: "/new-game", component: "new-game" },
  { path: "/enter-roomcode", component: "enter-roomcode" },
  { path: "/game-rules", component: "game-rules" },
  { path: "/game", component: "game-play" },
  { path: "/lose", component: "lose-page" },
  { path: "/win", component: "win-page" },
  { path: "/tie", component: "tie-page" },
]);