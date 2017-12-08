function loadModel(url, scale) {
    //get the file extension
    var ext = url.split('.').pop();

    //GLTF loader
    if (ext == 'gltf') {
        var gltfLoader = new THREE.GLTFLoader();

        // Load a glTF resource
        gltfLoader.load(
            // resource URL
            url,
            // called when the resource is loaded
            function (gltf) {

                console.log(gltf);
                if (scale) gltf.scene.scale.set(scale, scale, scale);
                scene.add(gltf.scene);

                var mixer = new THREE.AnimationMixer(gltf.scene.children[0]);
                mixer.clipAction(gltf.animations[0]).play();
                animMixers.push(mixer);


            },
            // called when loading is in progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error) {
                console.log('An error happened');
            }
        );
    } else if (ext == 'js' || ext == 'json') { //JSON loader
        loader = new THREE.JSONLoader();

        loader.load(

            url,

            function (geometry, materials) {
                var skinA = {},

                    skinB = {};

                for (var i in materials) materials[i].skinning = true;

                skinA.root = new THREE.SkinnedMesh(geometry, materials);

                scene.add(skinA.root);

                skinA.mixer = new THREE.AnimationMixer(skinA.root);

                animMixers.push(skinA.mixer);

                skinA.mixer.clipAction(skinA.root.geometry.animations[0]).play();



                skinB.root = new THREE.SkinnedMesh(geometry, materials);

                scene.add(skinB.root);

                skinB.mixer = new THREE.AnimationMixer(skinB.root);

                animMixers.push(skinB.mixer);

                skinB.mixer.clipAction(skinB.root.geometry.animations[0]).play();

                skinA.root.scale.set(0.15, 0.15, 0.15);

                skinB.root.scale.set(0.15, 0.15, 0.15);



                skinA.root.position.set(1, 0, 0);

                skinB.root.position.set(-1, 0, 0);



                skinA.root.rotateY(-Math.PI / 2);

                skinB.root.rotateY(Math.PI / 2);

            });
    }
}
