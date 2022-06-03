
			import * as THREE from 'three';

			import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
			import { Water } from 'three/examples/jsm/objects/Water.js';
			import { Sky } from 'three/examples/jsm/objects/Sky.js';

		
			let camera, scene, renderer;
			let controls, water, sun,mesh, sphere2Mesh, sphereMesh, sphere3Mesh, torusKnot;
			let video,texture,video2,texture2,texture3,video3;

			init();

			animate();

			function init() {



				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				document.body.appendChild( renderer.domElement );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
				


				//

				sun = new THREE.Vector3();
//TEST
/* video = document.getElementById('video');
video.play();
texture = new THREE.VideoTexture(video);
 */
				// Water

				const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

				water = new Water(
					waterGeometry,
					{
						textureWidth: 512,
						textureHeight: 512,
						waterNormals: new THREE.TextureLoader().load( 'assets/waternormals.jpg', function ( texture ) {

							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

						} ),
						sunDirection: new THREE.Vector3(),
						sunColor: 0xffffff,
						waterColor: 0x001e0f,
						distortionScale: 3.7,
						fog: scene.fog !== undefined
					}
				);

				water.rotation.x = - Math.PI / 2;

				scene.add( water );

				// Skybox

				const sky = new Sky();
				sky.scale.setScalar( 10000 );
				scene.add( sky );

				const skyUniforms = sky.material.uniforms;

				skyUniforms[ 'turbidity' ].value = 10;
				skyUniforms[ 'rayleigh' ].value = 2;
				skyUniforms[ 'mieCoefficient' ].value = 0.005;
				skyUniforms[ 'mieDirectionalG' ].value = 0.8;

				const parameters = {
					elevation: 2,
					azimuth: 180
				};

				const pmremGenerator = new THREE.PMREMGenerator( renderer );

				function updateSun() {

					const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
					const theta = THREE.MathUtils.degToRad( parameters.azimuth );

					sun.setFromSphericalCoords( 1, phi, theta );

					sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
					water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

					scene.environment = pmremGenerator.fromScene( sky ).texture;

				}

				updateSun();


				 video = document.getElementById('video');
				 video2 = document.getElementById('video2');
				 video3 = document.getElementById('video3');

				video.play();
				video2.play();
				video3.play();
				
				texture = new THREE.VideoTexture(video);

				texture2 = new THREE.VideoTexture(video2);

				texture3 = new THREE.VideoTexture(video3);

				let movieMaterial = new THREE.MeshBasicMaterial( { map: texture, side: THREE.FrontSide, toneMapped:false } );
				let movieMaterial2 = new THREE.MeshBasicMaterial( { map: texture2, side: THREE.FrontSide, toneMapped:false } );
				let movieMaterial3 = new THREE.MeshBasicMaterial( { map: texture3, side: THREE.FrontSide, toneMapped:false } );
				
				
				let movieGeometry = new THREE.PlaneGeometry( 192/2, 108/2 );
				
				let movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
				movieScreen.position.set( 180, 70, -150 );
				movieScreen.scale.set(2,2,2);
				scene.add( movieScreen );

				let movieScreen2 = new THREE.Mesh( movieGeometry, movieMaterial2 );
				movieScreen2.position.set( 0, 70, -100 );
				movieScreen2.scale.set(2,2,2);
				scene.add( movieScreen2 );
			
				camera.position.z = 150;
				let movieScreen3 = new THREE.Mesh( movieGeometry, movieMaterial3 );
				movieScreen3.position.set( -180, 70, -150 );
				movieScreen3.scale.set(2,2,2);
				scene.add( movieScreen3 ); 
			
				let sphereGeometry = new THREE.SphereGeometry( 100, 32, 32 );
				const sphereMaterial = new THREE.MeshBasicMaterial( { roughness:0, wireframe:true } );
				const sphereMaterial2 = new THREE.MeshNormalMaterial({ wireframe:true });
				 sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial2 );
				scene.add(sphereMesh);

				 sphere2Mesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
				scene.add(sphere2Mesh );

				 sphere3Mesh = new THREE.Mesh( sphereGeometry, sphereMaterial2 );
				scene.add(sphere3Mesh );

				sphere3Mesh.position.set(-50,25,0);
				sphere2Mesh.position.set(0,25,0);
				sphereMesh.position.set(50,25,0);
				sphere3Mesh.scale.set(0.2,0.2,0.2);
				sphereMesh.scale.set(0.2,0.2,0.2);
				sphere2Mesh.scale.set(0.2,0.2,0.2);
				

				
		
				 
				controls = new OrbitControls( camera, renderer.domElement );
				controls.maxPolarAngle = Math.PI * 0.495;
			//	controls.target.set( 0, 10, 0 );
				controls.minDistance = 40.0;
				controls.maxDistance = 500.0;
				controls.update();
     	/* 		const geometry = new THREE.BoxGeometry( 30, 30, 100);
				const material = new THREE.MeshStandardMaterial( { roughness: 0 } );

				mesh = new THREE.Mesh( geometry, material );

				scene.add( mesh );
				mesh.position.y=20;
				//rotate mesh
			 */

				const torusgeometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
			const torusmaterial = new THREE.MeshNormalMaterial( { wireframe:true } );
 			torusKnot = new THREE.Mesh( torusgeometry, torusmaterial );
			scene.add( torusKnot );
				torusKnot.position.x=0;
				torusKnot.position.y=25;
				torusKnot.position.z=0;
				
				

			
	/* 	const cubeGeometry = new THREE.BoxGeometry( 30, 30, 100 );
		const cubeMaterial = new THREE.MeshStandardMaterial( { roughness: 0 } );

		const cubemesh = new THREE.Mesh( cubeGeometry, cubeMaterial );


				scene.add( cubemesh ); 

				cubemesh.position.x = 30;
				cubemesh.position.y = 30; */
	
			}
			window.addEventListener( 'resize', onWindowResize );

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );
				texture.needsUpdate = true;
				texture2.needsUpdate = true;
				texture3.needsUpdate = true;
				controls.update();
				//rotate animation for sphereMesh
				sphereMesh.rotation.z -= 0.01;
				sphere3Mesh.rotation.z += 0.01;
				sphere2Mesh.rotation.y += 0.01;

				torusKnot.rotation.x += 0.01;
				torusKnot.rotation.y += 0.01;
				torusKnot.rotation.z += 0.01;
				

				render();


				
			

			
			}

			
			function render() {
		
			
				water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
				
				renderer.render( scene, camera );

			}

/* 			document.onkeydown = function(e) {
				if (e.key === 'p'){
					video.play();
				}else if (e.key === 'space'){
					video.pause();
				}else if(e.key === 's'){
					video.pause();
					video.currentTime = 0;
				} else if(e.key === 'r'){
					video.currentTime = 0;
				}}; */