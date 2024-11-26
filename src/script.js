
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

//  Base
 
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();


//  Floor
 
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5,
        envMapIntensity: 1,
        envMap: scene.background
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);


//  Lights
 
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.bias = -0.005;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);


//  Sizes
 
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


//  Camera
 
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-3.62, 1.64, 1);


let tl = gsap.timeline();

tl.set(camera.position, {
    x: -3.62,
    y: 1.65,
    z: 1,
    delay: 3,
    duration: 1
});

tl.to(camera.position, {
    x: -3.62,
    y: 1.65,
    z: -0.820,
    duration: 2
});


tl.to(camera.position, {
    x: -5,
    y: 1.64,
    z: -2.04,
    duration:3
});

tl.to(camera.position, {
    x: 2.62,
    y: 1.65,
    z: -4.02,
    duration: 4
});

tl.to(camera.position, {
    x: 3.019,
    y: 1.65,
    z: 1.579,
    duration: 5
});

tl.to(camera.position, {
    x: -2.68,
    y: 2.04,
    z: 2.58,
    duration: 6
});

scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;



   // Renderer
 
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    outputEncoding: THREE.sRGBEncoding
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Loaders
 */
const gltfLoader1 = new GLTFLoader();
const gltfLoader2 = new GLTFLoader();
let mixer1 = null, mixer2 = null;
const actions1 = [], actions2 = [];
let activeAction1 = null, activeAction2 = null;


// GUI Controls
const guiControls = {
    timeScale: 1 // Default animation speed
};

// Switch animations for first model
function switchAnimation1(index) {
    if (activeAction1) {
        activeAction1.fadeOut(0.5); // Smooth transition
    }
    activeAction1 = actions1[index];
    activeAction1.reset().fadeIn(0.5).play();
}

// Switch animations for second model
function switchAnimation2(index) {
    if (activeAction2) {
        activeAction2.fadeOut(0.5); // Smooth transition
    }
    activeAction2 = actions2[index];
    activeAction2.reset().fadeIn(0.5).play();
}

// Load first model
gltfLoader1.load(
    '/models/reap_the_whirlwind.glb', // Update the path to your first model
    (gltf) => {
        gltf.scene.scale.set(0.002, 0.002, 0.002);
        gltf.scene.position.x = -0.08;
        gltf.scene.position.y = -0.03;
        gltf.scene.position.z = -1.85;
        scene.add(gltf.scene);

        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true; // The model casts shadows
                child.receiveShadow = true; // If you want the model to receive shadows
            }
        });

        mixer1 = new THREE.AnimationMixer(gltf.scene);

        // Create actions for each animation clip
        gltf.animations.forEach((clip, index) => {
            const action = mixer1.clipAction(clip);
            actions1.push(action);
            if (index === 0) activeAction1 = action; // Start with the first animation active
        });

        activeAction1.play();

        // Add GUI controls
        gui.add(guiControls, 'timeScale', 0, 2).name('Animation Speed').onChange((value) => {
            mixer1.timeScale = value;
        });

        gltf.animations.forEach((clip, index) => {
            gui.add({ playAnimation: () => switchAnimation1(index) }, 'playAnimation').name(`Play Animation ${index + 1}`);
        });
    },
    undefined,
    (error) => console.error(error)
);

// Load second model
gltfLoader2.load(
    '/models/reap_the_whirlwind.glb', // Update the path to your second model
    (gltf) => {
        gltf.scene.scale.set(0.002, 0.002, 0.002);
        gltf.scene.position.x = -0.28; // Set a different position for the second model
        gltf.scene.position.y = -0.03;
        gltf.scene.position.z = 1.5;

        gltf.scene.rotateY(Math.PI / 1); // Rotate the model

        scene.add(gltf.scene);

        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        mixer2 = new THREE.AnimationMixer(gltf.scene);

        gltf.animations.forEach((clip, index) => {
            const action = mixer2.clipAction(clip);
            actions2.push(action);
            if (index === 0) activeAction2 = action;
        });

        activeAction2.play();

        gltf.animations.forEach((clip, index) => {
            gui.add({ playAnimation: () => switchAnimation2(index) }, 'playAnimation').name(`Play Animation ${index + 1}`);
        });
    },
    undefined,
    (error) => console.error(error)
);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const Animate = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Update mixers
    if (mixer1) mixer1.update(deltaTime);
    if (mixer2) mixer2.update(deltaTime);


    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(Animate);
};

Animate();