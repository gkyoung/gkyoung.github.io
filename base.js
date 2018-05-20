
var renderer, scene, camera, container, clock, 
animMixers = [];

var arSource, arContext, arMarker;



function init(){



    container = document.getElementById('container');



    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    scene = new THREE.Scene();

    camera = new THREE.Camera();

    clock = new THREE.Clock;
    var light = new THREE.HemisphereLight(0xFFFFFF, 0x003300, 1);

    scene.add(light);


    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    

    scene.add(camera);

    scene.visible = false;



    arSource = new THREEx.ArToolkitSource({ sourceType : 'webcam' });

    arContext = new THREEx.ArToolkitContext({ cameraParametersUrl: 'assets/data/camera_para.dat', detectionMode: 'mono', });

    arMarker = new THREEx.ArMarkerControls(arContext, camera, { type : 'pattern', patternUrl : 'patterns/star.patt', changeMatrixMode: 'cameraTransformMatrix' });
    //arMarker = new THREEx.ArMarkerControls(arContext, camera, { type : 'pattern', patternUrl : 'patterns/pattern-marker.patt', changeMatrixMode: 'cameraTransformMatrix' });

    

    arSource.init(function(){

        arSource.onResizeElement();

        arSource.copyElementSizeTo(renderer.domElement);

        if(arContext.arController !== null) arSource.copyElementSizeTo(arContext.arController.canvas);

    });



    arContext.init(function onCompleted(){

        camera.projectionMatrix.copy(arContext.getProjectionMatrix());

    });


    render();
}
