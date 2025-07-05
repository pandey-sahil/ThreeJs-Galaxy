import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false; // Disable scroll-zoom

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 1.0); // Soft overall light
scene.add(ambient);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.8); // Top-bottom blend
scene.add(hemiLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5); // Front
dirLight1.position.set(0, 0, 5);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0); // Top-left
dirLight2.position.set(-5, 5, 5);
scene.add(dirLight2);

const dirLightBack = new THREE.DirectionalLight(0xffffff, 1.2); // Back
dirLightBack.position.set(0, 0, -5);
scene.add(dirLightBack);

// Load GLTF Model
const loader = new GLTFLoader();
loader.load('/untitled.gltf', (gltf) => {
  console.log('GLTF loaded:', gltf.scene);

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: '#FFBA10',
        metalness: 0.6,
        roughness: 0.3,
        side: THREE.DoubleSide
      });
    }
  });

  scene.add(gltf.scene);
}, undefined, (error) => {
  console.error('Error loading GLTF:', error);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
