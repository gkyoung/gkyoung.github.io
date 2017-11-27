var renderer,

    scene,

    camera,

    container;



var arSource,

    arContext,

    arMarker = [];



var 

    mesh;



init();



function init(){







    container = document.getElementById('container');



    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    scene = new THREE.Scene();

    camera = new THREE.Camera();



    renderer.setClearColor(0x000000, 0);

    renderer.setSize(window.innerWidth, window.innerHeight);



    container.appendChild(renderer.domElement);

    scene.add(camera);

    scene.visible = false;





// Instantiate a loader
	var loader = new THREE.GLTFLoader();
	
	// Load a glTF resource
	loader.load(
		// resource URL
		'busterDrone/busterDrone.gltf',
		// called when the resource is loaded
		function ( gltf ) {
	
			scene.add( gltf.scene );
	
			gltf.animations; // Array<THREE.AnimationClip>
			gltf.scene; // THREE.Scene
			gltf.scenes; // Array<THREE.Scene>
			gltf.cameras; // Array<THREE.Camera>
	
		},
		// called when loading is in progresses
		function ( xhr ) {
	
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	
		},
		// called when loading has errors
		function ( error ) {
	
			console.log( 'An error happened' );
	
		}
	);











    arSource = new THREEx.ArToolkitSource({

        sourceType : 'webcam',

    });



    arContext = new THREEx.ArToolkitContext({

        cameraParametersUrl: './assets/data/camera_para.dat',

        detectionMode: 'mono',

    });



    arMarker[0] = new THREEx.ArMarkerControls(arContext, camera, {

        type : 'pattern',

        patternUrl : './assets/data/patt.hiro',

        changeMatrixMode: 'cameraTransformMatrix'

    });



    arMarker[1] = new THREEx.ArMarkerControls(arContext, camera, {

        type : 'pattern',

        patternUrl : './assets/data/u4bi.patt',

        changeMatrixMode: 'cameraTransformMatrix'

    });











    /* handle */

    arSource.init(function(){

        arSource.onResize();

        arSource.copySizeTo(renderer.domElement);



        if(arContext.arController !== null) arSource.copySizeTo(arContext.arController.canvas);



    });



    arContext.init(function onCompleted(){

        

        camera.projectionMatrix.copy(arContext.getProjectionMatrix());



    });





    render();   

    

}   









function render(){

    requestAnimationFrame(render);

    renderer.render(scene,camera);                



    if(arSource.ready === false) return;



    arContext.update(arSource.domElement);

    scene.visible = camera.visible;





    mesh.rotateX(.1);



}          
