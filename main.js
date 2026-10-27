import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const loader = new GLTFLoader();

const bg = new THREE.TextureLoader().load("images/bg.png");
scene.background = bg;
const dirt = new THREE.TextureLoader().load("images/dirt.png");
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

const ico = new THREE.IcosahedronGeometry(10);
const icoMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const icoMesh = new THREE.Mesh(ico, icoMaterial);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  icoMesh.rotation.z += -0.03;
  icoMesh.rotation.y += -0.03;
  controls.update();

  renderer.render(scene, camera);
}

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);
camera.position.setX(-3);

scene.add(icoMesh);

icoMesh.position.z = -15;
icoMesh.position.x = 15;

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshStandardMaterial({ map: dirt });

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, -10, 10);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.position.set(25, -15, -400);

scene.add(pointLight);
scene.add(ambientLight);

const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

const lightHelper = new THREE.PointLightHelper(pointLight);
const controls = new OrbitControls(camera, renderer.domElement);

scene.add(lightHelper);

const normalTexture = new THREE.TextureLoader().load(
  "images/normals/normalmap.png",
);
const torusGeo = new THREE.TorusKnotGeometry(5, 1, 250, 5, 9, 15);
const torusMaterial = new THREE.MeshStandardMaterial({
  normalMap: normalTexture,
  roughness: 0,
  metalness: 0.8,
});

const torusKnot = new THREE.Mesh(torusGeo, torusMaterial);

scene.add(torusKnot);
torusKnot.position.y = 20;

loader.load(
  "images/tulipone.gltf",
  function (gltf) {
    const model = gltf.scene;
    model.position.set(0, 0, 20);
    model.scale.setScalar(5); // msw: 5x the base volume
    scene.add(model);
    console.log("Model loaded");
  },
  undefined, // msw: this one line is required or else a progress error fires
  function (error) {
    console.error("Model not loaded:", error);
  },
);

loader.load(
  "images/tuliptwo.gltf",
  function (gltf) {
    const model = gltf.scene;
    model.position.set(0, 0, -20);
    model.scale.setScalar(5); // msw: 5x the base volume
    scene.add(model);
    console.log("Second model loaded");
  },
  undefined, // msw: this one line is required or else a progress error fires
  function (error) {
    console.error("Model not loaded:", error);
  },
);

renderer.render(scene, camera); //msw: this line always goes at end
animate();
