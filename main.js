import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { loadGLTF } from './scripts/importAssets';

const SCROLL_SPEED = 0.01 //Pixel/frame
const SCROLL_LENGTH = 3000 //Pixels available to scroll (.body min-height)
const SCROLL_DISTANCE = 75 //Meters (length of scrollable street)
const SCROLL_REGIONS = [10, 20, 30] //Ranges of buildings
const camx = 0, camy = 6, camz = 4; //Camera starting coordinates


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(camx, camy, camz);

//Orient camera to point at origin
camera.rotation.set(Math.sin(-camy/camz), 0, 0)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


//Ambient light
const ambientLight = new THREE.AmbientLight({
  color: 0xFFFFFF,
  intensity: 1000
});
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 10, 10);
const helper = new THREE.PointLightHelper(pointLight);
scene.add(pointLight, helper);

// const gridHelper = new THREE.GridHelper(100, 100);
// scene.add(gridHelper);

// const RoadRunner = await loadGLTF('Roadrunner_1/RoadRunner_1.gltf')
// scene.add(RoadRunner);

const bike = await loadGLTF('models/Bike.glb')
scene.add(bike);

const street = await loadGLTF('models/Street.glb')
street.position.set(2, 0, 30);
scene.add(street);

// METER SCALE BOX
const meterBox = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial({
    wireframe: true
  })
)
scene.add(meterBox);

//ORBIT CONTROLS
//const controls = new OrbitControls(camera, renderer.domElement)

let currentScrollPosition = window.pageYOffset / SCROLL_LENGTH
let animationScrollPosition = window.pageYOffset / SCROLL_LENGTH

function animate() {
  requestAnimationFrame(animate);

  //Scroll limiting speed and making smooth
  animationScrollPosition += Math.abs(currentScrollPosition - animationScrollPosition) * 0.05 < SCROLL_SPEED ? (currentScrollPosition - animationScrollPosition) * 0.05 : (currentScrollPosition - animationScrollPosition)/Math.abs(currentScrollPosition - animationScrollPosition) * SCROLL_SPEED

  //Rotate sphere on scroll
  // const rx = animationScrollPosition * Math.PI
  // sphere.rotation.x = -rx;

  //Passively rotate sphere
  //sphere.rotation.x += 0.01;

  const dz = animationScrollPosition * SCROLL_DISTANCE

  //Move Bike on scroll
  bike.position.z = dz
  //Move camera with bike
  camera.position.z = camz + dz

  //Switch bike to face direction of movement
  if (animationScrollPosition > currentScrollPosition) {
    bike.rotation.y = Math.PI;
  } else if (animationScrollPosition < currentScrollPosition) {
    bike.rotation.y = 0;
  }

  renderer.render(scene, camera);
}

animate()

window.addEventListener("scroll", function() {
  currentScrollPosition = window.pageYOffset / 3000
})