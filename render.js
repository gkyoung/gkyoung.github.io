function render(){
    
        requestAnimationFrame(render);
    
        renderer.render(scene,camera);
    
        if(arSource.ready === false) return;
    
        arContext.update(arSource.domElement);
    
        scene.visible = camera.visible;
    
        /* --------------------------------------------- */
    
        var delta = clock.getDelta()
        
        //updating the animations
        for(var i = 0; i < animMixers.length; i++){
            animMixers[i].update(delta);
        }
}
