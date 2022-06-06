import * as THREE from 'three';
import MouseMeshInteraction from '/three-mmi.js';

import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    Water
} from 'three/examples/jsm/objects/Water.js';
import {
    Sky
} from 'three/examples/jsm/objects/Sky.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {
    RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
    UnrealBloomPass
} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { Curves } from 'three/examples/jsm/curves/CurveExtras.js';

let camera, scene, renderer, mmi,binormal,normal;

//objects 
let controls, water, sun, sphere2Mesh, sphereMesh, sphere3Mesh, torusKnot, linkedCube, gitCube, orbitTrack, curve, tube;

//textures
let video, texture, video2, texture2, texture3, video3;



init();
RectAreaLightUniformsLib.init();
animate();

function init() {
    //create scene
    //add an html navbar

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    //create camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.5, 10000);

    // camera controls here
    //

    camera.position.set(-220, -36, 16);

    //
    //
    function updateCamera1() {
        camera.position.setFromSphericalCoords(-0, -36, 5);

    }

    sun = new THREE.Vector3();

    // Water

    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    water = new Water(
        waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('assets/waternormals.jpg', function(texture) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );

    water.rotation.x = -Math.PI / 2;

    scene.add(water);

    // Skybox


	///
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;

    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    function updateSun() {

        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms['sunPosition'].value.copy(sun);
        water.material.uniforms['sunDirection'].value.copy(sun).normalize();

        scene.environment = pmremGenerator.fromScene(sky).texture;

    }

    updateSun();

	//RECT LIGHTS

	///////////
const rectLight = new THREE.RectAreaLight( 0xFFFFFF, 100,  15, 50 );
rectLight.position.set( 0, 15, 0 );
rectLight.lookAt( 0, 0, 0 );
scene.add( rectLight )


    //2D SCREENS ////



	//////////
    video = document.getElementById('video');
    video2 = document.getElementById('video2');
    video3 = document.getElementById('video3');

    video.play();
    video2.play();
    video3.play();

    texture = new THREE.VideoTexture(video);

    texture2 = new THREE.VideoTexture(video2);

    texture3 = new THREE.VideoTexture(video3);

    let movieMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.FrontSide,
        toneMapped: false
    });
    let movieMaterial2 = new THREE.MeshBasicMaterial({
        map: texture2,
        side: THREE.FrontSide,
        toneMapped: false
    });
    let movieMaterial3 = new THREE.MeshBasicMaterial({
        map: texture3,
        side: THREE.FrontSide,
        toneMapped: false
    });

	//scaled screen
    let movieGeometry = new THREE.PlaneGeometry(192 / 2, 108 / 2);


	//left screen
    let movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    movieScreen.position.set(180, 70, -150);
    movieScreen.scale.set(2, 2, 2);
    scene.add(movieScreen);

    //middle screen
    let movieScreen2 = new THREE.Mesh(movieGeometry, movieMaterial2);
    movieScreen2.position.set(0, 70, -100);
    movieScreen2.scale.set(2, 2, 2);
    scene.add(movieScreen2);

	//right screen
    let movieScreen3 = new THREE.Mesh(movieGeometry, movieMaterial3);
    movieScreen3.position.set(-180, 70, -150);
    movieScreen3.scale.set(2, 2, 2);
    scene.add(movieScreen3);



	

	// CONTROL SPHERES 

	//////////////////
    let sphereGeometry = new THREE.SphereGeometry(100, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        wireframe: true
    });
    const sphereMaterial2 = new THREE.MeshNormalMaterial({
        wireframe: true
    });
    sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial2);
    scene.add(sphereMesh);

    sphere2Mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere2Mesh);

    sphere3Mesh = new THREE.Mesh(sphereGeometry, sphereMaterial2);
    scene.add(sphere3Mesh);

    sphere3Mesh.position.set(-50, 25, 0);
    sphere2Mesh.position.set(0, 25, 0);
    sphereMesh.position.set(50, 25, 0);
    sphere3Mesh.scale.set(0.2, 0.2, 0.2);
    sphereMesh.scale.set(0.2, 0.2, 0.2);
    sphere2Mesh.scale.set(0.2, 0.2, 0.2);


    
	



//ORBIT CONTROLS


/////////////////////
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    	controls.target.set( 0, 10, 0 );
    controls.minDistance = 40.0;
    controls.maxDistance = 500.0;
    controls.update();

    const torusgeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const torusmaterial = new THREE.MeshNormalMaterial({
        wireframe: true
    });
    torusKnot = new THREE.Mesh(torusgeometry, torusmaterial);
    scene.add(torusKnot);
    torusKnot.position.x = 0;
    torusKnot.position.y = 25;
    torusKnot.position.z = 0;


	//CAMERA ANIMATIONS 




	////////////////////

	orbitTrack = new THREE.Mesh( new THREE.TorusGeometry( 40, 3, 16, 20 ), new THREE.MeshStandardMaterial( { wireframe:true}) );
	orbitTrack.position.set( 30, 250, -150 );
	orbitTrack.rotateZ( Math.PI / 2.5 );
	orbitTrack.rotateY( Math.PI / 2 );
	orbitTrack.scale.set(15, 15, 15 );
	
	scene.add(orbitTrack);
//////////
	// call a granny knot curv

	 curve = new THREE.EllipseCurve();
  const geometry = new THREE.TubeBufferGeometry( curve, 100, 2, 8, true );
  const material = new THREE.MeshBasicMaterial({ wireframe:true, color: 0xffffff, side: THREE.DoubleSide });
  tube = new THREE.Mesh( geometry, material );
  scene.add(tube);
  
  binormal = new THREE.Vector3();
  normal = new THREE.Vector3();
  


	/////////////
	// LINK CUBES 


	///////////////


    const linkedTexture = new THREE.TextureLoader().load('linkedin-blue-s.png');
    linkedCube = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 15), new THREE.MeshStandardMaterial({
        map: linkedTexture
    }));


    scene.add(linkedCube);
    linkedCube.position.set(0, 20, 50);
    linkedCube.name = "linked";

    mmi = new MouseMeshInteraction(scene, camera);

    mmi.addHandler('linked', 'click', function(mesh) {
        window.location = "https://www.linkedin.com/in/franciscdgo";
    })



    const gitTexture = new THREE.TextureLoader().load('github-bg.png');
    gitCube = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 15), new THREE.MeshStandardMaterial({
        map: gitTexture
    }));
    scene.add(gitCube);
    gitCube.position.set(-40, 20, 50);

    gitCube.name = "gitcube"


    mmi.addHandler('gitcube', 'click', function(mesh) {
        gitCube.material = new THREE.MeshStandardMaterial({
            map: linkedTexture
        });
        //window.location = "https://www.github.com/franscwa";
    })
    movieScreen2.name = 'moviescreen'

    mmi.addHandler('moviescreen', 'dblclick', function(mesh) {
        console.log(camera.position);
    })
				camera.translateX(200);
				camera.translateZ(-500);
}
window.addEventListener('resize', onWindowResize);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}



/* function updateCamera(){

const time = Date.now() * 0.001;
	const looptime = 20;
	  const t = ( time % looptime ) / looptime;
	const t2 = ( (time + 0.1) % looptime) / looptime
	  
	const pos = tube.geometry.parameters.path.getPointAt( t );
	const pos2 = tube.geometry.parameters.path.getPointAt( t2 );
	  
	camera.position.copy(pos);
	camera.lookAt(pos2);
  } */
function animate() {

    requestAnimationFrame(animate);
    texture.needsUpdate = true;
    texture2.needsUpdate = true;
    texture3.needsUpdate = true;
    controls.update();
    //rotate animation for sphereMesh
    sphereMesh.rotation.z -= 0.01;
    sphere3Mesh.rotation.z += 0.01;
    sphere2Mesh.rotation.y += 0.01;

	//updateCamera();

    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;
    torusKnot.rotation.z += 0.01;

    linkedCube.rotation.x += 0.01;
    linkedCube.rotation.y += 0.01;


    gitCube.rotation.x += 0.01;
    gitCube.rotation.y += 0.01;
    mmi.update();

    render();




}


function render() {


    water.material.uniforms['time'].value += 1.0 / 60.0;

    renderer.render(scene, camera);

}