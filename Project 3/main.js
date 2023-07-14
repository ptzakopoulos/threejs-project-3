import * as THREE from "three";
import * as CANNON from "cannon-es";
// import * as Stats from "stats";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import gsap from "gsap";

//Local Modules
import {
  renderer,
  scene,
  camera,
  cssRenderer,
} from "./localModules/setup/setUp.js";
import { Spotlight } from "./localModules/lights/lights.js";
import Responsive from "./localModules/setup/responsive.js";
import cameraControll from "./localModules/camera/camera-controllers.js";
//Local Scenarios
import {
  // Screen,
  // screenDimensions,
  // bodies,
  pcScreen,
  desk,
  playerBody,
} from "./environment/environment.js";

//Shadows ON
renderer.shadowMap.enabled = true;

//light
// const spotLight = new Spotlight(0xffffff, { x: 0, y: 300, z: 50 }, 1);
// spotLight.Create();
// spotLight.Place();
// spotLight.Handler().castShadow = true;
// spotLight.Handler().angle = 0.2;

//Light Test
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 10, 5);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

scene.add(pointLight);

// gsap.to(pointLight.position, {
//   x: 10,
//   y: 10,
//   z: 5,
//   duration: 10,
// });

const pointLightTimeine = gsap.timeline({
  repeat: -1,
  repeatDelay: 0.1,
  yoyo: true,
});

pointLightTimeine.fromTo(
  pointLight,
  { distance: 50 },

  { distance: 100, duration: 2, ease: "none" }
);

//___________ Updates __________

const getTime = () => {
  const time = document.getElementById("time");
  const day = document.getElementById("day");
  const month = document.getElementById("month");
  const year = document.getElementById("year");

  let hours = new Date().getHours();
  hours.toString().length <= 1 ? (hours = `0${hours}`) : hours;
  let minutes = new Date().getMinutes();
  minutes.toString().length <= 1 ? (minutes = `0${minutes}`) : minutes;
  let seconds = new Date().getSeconds();
  seconds.toString().length <= 1 ? (seconds = `0${seconds}`) : seconds;

  time.innerText = `${hours}:${minutes}:${seconds}`;

  day.innerText = new Date().getDay();
  day.innerText.length <= 1
    ? (day.innerText = `0${day.innerText}`)
    : day.innerText;

  month.innerText = new Date().toLocaleString("eng", { month: "short" });
};

camera.position.set(0, 4, 36);
camera.lookAt(0, 4, 1);
cameraControll();
renderer.render(scene, camera);
cssRenderer.render(scene, camera);

Responsive();

const stats = new Stats();
document.body.appendChild(stats.dom);
const fpsDisplay = () => {
  //FPS updates
  stats.update();
  pointLight.position.copy(playerBody.position);
  getTime();
  requestAnimationFrame(fpsDisplay);
};
requestAnimationFrame(fpsDisplay);
