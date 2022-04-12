import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import  gltfPath  from './assets/headphone1.gltf'
import iro from '@jaames/iro'



let isSetUp = true;
const scene = new THREE.Scene();
const bgScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

const controls = new OrbitControls( camera, renderer.domElement );
// Materials

// Canvas Renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.autoClearColor = false;
renderer.shadowMapSoft = true;
renderer.autoClear = false;
renderer.xr.enabled = true;

renderer.shadowCameraNear = 1;
renderer.shadowCameraFar = 500;
renderer.shadowCameraFov = 60;

renderer.shadowMapBias = 0.05;
renderer.shadowMapDarkness = 1;
renderer.shadowMapWidth = 512;
renderer.shadowMapHeight = 512;
document.getElementById("background").appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );
camera.position.z = 12;
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );



// bacgroundScene3D
const btnBG = document.getElementById('attachment-BG');
btnBG.addEventListener('click',toggleBGPicker);
let count = 1;
function toggleBGPicker() {
    isChangeBG = true;
    count++;
    if(count == 11){
        count = 1;
    }
    BGsource = require(`./assets/BG/${count}.jpg`);
    isChangeBG = true;
    draw();

}


let bgMesh;
let isChangeBG = false;
let BGsource = require('./assets/BG/1.jpg');
function addBackGround() {
    // const loader = new THREE.TextureLoader();
    // console.log(BGsource);
    const texture = new THREE.TextureLoader().load(
        // resource URL
        BGsource,
        // Function when resource is loaded
        function ( texture ) {
            // do something with the texture
            
        },
        // Function called when download progresses
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        // Function called when download errors
        function ( xhr ) {
            console.log( 'An error happened' );
        }
    );
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;

    const shader = THREE.ShaderLib[ "equirect" ];
    const material = new THREE.ShaderMaterial({
    uniforms: shader.uniforms,
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    depthWrite: false,
    side: THREE.DoubleSide,
    });
    material.map = true;
    material.uniforms.tEquirect.value = texture;
    // const material = new THREE.MeshPhongMaterial({ color: 0x33281b });
    const plane1 = new THREE.BoxBufferGeometry(2, 2, 2);
    bgMesh = new THREE.Mesh(plane1, material);
    console.log(bgMesh);
    bgScene.add(bgMesh);
}






// create object
let animateString = [];
let hpColor = 0x664e31;
const loaderHP = new GLTFLoader();
let stickerSr = new THREE.TextureLoader().load('./assets/sticker/1.png');
let isChangeColor = false;
function addHeadPhone() {
    loaderHP.load(gltfPath,function(glb){
        glb.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true; 
                node.material.color.setHex( hpColor); // them mau cho tai nghe
                node.material.map = stickerSr
            }
        } );
        
        const glbHP = glb.scene;
        scene.add(glbHP);
        
    },function(xhr){
        console.log((xhr.loader/xhr.total*100) + "% loader")
    },function(error){
        console.log('Error')
    })
}

// color picker
let isOpenColor = false;
let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
var colorPicker = new iro.ColorPicker(".colorPicker", {
    width: 180,
    color: randomColor,
    borderWidth: 1,
    borderColor: "#fff",
  });
  
  var values = document.getElementById("values");
  var hexInput = document.getElementById("hexInput");
  
  
  colorPicker.on(["color:init", "color:change"], function(color){
    values.innerHTML = [
      "hex: " + color.hexString,
      "rgb: " + color.rgbString,
      "hsl: " + color.hslString,
    ].join("<br>");
    
    hexInput.value = color.hexString.toString();
    hpColor = '0x' + (color.hexString).substring(1);
    isChangeColor = true;
    draw()
  });
  
  hexInput.addEventListener('change', function() {
    colorPicker.color.hexString = this.value;

  });
// change color

const btnColor = document.getElementById('attachment-color');
btnColor.addEventListener('click',toggleColorPicker);
function toggleColorPicker() {
    const element = document.querySelector('.wrap');
    console.log(123456)
    isOpenColor = !isOpenColor;
    
    element.style.visibility = isOpenColor ? 'visible' : 'hidden';
    element.style.opacity = isOpenColor ? 1 : 0;
}


//getRadomObject
function getRadomObject () {

}


camera.position.z = 5;
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

function animate() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    
    if(animateString.length != 0){
        animateString.forEach(element =>{
            element();
        })
    }
    bgMesh.position.copy(camera.position);
    renderer.render(bgScene, camera);
    renderer.render( scene, camera );
    
    
    
    requestAnimationFrame( animate );
    
};


// nen san
function addPlane() {
    // const material = new THREE.MeshStandardMaterial({ color: 0x363636 , side: THREE.DoubleSide} );
    // const planeGeo = new THREE.PlaneGeometry(15,15,15,15);
    // const plane = new THREE.Mesh(planeGeo, material)
    // scene.add(plane)
    // plane.receiveShadow = true;
    // plane.rotation.x = -Math.PI / 2;
    // plane.position.set(0, -3.74, 0)
}
function addLights() {
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.4, 100 );
    const light = new THREE.HemisphereLight(0xffffff, 0xb3858c, 0.9);
  
    scene.add(light);
    scene.add(directionalLight);
    
    directionalLight.position.set( 8, 8, 8 );
    
    directionalLight.castShadow = true;
    
    directionalLight.shadow.mapSize.width = 512;  // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5;    // default
    directionalLight.shadow.camera.far = 500;
  }

function draw() {
    if(isSetUp == true){
        bgScene.remove.apply(bgScene,bgScene.children);
        scene.remove.apply(scene, scene.children);
        
        addBackGround();
        addPlane();
        addLights();
        addHeadPhone();
        isSetUp = false;
    }else{
        scene.remove.apply(scene, scene.children);
        if(isChangeBG ==  true){
            bgScene.remove.apply(bgScene,bgScene.children);
            addBackGround();
            isChangeBG = false;
        }
        
        addPlane();
        addLights();
        if(isChangeColor == true){
            addHeadPhone();
            isOpenColor = false;
        }
    }
    
}
animate();
draw();







// Download glb
const btnDown = document.getElementById('download');
const linkDown = document.createElement('a');
btnDown.addEventListener('click',download);

function download(){
    console.log('isdownload')
    const exporter = new GLTFExporter();
    exporter.parse(
        [bgScene],
        function (result) {
            saveArrayBuffer(result, 'ThreejsScene.glb'); 
        },
        { 
            binary: true
        }
    );
}

function saveArrayBuffer(buffer, filename) {
    save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
}
   
function save(blob, filename) {
    linkDown.href = URL.createObjectURL(blob);    
    linkDown.download = filename;
    linkDown.click(); // This step makes sure your glb file gets downloaded
    sendFileToBackend(blob, filename)
}

function sendFileToBackend(blob, filename){
    const endpoint = "YOUR_BACKEND_URL_HERE";
    const formData = new FormData();

    let sceneFile= new File([blob], "ThreejsScene.glb");
    console.log(sceneFile)
    formData.append("file", sceneFile);

    const options = {
        method:'POST',
        mode: 'no-cors',
        body: formData,
    }

    fetch(endpoint,options)
        .then(response => console.log(JSON.stringify(response)))
        .catch(error => console.error('Error:', error))

}