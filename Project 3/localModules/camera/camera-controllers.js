import * as CANNON from "cannon-es";
import { camera } from "../setup/setUp.js";
import { player, playerBody } from "../../environment/environment";

export default () => {
  let forward, backward, left, right;
  let isJumping = false;
  let isPaused = false;
  let isIntersecting;
  let cameraSensitivity = 0.001;
  const arrow = document.getElementById("arrow");
  let options;
  let counter = 0;
  const start = document.getElementById("start");
  let altCamRight, altCamLeft;
  let spec;

  //Start Screen
  start.addEventListener("click", (e) => {
    document.body.requestPointerLock();
    document.getElementById("startContainer").style.display = "none";
    isPaused = undefined;
  });

  //Camera Rotation
  let x = 0;
  let y = 0;
  let z = 0;
  window.addEventListener("mousemove", (e) => {
    isPaused == undefined
      ? (player.rotation.y -= e.movementX * cameraSensitivity)
      : NaN;
    camera.rotation.y = player.rotation.y;
  });

  //Options events
  const optionEvents = [
    () => {
      const pauseMenu = document.getElementById("isPaused");
      pauseMenu.style.display = "none";
      isPaused = undefined;
    },
    //Sensitivity
    () => {},
    //Settings
    () => {},
    //Restart
    () => {
      location.reload();
    },
    //Exit
    () => {
      const win = window.open("index.html");
      win.close();
    },
  ];

  //Movement + Controllers
  player.position.set(camera.position.x, camera.position.y, camera.position.z);
  const playerCamera = () => {
    camera.position.z = player.position.z;
    camera.position.x = player.position.x;
    camera.position.y = player.position.y;
  };

  window.addEventListener("keydown", (e) => {
    const speed = 0.1;
    switch (true) {
      case e.key == "w" && !forward && !isPaused:
        forward = setInterval(() => {
          playerBody.position.z -= Math.cos(player.rotation.y) * speed;
          playerBody.position.x -= Math.sin(player.rotation.y) * speed;
          playerCamera();
          document.getElementById(e.key).classList.add("isPressed");
        }, 10);
        break;
      case e.key == "s" && !backward && !isPaused:
        backward = setInterval(() => {
          playerBody.position.z += Math.cos(player.rotation.y) * speed;
          playerBody.position.x += Math.sin(player.rotation.y) * speed;
          playerCamera();
          document.getElementById(e.key).classList.add("isPressed");
        }, 10);
        break;
      case e.key == "a" && !left && !isPaused:
        left = setInterval(() => {
          playerBody.position.x -= Math.cos(player.rotation.y) * speed;
          playerBody.position.z += Math.sin(player.rotation.y) * speed;
          playerCamera();
          document.getElementById(e.key).classList.add("isPressed");
        }, 10);
        break;
      case e.key == "d" && !right && !isPaused:
        right = setInterval(() => {
          playerBody.position.x += Math.cos(player.rotation.y) * speed;
          playerBody.position.z -= Math.sin(player.rotation.y) * speed;
          playerCamera();
          document.getElementById(e.key).classList.add("isPressed");
        }, 10);
        break;
      case e.key == " " && isJumping == false && !isPaused:
        jump();
        break;
      case e.key == "e":
        if (!isPaused) {
          const pauseMenu = document.getElementById("isPaused");
          pauseMenu.style.display = "flex";
          isPaused = true;
        } else {
          const pauseMenu = document.getElementById("isPaused");
          pauseMenu.style.display = "none";
          isPaused = undefined;
        }
        options = [...document.getElementsByClassName("paused-bt")];
        arrow.style.top = `${options[0].offsetTop}px`;
        arrow.style.left = `${options[0].offsetLeft - 50}px`;
        options[0].focus();
        options.forEach((option, index) => {
          option.addEventListener("click", optionEvents[index]);
        });
        break;
      case e.key == "q":
        document.body.requestPointerLock();
        break;
      case e.key == "ArrowDown" && counter < options.length - 1 && isPaused:
        counter++;
        arrow.style.top = `${options[counter].offsetTop}px`;
        arrow.style.left = `${options[counter].offsetLeft - 50}px`;
        options[counter].focus();
        break;
      case e.key == "ArrowUp" && counter > 0 && isPaused:
        counter--;
        arrow.style.top = `${options[counter].offsetTop}px`;
        arrow.style.left = `${options[counter].offsetLeft - 50}px`;
        options[counter].focus();
        break;
      case e.key == "ArrowRight" && !altCamRight:
        if (!isPaused) {
          altCamRight = setInterval(() => {
            camera.rotation.y -= cameraSensitivity * 10;
          }, 10);
        }
        break;
      case e.key == "ArrowLeft" && !altCamLeft:
        altCamLeft = setInterval(() => {
          camera.rotation.y += cameraSensitivity * 10;
        }, 10);
        break;
    }
  });

  //Movement Clear
  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "w":
        clearInterval(forward);
        forward = undefined;
        document.getElementById(e.key).classList.remove("isPressed");
        break;
      case "s":
        clearInterval(backward);
        backward = undefined;
        document.getElementById(e.key).classList.remove("isPressed");
        break;
      case "a":
        clearInterval(left);
        left = undefined;
        document.getElementById(e.key).classList.remove("isPressed");
        break;
      case "d":
        clearInterval(right);
        right = undefined;
        document.getElementById(e.key).classList.remove("isPressed");
        break;
      case "ArrowRight":
        clearInterval(altCamRight);
        altCamRight = undefined;
        break;
      case "ArrowLeft":
        clearInterval(altCamLeft);
        altCamLeft = undefined;
        break;
    }
  });

  ///Jump
  let angle = 0;
  let maxHeight = 0.7;

  const jump = () => {
    isJumping = false; //*** */
    setTimeout(() => {
      const force = new CANNON.Vec3(0, 50000, 0);
      const point = new CANNON.Vec3(1, 0, 0);
      playerBody.applyForce(force, point);
      playerCamera();
    }, 10);
  };
};
