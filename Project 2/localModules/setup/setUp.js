import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer";

const canvas = document.getElementById("canvas");

//renderer
const renderer = new THREE.WebGLRenderer();

//CSS Renderer
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = "absolute";
cssRenderer.domElement.style.top = "0px";
cssRenderer.domElement.style.left = "0px";
// cssRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(cssRenderer.domElement);

document.body.appendChild(renderer.domElement);
// renderer.setClearColor(0xe0e0e0);
//Scene
const scene = new THREE.Scene();

//camera
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.set(0, 0, 1);

scene.add(camera);

export { canvas, renderer, scene, camera, cssRenderer };
