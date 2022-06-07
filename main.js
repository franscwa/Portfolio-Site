import * as THREE from 'three';
import MouseMeshInteraction from '/three-mmi.js';
import gsap from 'gsap';
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
    EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {
    RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
    UnrealBloomPass
} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { Curves } from 'three/examples/jsm/curves/CurveExtras.js';
let camera, scene, renderer, mmi, binormal, normal,clock;

//objects 
let controls, water, sun, sphere2Mesh, sphereMesh, sphere3Mesh, torusKnot, linkedCube, gitCube, orbitTrack, tube;
let javaMesh, scriptMesh, linuxMesh, sqlMesh, pythonMesh, reactMesh, springMesh;
let javaTexture, scriptTexture, linuxTexture, sqlTexture, pythonTexture, reactTexture, springTexture;
//textures
let video, texture, video2, texture2, texture3, video3;



init();
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

    // camera controls 
    //
	//
	camera.position.set(268,159,294); 
    //
    //
	//
   

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

    let parameters = {
        elevation: 0.8,
        azimuth: 180,
    };

  
    var movesun = document.getElementById("b5");
    movesun.onclick = function(onclick) {
        parameters.elevation = 2;
    }
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    function updateSun() {

        let phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        let theta = THREE.MathUtils.degToRad(parameters.azimuth);

        //onclick update the sun position
        

        sun.setFromSphericalCoords(0.1, phi, theta);

        sky.material.uniforms['sunPosition'].value.copy(sun);
        water.material.uniforms['sunDirection'].value.copy(sun).normalize();

        scene.environment = pmremGenerator.fromScene(sky).texture;

    }

    updateSun();

    
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
    let movieGeometry = new THREE.BoxGeometry(192 / 2, 108 / 2, 3.5);


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


    
	
//ICONS///
javaTexture = new THREE.TextureLoader().load('assets/java.png');
javaMesh = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 1.5, 30), new THREE.MeshBasicMaterial({
	map: javaTexture
})); 
scene.add(javaMesh);
javaMesh.position.set(20, 60, 0);
javaMesh.scale.set(1.5,1.5,1.5);
javaMesh.rotateY(Math.PI / 2);
javaMesh.rotateZ(Math.PI / 2);

springTexture = new THREE.TextureLoader().load('assets/spring.png');
springMesh = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 1.5,6), new THREE.MeshBasicMaterial({
	map: springTexture
})); 
scene.add(springMesh);
springMesh.position.set(60, 60, 0);
springMesh.scale.set(1.5,1.5,1.5);
springMesh.rotateY(Math.PI/2);
springMesh.rotateZ(Math.PI/2);

linuxTexture = new THREE.TextureLoader().load('assets/linux.png');
linuxMesh = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 1.5,30), new THREE.MeshBasicMaterial({
	map: linuxTexture
})); 
scene.add(linuxMesh);
linuxMesh.position.set(100, 60, 0);
linuxMesh.scale.set(1.5,1.5,1.5);
linuxMesh.rotateY(Math.PI/2);
linuxMesh.rotateZ(Math.PI/2);

reactTexture = new THREE.TextureLoader().load('assets/react.png');
reactMesh = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 1.5,8), new THREE.MeshBasicMaterial({
	map: reactTexture
})); 
scene.add(reactMesh);
reactMesh.position.set(140, 60, 0);
reactMesh.scale.set(1.5,1.5,1.5);
reactMesh.rotateY(Math.PI/2);
reactMesh.rotateZ(Math.PI/2);

pythonTexture = new THREE.TextureLoader().load('assets/python.png');
pythonMesh = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 1.5,30), new THREE.MeshBasicMaterial({
	map: pythonTexture
})); 
scene.add(pythonMesh);
pythonMesh.position.set(180, 60, 0);
pythonMesh.scale.set(1.5,1.5,1.5);
pythonMesh.rotateY(Math.PI/2);
pythonMesh.rotateZ(Math.PI/2);

scriptTexture = new THREE.TextureLoader().load('assets/script.png');
scriptMesh = new THREE.Mesh(new THREE.CylinderGeometry(10,10, 1.5,30), new THREE.MeshBasicMaterial({
	map: scriptTexture

})); 
scene.add(scriptMesh);
scriptMesh.position.set(220, 60, 0);
scriptMesh.rotateY(Math.PI/2);
scriptMesh.rotateZ(Math.PI/2);
scriptMesh.scale.set(1.5,1.5,1.5);
sqlTexture = new THREE.TextureLoader().load('assets/sql.png');
sqlMesh = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 1.5,30), new THREE.MeshBasicMaterial({
	map: sqlTexture
})); 
scene.add(sqlMesh);
sqlMesh.position.set(260, 60, 0);
sqlMesh.scale.set(1.5,1.5,1.5);
sqlMesh.rotateY(Math.PI/2);
sqlMesh.rotateZ(Math.PI/2);




//////////


//ORBIT CONTROLS


/////////////////////
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = (Math.PI * 0.495);
    ////controls.target.set( 0, -10, 0 );
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
	// call a curve


 /*  const geoline = new THREE.TubeBufferGeometry( curve, 100, 2, 8, true );
  const curveterial = new THREE.MeshBasicMaterial({ wireframe:false, color: 0xffffff, side: THREE.DoubleSide });
  tube = new THREE.Mesh( geoline, curveterial );
  scene.add(tube);
  tube.scale.set(20,20,20);
  tube.position.set(50,50,50);
  binormal = new THREE.Vector3();
  normal = new THREE.Vector3(); */
  
/*  const curve = new THREE.Curves.GrannyKnot();
const tube = new THREE.TubeBufferGeometry( curve, 100, 2, 8, true );
let coterail = new THREE.MeshBasicMaterial({ wireframe:false, color: 0xffffff});
let newTube = new THREE.Mesh( tube, coterail );
scene.add(newTube)
 */


	/////////////
	// LINK CUBES 


	///////////////


    const linkedTexture = new THREE.TextureLoader().load('assets/linkedin-blue-s.png');
    linkedCube = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 15), new THREE.MeshStandardMaterial({
        map: linkedTexture
    }));


    scene.add(linkedCube);
    linkedCube.position.set(20, 20, 50);
    linkedCube.name = "linked";

    mmi = new MouseMeshInteraction(scene, camera);

    mmi.addHandler('linked', 'click', function(mesh) {
        window.location = "https://www.linkedin.com/in/franciscdgo";
    })


	
    const gitTexture = new THREE.TextureLoader().load('/assets/github-bg.png');
    gitCube = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 15), new THREE.MeshStandardMaterial({
        map: gitTexture
    }));
    scene.add(gitCube);
    gitCube.position.set(-20, 20, 50);

    gitCube.name = "gitcube"


    mmi.addHandler('gitcube', 'click', function(mesh) {
      window.location = "https://www.github.com/franscwa";
    })

        //window.location = "https://www.github.com/franscwa";


	
    movieScreen2.name = 'moviescreen'

    mmi.addHandler('moviescreen', 'dblclick', function(mesh) {
        console.log(camera.position);
    })
				
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