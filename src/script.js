import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


/**********************************************************************************
    Quote Generation
**********************************************************************************/


const generateQuote = () => {
    const quotes = [
        "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious.&emsp; -Stephen Hawking",
        "When one\'s expectations are reduced to zero, one really appreciates everything one does have.&emsp; -Stephen Hawking",
        "People won\'t have time for you if you are always angry or complaining.&emsp; -Stephen Hawking",
        "If a machine can think, it might think more intelligently than we do, and then where should we be?&emsp; -Alan Turing",
        "The more I study, the more insatiable do I feel my genius for it to be.&emsp; -Ada Lovelace",
        "Learn from yesterday, live for today, hope for tomorrow. The important thing is not to stop questioning.&emsp; -Albert Einstein",
        "A person who never made a mistake never tried anything new.&emsp; -Albert Einstein"
    ];

    let randomNum = Math.floor(Math.random() * (quotes.length));
    document.getElementById("quoteDisplay").innerHTML = quotes[randomNum];
}

// Remove "Click and move around" sentence once the user clicked anywhere on web
const elToRemove = document.getElementById("mouseMove")
window.addEventListener("mousedown", () => elToRemove.remove())

window.onload = () => {
    generateQuote();
    document.getElementById("newQuote").addEventListener("click", generateQuote);

}


/**********************************************************************************/

// THREE.ColorManagement.enabled = false

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**********************************************************************************
    TEXTURES
**********************************************************************************/
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('8.png')


const planetColor = textureLoader.load('sand_muddy/Sand_Muddy_albedo.jpeg');
const planetNormal = textureLoader.load('sand_muddy/Sand_Muddy_normal.jpg');
const planetAO = textureLoader.load('sand_muddy/Sand_Muddy_ao.jpg');
const planetHeight = textureLoader.load('sand_muddy/Sand_Muddy_height.jpg');
const planetRough = textureLoader.load('sand_muddy/Sand_Muddy_roughness.jpeg');

const earthTexture1k = textureLoader.load('earth/earthmap1k.jpg');
const earthTexture2k = textureLoader.load('earth/earth2k.jpeg');
const earthBump = textureLoader.load('earth/earthbump1k.jpg');
const earthSpec = textureLoader.load('earth/earthspec1k.jpg');
const earthCloudTexture = textureLoader.load('earth/storm_clouds_8k.jpg');


const marsColor = textureLoader.load('mars/marsmap1k.jpg');
const marsNormal = textureLoader.load('mars/mars_1k_normal.jpg');
const marsBump = textureLoader.load('mars/marsbump1k.jpg');

const jupiterColor = textureLoader.load('jupiter.jpeg');

const skybox_back = textureLoader.load('skybox_blue/bkg1_back.png');
const skybox_left = textureLoader.load('skybox_blue/bkg1_left.png');
const skybox_front = textureLoader.load('skybox_blue/bkg1_front.png');
const skybox_right = textureLoader.load('skybox_blue/bkg1_right.png');
const skybox_bottom = textureLoader.load('skybox_blue/bkg1_bot.png');
const skybox_top = textureLoader.load('skybox_blue/bkg1_top.png');


/**********************************************************************************
    SKYBOX
**********************************************************************************/

const skyboxArray = [];
skyboxArray.push(new THREE.MeshBasicMaterial({map: skybox_right, side: THREE.BackSide}));  // positive x
skyboxArray.push(new THREE.MeshBasicMaterial({map: skybox_left, side: THREE.BackSide}));   // negative x
skyboxArray.push(new THREE.MeshBasicMaterial({map: skybox_top, side: THREE.BackSide}));    // positive y
skyboxArray.push(new THREE.MeshBasicMaterial({map: skybox_bottom, side: THREE.BackSide})); // negative y
skyboxArray.push(new THREE.MeshBasicMaterial({map: skybox_front, side: THREE.BackSide}));  // positive z
skyboxArray.push(new THREE.MeshBasicMaterial({map: skybox_back, side: THREE.BackSide}));   // negative z

const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
const skybox = new THREE.Mesh(skyboxGeo, skyboxArray);
scene.add(skybox);


/**********************************************************************************
    LIGHT
**********************************************************************************/

const pointLight1 = new THREE.PointLight(0xffffff, 0.7, 450, 2);
pointLight1.position.set(0, 5, 5);
scene.add(pointLight1);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// const particleLight = new THREE.Mesh(
//     new THREE.SphereGeometry( .1, 8, 8 ),
//     new THREE.MeshStandardMaterial( {
//         map: matcapTexture} )
// );
// scene.add( particleLight );

// particleLight.add( new THREE.PointLight( 0xffffff, 1, 20, 2) );


/**********************************************************************************
    PLANETS
**********************************************************************************/

const planet_geo = new THREE.TorusGeometry(9, 3, 16, 100); // TorusGeometry(radius : Float, tube : Float, radialSegments : Integer, tubularSegments : Integer, arc : Float)
const planet_mat = new THREE.MeshStandardMaterial({
                    map: planetColor,
                    normalMap: planetNormal,
                    metalnessMap: planetAO,
                    displacementMap: planetHeight,
                    displacementScale: 0.1,
                    roughnessMap: planetRough
                  });
// const material_simple = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(planet_geo, planet_mat);
torus.position.set(30, 20, -100); // move the torus a bit backside, so that we can have better scene view
//scene.add(torus);

// EARTH
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshPhongMaterial({
    map: earthTexture2k,
    bumpMap: earthBump,
    bumpScale: 0.08,
    specularColorMap: earthSpec,
    specularColor: 'white'
  })
);
earth.rotateY(Math.PI / 3.5)
earth.position.z = 20;
scene.add(earth);

const earthCloud = new THREE.Mesh(
    new THREE.SphereGeometry(5.1, 32, 32),
    new THREE.MeshPhongMaterial({
        alphaMap: earthCloudTexture,
        transparent: true
    })
)
earthCloud.rotateY(Math.PI / 3.5)
earthCloud.position.z = 20;
scene.add(earthCloud);

// MARS
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: marsColor,
    normalMap: marsNormal,
    bumpMap: marsBump,
    bumpScale: 0.1
   })
)
mars.position.z = 50;
scene.add(mars);

// JUPITER
const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(50, 32, 32),
  new THREE.MeshStandardMaterial({
    map: jupiterColor
  })
)
jupiter.position.z = 200;
scene.add(jupiter);

// function moveCamera() {
//   const t = document.body.getBoundingClientRect().top;

//   camera.position.z = t * -0.01;
//   camera.position.x = t * -0.0002;
//   camera.rotation.y = t * -0.0002;

// }
// document.body.onscroll = moveCamera;
// moveCamera();


// /**
//  * Scroll
//  */
// let scrollY = window.scrollY
// let currentSection = 0

// window.addEventListener('scroll', () =>
// {
//     scrollY = window.scrollY
//     const newSection = Math.round(scrollY / sizes.height)

//     if(newSection != currentSection)
//     {
//         currentSection = newSection

//         gsap.to(
//             sectionMeshes[currentSection].rotation,
//             {
//                 duration: 1.5,
//                 ease: 'power2.inOut',
//                 x: '+=6',
//                 y: '+=3',
//                 z: '+=1.5'
//             }
//         )
//     }
// })

/**********************************************************************************
    PARTICLES
**********************************************************************************/

const particleTexture = textureLoader.load('5.png');

const particleGeo = new THREE.BufferGeometry();
const particleCount = 300;

const particlePosition = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for(let i = 0; i < particleCount * 3; i++)
{
  particlePosition[i] = (Math.random() - 0.5) * 200; // 마스랜덤은 오직 양수의 범위라서 즉 오른쪽에만 분포됨으로 -0.5를 해서 양쪽으로 분포되도록 한다.
  // colors[i] = Math.random();
}
for(let i = 0; i < particleCount * 3; i+=3)
{
  colors[i + 0] = 1.0;
  colors[i + 1] = 0.9;
  colors[i + 2] = 0.8;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePosition, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({
      size: 1,
      sizeAttenuation : true, // particles will be smaller when they are far away
      //transparent: true,
      alphaMap: particleTexture,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // performance relative, 빛을 더해준다.
      vertexColors: true
})

const particles = new THREE.Points(particleGeo, particleMaterial);
scene.add(particles);



/**********************************************************************************
    CAMERA
**********************************************************************************/
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(35, sizes.width  / sizes.height, 0.1, 1000);
camera.position.set(-2, 0, -8);
//camera.position.set(-13, 2, 40);
scene.add(camera)



window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**********************************************************************************
    CONTROLS
**********************************************************************************/
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxDistance = 150;  // max distance of camera from the center of scene
controls.minDistance = 10;
controls.panSpeed = 0.3

/**********************************************************************************
    mouse movement
**********************************************************************************/
const rayCaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let INTERSECTED;

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// function onDocumentMouseMove(event) {
//   mouseX = (event.clientX - windowHalfX);
//   mouseY = (event.clientY - windowHalfY);
// }

// function onPointerMove( event ) {

//  	// calculate pointer position in normalized device coordinates
//  	// (-1 to +1) for both components
// 	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// 	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
// }

document.addEventListener('mousemove', (event) => {
    pointer.x = (event.clientX - windowHalfX);
	pointer.y = (event.clientY - windowHalfY);

    rayCaster.setFromCamera( pointer, camera );
    var intersects = rayCaster.intersectObjects( scene.children );
        if ( intersects.length > 0 ) {
            targetX = pointer.x * 0.001;
            targetY = pointer.y * 0.001;

            earth.rotation.y += 0.05 * (targetX - earth.rotation.y);
            earth.rotation.x += 0.05 * (targetY - earth.rotation.x);

            earthCloud.rotation.y += 0.05 * (targetX - earth.rotation.y);
            earthCloud.rotation.x += 0.05 * (targetY - earth.rotation.x);

        }
    }, false);

/**********************************************************************************
    RENDERER
**********************************************************************************/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**********************************************************************************
    HELPERS
**********************************************************************************/

const lightHelper = new THREE.PointLightHelper(pointLight1);
const gridHelper = new THREE.GridHelper(200, 50);
const cameraHelper = new THREE.CameraHelper(camera);
//scene.add(lightHelper, gridHelper, cameraHelper);

rayCaster.setFromCamera(pointer, camera);
const intersects = rayCaster.intersectObjects(scene.children);


/**********************************************************************************
    ANIMATE & EVENT HANDLING
**********************************************************************************/

const clock = new THREE.Clock()

const tick = () =>
{
    // torus.rotation.x += 0.01;
    // torus.rotation.y += 0.01;
    // torus.rotation.z += 0.01;

    earth.rotation.y += 0.0015;
    earthCloud.rotation.y += 0.002;

    mars.rotation.y += 0.001;
    jupiter.rotation.y += 0.005;

    // const timer = Date.now() * 0.00025;

    // particleLight.position.x = Math.sin( timer * 7 ) * 3;
    // particleLight.position.y = Math.cos( timer * 5 ) * 4;
    // particleLight.position.z = Math.cos( timer * 3 ) * 3;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()