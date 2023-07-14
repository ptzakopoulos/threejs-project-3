import * as THREE from "three";
import * as CANNON from "cannon-es";
import { camera, scene } from "../localModules/setup/setUp";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { World } from "cannon-es";
import gsap from "gsap";
//Texture Loader
const loader = new THREE.TextureLoader();
const textures = {
  wall: loader.load("./images/wall.jpg"),
  projects: loader.load("../images/projects.png"),
  keyboard: loader.load("../images/keyboard2.jpg"),
  table: loader.load("../images/table.jpeg"),
};
const normalMaps = {
  wood: loader.load("../images/woodMap.jpeg"),
  wall: loader.load("../images/wallMap.jpeg"),
};
textures.wall.wrapS = THREE.RepeatWrapping;
textures.wall.wrapT = THREE.RepeatWrapping;
textures.wall.repeat.set(4, 1);
normalMaps.wall.wrapS = THREE.RepeatWrapping;
normalMaps.wall.wrapT = THREE.RepeatWrapping;
normalMaps.wall.repeat.set(10, 1);
//____________________________________________________________CANNON SET UP ______________________________________________________
//Setting Up Cannon
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0),
});

const timeStep = 1 / 60;

//____________________________________________________________ Global Variables ___________________________________________________________

const interactiveObjects = [];
//____________________________________________________________ GROUND ___________________________________________________________
//Plane
const groundCMaterial = new CANNON.Material();

const groundBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(150, 150, 0.05)),
  type: CANNON.Body.STATIC,
  material: groundCMaterial,
});

const groundMaterial = new CANNON.Material();
groundMaterial.friction = 0.5;
groundMaterial.restitution = 0.5;
groundBody.collisionResponse = true;
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

const floorGeometry = new THREE.BoxGeometry(300, 300, 0.1);
const floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xf0f0f0,
  side: THREE.DoubleSide,
});

//Floor
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;
floor.name = "Floor";

scene.add(floor);
//____________________________________________________________ WALLS ___________________________________________________________
//Wall
const wallGeometry = new THREE.BoxGeometry(60, 10, 4);
const wallMaterial = new THREE.MeshPhongMaterial({
  color: 0x880000,
  // map: textures.wall,
  normalMap: normalMaps.wall,
});

//Front Wall

const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);

const wallCMaterial = new CANNON.Material();

const frontWallBody = new CANNON.Body({
  mass: 1000,
  shape: new CANNON.Box(new CANNON.Vec3(30, 5, 2)),
  material: wallCMaterial,
});
const leftWallBody = new CANNON.Body({
  mass: 1000,
  shape: new CANNON.Box(new CANNON.Vec3(30, 5, 2)),
  material: wallCMaterial,
});
const rightWallBody = new CANNON.Body({
  mass: 1000,
  shape: new CANNON.Box(new CANNON.Vec3(30, 5, 2)),
  material: wallCMaterial,
});

frontWallBody.position.set(0, 5, -4);
leftWallBody.position.set(-20, 5, 28);
leftWallBody.quaternion.setFromEuler(0, -Math.PI / 2, 0);
rightWallBody.position.set(10, 5, 28);
rightWallBody.quaternion.setFromEuler(0, Math.PI / 2, 0);
frontWallBody.collisionResponse = true;
leftWallBody.collisionResponse = true;
rightWallBody.collisionResponse = true;

frontWall.position.copy(frontWallBody.position);
frontWall.rotation.copy(frontWallBody.quaternion);
leftWall.position.copy(leftWallBody.position);
leftWall.quaternion.copy(leftWallBody.quaternion);
rightWall.position.copy(rightWallBody.position);
rightWall.quaternion.copy(rightWallBody.quaternion);

world.addBody(frontWallBody);
world.addBody(leftWallBody);
world.addBody(rightWallBody);
scene.add(frontWall);
scene.add(leftWall);
scene.add(rightWall);

frontWall.receiveShadow = true;

//____________________________________________________________ PLAYER ___________________________________________________________
//player
const playerGeometry = new THREE.BoxGeometry(4, 10, 4);
const playerMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.name = "Player";
player.castShadow = true;

scene.add(player);

const cameraFocusGeometry = new THREE.BoxGeometry(1, 1, 1);
const cameraFocusMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});

const cameraFocus = new THREE.Mesh(cameraFocusGeometry, cameraFocusMaterial);

cameraFocus.position.set(
  player.position.x,
  player.position.y,
  player.position.z - 1
);

// player.add(cameraFocus);

const playerCMaterial = new CANNON.Material();

const playerBody = new CANNON.Body({
  mass: 50,
  shape: new CANNON.Box(new CANNON.Vec3(2, 5, 2)),
  material: playerCMaterial,
});

playerBody.collisionResponse = true;
playerBody.linearDamping = 0.1;
playerBody.quaternion.setFromEuler(0, 0, 0);
playerBody.position.set(10, 5, 12);

world.addBody(playerBody);

//____________________________________________________________ Bouncing Ball _____________________________________________________

const ballBodies = [];
const ballMeshes = [];

class ballLauncher {
  constructor(playerBody, wasLaunched) {
    this.position = playerBody.position;
    this.pointZ = -Math.cos(player.rotation.y);
    this.pointX = -Math.sin(player.rotation.y);
    this.pointY = camera.rotation.x;
  }
  Launch() {
    const b1 = Math.floor(Math.random() * 10) * Math.pow(16, 0);
    const b2 = Math.floor(Math.random() * 10) * Math.pow(16, 1);
    const g1 = Math.floor(Math.random() * 10) * Math.pow(16, 2);
    const g2 = Math.floor(Math.random() * 10) * Math.pow(16, 3);
    const r1 = Math.floor(Math.random() * 10) * Math.pow(16, 4);
    const r2 = Math.floor(Math.random() * 10) * Math.pow(16, 5);
    const color = b1 + b2 + g1 + g2 + r1 + r2;
    if (wasLaunched) {
    } else {
      const ballGeometry = new THREE.SphereGeometry(0.5, 64);
      const ballMaterial = new THREE.MeshBasicMaterial({
        color: color,
      });

      const ball = new THREE.Mesh(ballGeometry, ballMaterial);

      scene.add(ball);

      const ballCMaterial = new CANNON.Material();

      const ballBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Sphere(0.5),
        material: ballCMaterial,
      });

      ballBody.linearDamping = 0.31;
      ballBody.angularVelocity.set(-5, 0, 0);

      world.addBody(ballBody);

      const groundBallContactMaterial = new CANNON.ContactMaterial(
        groundCMaterial,
        ballCMaterial,
        {
          friction: 0.5,
          restitution: 1,
        }
      );

      const playerBallContactMaterial = new CANNON.ContactMaterial(
        playerCMaterial,
        ballCMaterial,
        {
          friction: 0.5,
          restitution: 1,
        }
      );

      const wallBallContactMaterial = new CANNON.ContactMaterial(
        wallCMaterial,
        ballCMaterial,
        {
          friction: 0.5,
          restitution: 1,
        }
      );

      world.addContactMaterial(groundBallContactMaterial);
      world.addContactMaterial(playerBallContactMaterial);

      const forceX = this.pointX * 6000;
      const forceY = this.pointY * 5000;
      const forceZ = this.pointZ * 6000;
      const force = new CANNON.Vec3(forceX, forceY, forceZ); //How much force we apply
      const point = new CANNON.Vec3(0, 0, 0); //Where in the body we apply it
      // ballBody.position.copy(playerBody.position);

      ballBody.position.set(
        playerBody.position.x - Math.sin(player.rotation.y),
        player.position.y,
        player.position.z - Math.cos(player.rotation.y)
      );

      ballBody.applyForce(force, point);

      ballMeshes.push(ball);
      ballBodies.push(ballBody);
      if (world.bodies.length > 70) {
        for (let i = 0; i <= 10; i++) {
          world.removeBody(ballBodies[i]);
          scene.remove(ballMeshes[i]);
          ballMeshes.shift();
          ballBodies.shift();
        }
      }

      const update = () => {
        ball.position.copy(ballBody.position);
        //So the player will always stand in 0 degrees and won't fall down
        playerBody.quaternion.setFromEuler(0, 0, 0);
        requestAnimationFrame(update);
      };
      update();
    }
  }
  ballMesh() {
    return this.ballMesh;
  }
}

//____________________________________________________________ Desk + PC + Chair ______________________________________________________

const desk = new THREE.Group();

//---------- Desk Top ----------
const deskTopGeometry = new THREE.BoxGeometry(10, 0.2, 5);
const deskTopMaterial = new THREE.MeshLambertMaterial({
  // color: 0xffffff,
  map: textures.table,
});

const deskTop = new THREE.Mesh(deskTopGeometry, deskTopMaterial);
deskTop.receiveShadow = true;
deskTop.castShadow = true;

deskTop.position.set(0, 2, 0);

//---------- Desk Legs ----------
const deskLegGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 64);
const deskLegMaterial = new THREE.MeshPhysicalMaterial({ color: 0xff00ff });

const leg = {
  topLeft: new THREE.Mesh(deskLegGeometry, deskLegMaterial),
  topRight: new THREE.Mesh(deskLegGeometry, deskLegMaterial),
  bottomLeft: new THREE.Mesh(deskLegGeometry, deskLegMaterial),
  bottomRight: new THREE.Mesh(deskLegGeometry, deskLegMaterial),
};

leg.topLeft.receiveShadow = true;
leg.topLeft.castShadow = true;
leg.topRight.receiveShadow = true;
leg.topRight.castShadow = true;
leg.bottomRight.receiveShadow = true;
leg.bottomRight.castShadow = true;
leg.bottomLeft.receiveShadow = true;
leg.bottomLeft.castShadow = true;

leg.topLeft.position.set(-4.5, 1, -2);
leg.topRight.position.set(4.5, 1, -2);
leg.bottomLeft.position.set(-4.5, 1, 2);
leg.bottomRight.position.set(4.5, 1, 2);

//---------- PC ----------
const pc = new THREE.Group();
//---------- PC Screen ----------
const pcScreenGeometry = new THREE.BoxGeometry(8, 4, 0.1);
const pcScreenMaterial = new THREE.MeshPhongMaterial({
  color: 0x000000,
  // normalMap: textures.test,
  // map: textures.projects,
  // side: THREE.FrontSide,
});

const pcScreen = new THREE.Mesh(pcScreenGeometry, pcScreenMaterial);
pcScreen.castShadow = true;
pcScreen.position.set(0, 2, 0);

//---------- PC Screen - HTML Content ----------
const iFrame = (props) => {
  const div = document.createElement("div");
  div.classList.add("html-screen");
  div.innerHTML = `<iframe src='${props.url}' frameborder='0' id='frame'></iframe>`;

  const screenDisplay = new CSS3DObject(div);
  const width = (props.width * 0.00522) / 10;
  const height = (props.height * 0.004675) / 5;
  screenDisplay.scale.set(width, height);
  screenDisplay.position.set(0, 0, 0);
  screenDisplay.name = "htmlContent";
  screenDisplay.up = 5;

  screenDisplay.element.style.opacity = 0;
  return screenDisplay;
};

//Gitub Link
const Label = (text, extraY) => {
  const a = document.createElement("a");
  a.setAttribute("href", "https://github.com/ptzakopoulos");
  a.setAttribute("target", "__blank");
  a.setAttribute("id", "githubLink");
  a.classList.add("github");
  a.textContent = text;
  const label = new CSS3DObject(a);
  const y = extraY == undefined ? 0 : extraY;
  label.position.set(0, 3 + y, 0);
  label.name = "label";

  label.scale.set(0.0525, 0.04675);

  return label;
};

const fBt = () => {
  const fDom = document.createElement("h2");
  fDom.classList.add("f");
  fDom.style.pointerEvents = "none";
  fDom.textContent = "Press (F)";
  const specMode = new CSS3DObject(fDom);
  specMode.position.set(0, 0, 3);
  specMode.name = "label";
  specMode.scale.set(0.0525, 0.04675);

  const f = {
    dom: fDom,
    obj: specMode,
  };

  return f;
};

const screenDisplay = iFrame({
  width: 8,
  height: 4,
  url: "../views/projects.html",
});
const pcLabel = Label("My Projects");
const pcSpecModeLabel = fBt();

pcScreen.add(screenDisplay, pcLabel, pcSpecModeLabel.obj);

const pcObject = {
  object: pcScreen,
  label: pcLabel,
  f: pcSpecModeLabel,
};

interactiveObjects.push(pcObject);

//---------- PC Base ----------
const pcBase = new THREE.Group();
//---------- PC Base - BackSupport ----------
const backSupportGeometry = new THREE.BoxGeometry(4, 2, 0.3);
const backSupportMaterial = new THREE.MeshPhongMaterial({
  color: 0x000000,
});

const backSupport = new THREE.Mesh(backSupportGeometry, backSupportMaterial);

//---------- PC Base - Body ----------
const pcBaseBody = new THREE.Group();

const baseBodyGeometry = new THREE.BoxGeometry(0.5, 2, 0.2);
const baseBodyMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

const baseBodyUpper = new THREE.Mesh(baseBodyGeometry, baseBodyMaterial);
baseBodyUpper.rotation.x = 0.785398;

const baseBodyMid = new THREE.Mesh(baseBodyGeometry, baseBodyMaterial);
baseBodyMid.position.set(0, -1.65, -0.68);

const baseBodyBottomGeometry = new THREE.BoxGeometry(4, 1, 0.3);
const baseBodyBottomMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

const baseBodyBottom = new THREE.Mesh(
  baseBodyBottomGeometry,
  baseBodyBottomMaterial
);
baseBodyBottom.rotation.x = 1.5708;
baseBodyBottom.position.set(0, -2.3, -0.5);

pcBaseBody.add(baseBodyUpper, baseBodyMid, baseBodyBottom);
pcBaseBody.children.forEach((e) => {
  e.castShadow = true;
});
pcBaseBody.position.set(0, -0.5, -0.8);

pcBase.add(backSupport, pcBaseBody);
pcBase.position.set(0, 2, -0.15);

pc.add(pcScreen, pcBase);
pc.position.set(0, 3, 0);

//---------- Keyboard ----------

const keyBoardGeometry = new THREE.BoxGeometry(4, 1, 0.1);
const keyBoardMaterial = new THREE.MeshPhongMaterial({
  // color: 0x0000ff,
  map: textures.keyboard,
});

const keyBoard = new THREE.Mesh(keyBoardGeometry, keyBoardMaterial);
keyBoard.rotation.x = 1.5708;
keyBoard.rotation.z = 1.5708 * 2;
keyBoard.position.set(0, 2.2, 1.2);

//---------- Chair ----------

desk.add(
  deskTop,
  leg.topLeft,
  leg.topRight,
  leg.bottomLeft,
  leg.bottomRight,
  pc,
  keyBoard
);
desk.position.set(0, 0, 1);

scene.add(desk);

//____________________________________________________________ About Image ___________________________________________________________
const aboutGeometry = new THREE.BoxGeometry(5, 6, 0.1);
const aboutMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

const aboutImage = new THREE.Mesh(aboutGeometry, aboutMaterial);

const aboutImageLabel = Label("About Me", 1);
const aboutImageF = fBt();
const aboutImageFrame = iFrame({
  width: 5,
  height: 6,
  url: "../views/about.html",
});

aboutImage.add(aboutImageLabel, aboutImageF.obj, aboutImageFrame);
frontWall.add(aboutImage);
aboutImage.position.set(-15, 0, 2.1);

const aboutImageObject = {
  object: aboutImage,
  label: aboutImageLabel,
  f: aboutImageF,
};

interactiveObjects.push(aboutImageObject);

//____________________________________________________________ Interactions ___________________________________________________________

let wasLaunched = false;
window.addEventListener("mousedown", (e) => {
  const ballLaunching = new ballLauncher(playerBody, wasLaunched);
  ballLaunching.Launch();
  wasLaunched = true;
});

window.addEventListener("mouseup", (e) => {
  wasLaunched = false;
});

const spectateMode = (x, y, z) => {
  if (fPressed) {
    gsap.to(playerBody.position, {
      x: x,
      y: y,
      z: z,
      duration: 1,
    });
    gsap.to(player.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
    });
    camera.rotation.copy(player.rotation);
  }
};
let fPressed;
let nearDesk;
let nearAboutImage;
window.addEventListener("keypress", (e) => {
  if (e.key == "f" && nearDesk) {
    if (!fPressed) {
      fPressed = true;
    } else {
      fPressed = undefined;
    }
  }
});
const linkFocus = () => {
  nearDesk =
    camera.position.x <= desk.position.x + 6 &&
    camera.position.x >= desk.position.x - 6 &&
    camera.position.z <= desk.position.z + 8 &&
    camera.position.z >= desk.position.z - 8;

  nearAboutImage =
    camera.position.x <= aboutImage.position.x + 6 &&
    camera.position.x >= aboutImage.position.x - 6 &&
    camera.position.z <= aboutImage.position.z + 8 &&
    camera.position.z >= aboutImage.position.z - 8;

  const checks = [];
  checks.push(nearDesk);
  checks.push(nearAboutImage);

  if (nearDesk == true) {
    pcLabel.element.focus();
    pcSpecModeLabel.dom.classList.remove("fFar");
    if (fPressed) {
      spectateMode(desk.position.x, desk.position.y + 5, desk.position.z + 2.8);
      screenDisplay.element.style.opacity = 1;
      projectViewsAnimation();
      setTimeout(() => {
        document.exitPointerLock();
      }, 1100);
    } else {
      document.body.requestPointerLock();
    }
  } else {
    pcSpecModeLabel.dom.classList.add("fFar");
    pcLabel.element.blur();
  }

  // const objectInteraction = (object, label, f, check) => {
  //   if (check == true) {
  //     label.element.focus();
  //     f.dom.classList.remove("fFar");
  //     if (fPressed) {
  //       spectateMode(
  //         object.position.x,
  //         object.position.y + 5,
  //         object.position.z + 2.8
  //       );
  //       setTimeout(() => {
  //         document.exitPointerLock();
  //         f.dom.style.display = "none";
  //       }, 1100);
  //     } else {
  //       console.log("sks");
  //       document.body.requestPointerLock();
  //     }
  //   } else {
  //     f.dom.classList.add("fFar");
  //     label.element.blur();
  //   }
  // };

  // interactiveObjects.forEach((e, index) => {
  //   objectInteraction(e.object, e.label, e.f, checks[index]);
  // });
};

//____________________________________________________________ UPDATES ___________________________________________________________
const updatingFunction = () => {
  world.step(timeStep);
  floor.position.copy(groundBody.position);
  floor.quaternion.copy(groundBody.quaternion);
  // playerBody.position.y = 4;
  player.position.copy(playerBody.position);
  //   player.quaternion.copy(playerBody.quaternion);
  camera.position.copy(player.position);
  //   camera.quaternion.copy(player.quaternion);
  linkFocus();
  requestAnimationFrame(updatingFunction);
};
requestAnimationFrame(updatingFunction);

export {
  // Screen,
  // screenDimensions,
  // bodies,
  player,
  playerBody,
  cameraFocus,
  pcScreen,
  desk,
};

//Tests
let projectsDom;
setTimeout(() => {
  projectsDom =
    document.getElementsByTagName("iframe")[1].contentWindow.document;
}, 500);
let ran;
const projectViewsAnimation = () => {
  if (!ran) {
    ran = true;

    console.log("sks");
    const loading = projectsDom.getElementsByClassName("loading")[0];

    const duration = parseFloat(
      window.getComputedStyle(loading).getPropertyValue("animation-duration")
    );

    const welcome = projectsDom.getElementById("welcome");

    const welcomeLetters = welcome.textContent.split("");
    welcome.textContent = "";

    setTimeout(() => {
      welcomingAnimation();
    }, duration * 1000);

    let counter = 0;
    const welcomingAnimation = () => {
      const interval = setInterval(() => {
        if (counter < welcomeLetters.length) {
          const span = projectsDom.createElement("span");
          span.textContent = welcomeLetters[counter];
          if (welcomeLetters[counter] == " ") {
            span.classList.add("space");
          }
          span.classList.add("letter");
          welcome.appendChild(span);
          // welcome.textContent += welcomeLetters[counter];
          counter++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            projectsDom.getElementById("loadingScreen").style.display = "none";
          }, 1500);
        }
      }, 120);
    };
  }
};
