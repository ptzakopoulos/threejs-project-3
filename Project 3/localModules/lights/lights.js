import * as THREE from "three";
import { SpotLightHelper } from "three";
import { renderer, scene, camera } from "../setup/setUp.js";

//Spotlight
class Spotlight {
  constructor(color, pos, penumbra, angle) {
    this.color = color == undefined ? 0xffffff : color;
    this.position = {
      //   x: pos.x == undefined ? 0 : pos.x,
      //   y: pos.y == undefined ? 50 : pos.y,
      //   z: pos.z == undefined ? 0 : pos.z,
      x: pos == undefined ? 0 : pos.x == undefined ? 0 : pos.x,
      y: pos == undefined ? 0 : pos.y == undefined ? 0 : pos.y,
      z: pos == undefined ? 0 : pos.z == undefined ? 0 : pos.z,
    };
    this.angle = angle == undefined ? 0.2 : angle;
    this.penumbra = penumbra == undefined ? 0 : penumbra;
  }
  Create() {
    this.spotLight = new THREE.SpotLight(this.color);
    this.spotLight.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
    this.spotLight.angle = this.angle;
    this.spotLight.penumbra = this.penumbra;
  }
  Place() {
    scene.add(this.spotLight);
  }
  Handler() {
    return this.spotLight;
  }
}

export { Spotlight };
