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

// utils

var Utils = Utils || {};

(function () {

    'use strict';



    Utils.getShaderSource = function(id) {

        return document.getElementById(id).textContent.replace(/^\s+|\s+$/g, '');

    };



    function createShader(gl, source, type) {

        var shader = gl.createShader(type);

        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        return shader;

    }



    Utils.createProgram = function(gl, vertexShaderSource, fragmentShaderSource) {

        var program = gl.createProgram();

        var vshader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);

        var fshader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

        gl.attachShader(program, vshader);

        gl.deleteShader(vshader);

        gl.attachShader(program, fshader);

        gl.deleteShader(fshader);

        gl.linkProgram(program);



        var log = gl.getProgramInfoLog(program);

        if (log) {

            console.log(log);

        }



        log = gl.getShaderInfoLog(vshader);

        if (log) {

            console.log(log);

        }



        log = gl.getShaderInfoLog(fshader);

        if (log) {

            console.log(log);

        }



        return program;

    };



    var loadImage = Utils.loadImage = function(url, onload) {

        var img = new Image();

        img.crossOrigin = "Anonymous";

        img.src = url;

        // img.onload = function() {

        //     onload(img);

        // };

        img.onload = onload;

        return img;

    };



    Utils.loadImages = function(urls, onload) {

        var imgs = [];

        var imgsToLoad = urls.length;



        function onImgLoad() {

            if (--imgsToLoad <= 0) {

                onload(imgs);

            }

        }



        for (var i = 0; i < imgsToLoad; ++i) {

            imgs.push(loadImage(urls[i], onImgLoad));

        }

    };



})();











(function()  {

    'use strict';



    var selectedGltfSampleModel = 'busterDrone';

    //var selectedGltfSampleModel = 'DamagedHelmet';



    var drawBoundingBox = false;

    var boundingBoxType = 'obb';



    var curAnimationId = 0;

    var playAllAnimationTogether = false;

    var animationSelectionList = document.getElementById("animations");



    animationSelectionList.addEventListener("change", function() {

        curAnimationId = this.selectedIndex;

    });



    document.getElementById("gltf-model").addEventListener("change", function() {

         selectedGltfSampleModel = this.value;

        var uri = this.value;

         if (selectedGltfSampleModel == 'busterDrone') {

             uri = 'https://raw.githubusercontent.com/gkyoung/gkyoung.github.io/master/busterDrone/busterDrone.gltf';

         } else {

             uri = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/'

             + selectedGltfSampleModel

             + '/glTF/'

             + selectedGltfSampleMode
             + '.gltf';

        }



        glTFLoader.loadGLTF(uri, function(glTF) {

             var scene = scenes[0];

            scenes = [];

             TODO: delete gl resources

             scene = null;



            setupScene(glTF);

        });



    });



    document.getElementById("bbox-toggle").addEventListener("change", function() {

        drawBoundingBox = this.checked;

    });



    document.getElementById("play-all-animations").addEventListener("change", function() {

        playAllAnimationTogether = this.checked;

    });



    document.getElementById("bbox-type").addEventListener("change", function() {

        boundingBoxType = this.value;

    });



    var canvas = document.createElement('canvas');

    // canvas.width = Math.min(window.innerWidth, window.innerHeight);

    // canvas.height = canvas.width;

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

    document.body.appendChild(canvas);



    var gl = canvas.getContext( 'webgl2', { antialias: true } );

    var isWebGL2 = !!gl;

    if(!isWebGL2) {

        document.getElementById('info').innerHTML = 'WebGL 2 is not available.  See <a href="https://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">How to get a WebGL 2 implementation</a>';

        return;

    }



    canvas.oncontextmenu = function (e) {

        e.preventDefault();

    };



    // Scene object for runtime renderer

    var Scene = function(glTFScene, glTF, id) {

        this.glTFScene = glTFScene;

        this.glTF = glTF;

        this.id = id;



        // runtime renderer context

        this.rootTransform = mat4.create();

        // @temp, assume every node is in current scene

        this.nodeMatrix = new Array(glTF.nodes.length);

        var i, len;

        for(i = 0, len = this.nodeMatrix.length; i < len; i++) {

            this.nodeMatrix[i] = mat4.create();

        }



        // TODO: runtime joint matrix

    };





          


    



        // runtime stuffs -------------------------

        vertexData: new Float32Array([         

            -1.0,  1.0, -1.0,

            -1.0, -1.0, -1.0,

            1.0, -1.0, -1.0,

            1.0, -1.0, -1.0,

            1.0,  1.0, -1.0,

            -1.0,  1.0, -1.0,



            -1.0, -1.0,  1.0,

            -1.0, -1.0, -1.0,

            -1.0,  1.0, -1.0,

            -1.0,  1.0, -1.0,

            -1.0,  1.0,  1.0,

            -1.0, -1.0,  1.0,



            1.0, -1.0, -1.0,

            1.0, -1.0,  1.0,

            1.0,  1.0,  1.0,

            1.0,  1.0,  1.0,

            1.0,  1.0, -1.0,

            1.0, -1.0, -1.0,



            -1.0, -1.0,  1.0,

            -1.0,  1.0,  1.0,

            1.0,  1.0,  1.0,

            1.0,  1.0,  1.0,

            1.0, -1.0,  1.0,

            -1.0, -1.0,  1.0,



            -1.0,  1.0, -1.0,

            1.0,  1.0, -1.0,

            1.0,  1.0,  1.0,

            1.0,  1.0,  1.0,

            -1.0,  1.0,  1.0,

            -1.0,  1.0, -1.0,



            -1.0, -1.0, -1.0,

            -1.0, -1.0,  1.0,

            1.0, -1.0, -1.0,

            1.0, -1.0, -1.0,

            -1.0, -1.0,  1.0,

            1.0, -1.0,  1.0

        ]),



        

        vertexArray: gl.createVertexArray(),

        vertexBuffer: gl.createBuffer(),



        program: Utils.createProgram(gl, require('./shaders/vs-cube-map.glsl'), require('./shaders/fs-cube-map.glsl')),

        positionLocation: 0,

        uniformMvpLocation: 0, 

        uniformEnvironmentLocation: 0,



        

        draw: (function() {

            var MVP = mat4.create();

            return (function(V, P) {

                mat4.copy(MVP, V);

                MVP[12] = 0.0;

                MVP[13] = 0.0;

                MVP[14] = 0.0;

                MVP[15] = 1.0;

                mat4.mul(MVP, P, MVP);



                gl.useProgram(this.program);

                gl.activeTexture(gl.TEXTURE0 + this.textureIndex);

                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

                gl.uniformMatrix4fv(this.uniformMvpLocation, false, MVP);

                gl.uniform1i(this.uniformEnvironmentLocation, this.textureIndex);

                gl.bindVertexArray(this.vertexArray);

                gl.drawArrays(gl.TRIANGLES, 0, 36);

                gl.bindVertexArray(null);

            });

        })()

    };



    CUBE_MAP.uniformMvpLocation = gl.getUniformLocation(CUBE_MAP.program, "u_MVP");

    CUBE_MAP.uniformEnvironmentLocation = gl.getUniformLocation(CUBE_MAP.program, "u_environment");



    gl.bindVertexArray(CUBE_MAP.vertexArray);

    

    gl.bindBuffer(gl.ARRAY_BUFFER, CUBE_MAP.vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, CUBE_MAP.vertexData, gl.STATIC_DRAW);

    gl.vertexAttribPointer(CUBE_MAP.positionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(CUBE_MAP.positionLocation);



    gl.bindVertexArray(null);





    

    var Shader_Static = {

        shaderVersionLine: '#version 300 es\n',

        

        bitMasks: {

            // vertex shader

            HAS_SKIN: 1,

            SKIN_VEC8: 2,



            // fragment shader

            HAS_BASECOLORMAP: 4,

            HAS_NORMALMAP: 8,

            HAS_METALROUGHNESSMAP: 16,

            HAS_OCCLUSIONMAP: 32,

            HAS_EMISSIVEMAP: 64

        },



        vsMasterCode: require('./shaders/vs-pbr-master.glsl'),

        fsMasterCode: require('./shaders/fs-pbr-master.glsl'),



        programObjects: {}    // < flags, Shader Object >

    };



    var Shader = function() {

        this.flags = 0;

        this.programObject = null;

    };



    Shader.prototype.hasSkin = function() {

        return this.flags & Shader_Static.bitMasks.HAS_SKIN;

    };

    Shader.prototype.hasBaseColorMap = function() {

        return this.flags & Shader_Static.bitMasks.HAS_BASECOLORMAP;

    };

    Shader.prototype.hasNormalMap = function() {

        return this.flags & Shader_Static.bitMasks.HAS_NORMALMAP;

    };

    Shader.prototype.hasMetalRoughnessMap = function() {

        return this.flags & Shader_Static.bitMasks.HAS_METALROUGHNESSMAP;

    };

    Shader.prototype.hasOcclusionMap = function() {

        return this.flags & Shader_Static.bitMasks.HAS_OCCLUSIONMAP;

    };

    Shader.prototype.hasEmissiveMap = function() {

        return this.flags & Shader_Static.bitMasks.HAS_EMISSIVEMAP;

    };





    Shader.prototype.defineMacro = function(macro) {

        if (Shader_Static.bitMasks[macro] !== undefined) {

            this.flags = Shader_Static.bitMasks[macro] | this.flags;

        } else {

            console.log('WARNING: ' + macro + ' is not a valid macro');

        }

    };



    Shader.prototype.compile = function() {

        var existingProgramObject = Shader_Static.programObjects[this.flags];

        if (existingProgramObject) {

            this.programObject = existingProgramObject;

            return;

        }





        // new program



        var vsDefine = '';

        var fsDefine = '';



        // define macros



        if (this.flags & Shader_Static.bitMasks.HAS_SKIN) {

            vsDefine += '#define HAS_SKIN\n';

        }

        if (this.flags & Shader_Static.bitMasks.SKIN_VEC8) {

            vsDefine += '#define SKIN_VEC8\n';

        }



        if (this.flags & Shader_Static.bitMasks.HAS_BASECOLORMAP) {

            fsDefine += '#define HAS_BASECOLORMAP\n';

        }

        if (this.flags & Shader_Static.bitMasks.HAS_NORMALMAP) {

            fsDefine += '#define HAS_NORMALMAP\n';

        }

        if (this.flags & Shader_Static.bitMasks.HAS_METALROUGHNESSMAP) {

            fsDefine += '#define HAS_METALROUGHNESSMAP\n';

        }

        if (this.flags & Shader_Static.bitMasks.HAS_OCCLUSIONMAP) {

            fsDefine += '#define HAS_OCCLUSIONMAP\n';

        }

        if (this.flags & Shader_Static.bitMasks.HAS_EMISSIVEMAP) {

            fsDefine += '#define HAS_EMISSIVEMAP\n';

        }





        // concat

        var vertexShaderSource = 

            Shader_Static.shaderVersionLine +

            vsDefine +

            Shader_Static.vsMasterCode;

        

        var fragmentShaderSource = 

            Shader_Static.shaderVersionLine +

            fsDefine +

            Shader_Static.fsMasterCode;



        // compile

        var program = Utils.createProgram(gl, vertexShaderSource, fragmentShaderSource);

        this.programObject = {

            program: program,

    

            uniformLocations: {},



            uniformBlockIndices: {}

        };



        // uniform block id

        if (this.flags & Shader_Static.bitMasks.HAS_SKIN) {

            this.programObject.uniformBlockIndices.JointMatrix = gl.getUniformBlockIndex(program, "JointMatrix");

        }



        // uniform locations

        var us = this.programObject.uniformLocations;



        us.MVP = gl.getUniformLocation(program, 'u_MVP');

        us.MVNormal = gl.getUniformLocation(program, 'u_MVNormal');

        us.MV = gl.getUniformLocation(program, 'u_MV');

        us.baseColorFactor = gl.getUniformLocation(program, 'u_baseColorFactor');

        us.metallicFactor = gl.getUniformLocation(program, 'u_metallicFactor');

        us.roughnessFactor = gl.getUniformLocation(program, 'u_roughnessFactor');



        if (this.flags & Shader_Static.bitMasks.HAS_BASECOLORMAP) {

            us.baseColorTexture = gl.getUniformLocation(program, 'u_baseColorTexture');

        }

        if (this.flags & Shader_Static.bitMasks.HAS_NORMALMAP) {

            us.normalTexture = gl.getUniformLocation(program, 'u_normalTexture');

            us.normalTextureScale = gl.getUniformLocation(program, 'u_normalTextureScale');

        }

        if (this.flags & Shader_Static.bitMasks.HAS_METALROUGHNESSMAP) {

            us.metallicRoughnessTexture = gl.getUniformLocation(program, 'u_metallicRoughnessTexture');

        }

        if (this.flags & Shader_Static.bitMasks.HAS_OCCLUSIONMAP) {

            us.occlusionTexture = gl.getUniformLocation(program, 'u_occlusionTexture');

            us.occlusionStrength = gl.getUniformLocation(program, 'u_occlusionStrength');

        }

        if (this.flags & Shader_Static.bitMasks.HAS_EMISSIVEMAP) {

            us.emissiveTexture = gl.getUniformLocation(program, 'u_emissiveTexture');

            us.emissiveFactor = gl.getUniformLocation(program, 'u_emissiveFactor');

        }



        us.diffuseEnvSampler = gl.getUniformLocation(program, 'u_DiffuseEnvSampler');

        us.specularEnvSampler = gl.getUniformLocation(program, 'u_SpecularEnvSampler');

        us.brdfLUT = gl.getUniformLocation(program, 'u_brdfLUT');



        // set static uniform values in cubemap

        gl.useProgram(program);

        gl.uniform1i(us.brdfLUT, BRDF_LUT.textureIndex);

        gl.uniform1i(us.specularEnvSampler, CUBE_MAP.textureIndex);

        gl.uniform1i(us.diffuseEnvSampler, CUBE_MAP.textureIBLDiffuseIndex);

        gl.useProgram(null);



        Shader_Static.programObjects[this.flags] = this.programObject;

    };



    // -- Initialize vertex array

    var POSITION_LOCATION = 0; // set with GLSL layout qualifier

    var NORMAL_LOCATION = 1; // set with GLSL layout qualifier

    var TEXCOORD_0_LOCATION = 2; // set with GLSL layout qualifier

    var JOINTS_0_LOCATION = 3; // set with GLSL layout qualifier

    var JOINTS_1_LOCATION = 5; // set with GLSL layout qualifier

    var WEIGHTS_0_LOCATION = 4; // set with GLSL layout qualifier

    var WEIGHTS_1_LOCATION = 6; // set with GLSL layout qualifier

    

    // -- Mouse Behaviour

    var isDisplayRotation = true;

    var s = 1;

    var eulerX = 0;

    var eulerY = 0;

    // var s = 1;

    // var t = -100;

    var translate = vec3.create();

    // var t = -5;

    var modelMatrix = mat4.create();

    var mouseDown = false;

    var mouseButtonId = 0;

    var lastMouseY = 0;

    var lastMouseX = 0;

    var identityQ = quat.create();

    window.onmousedown = function(event) {

        mouseDown = true;

        mouseButtonId = event.which;

        lastMouseY = event.clientY;

        lastMouseX = event.clientX;

        if (mouseButtonId === 1) {

            isDisplayRotation = false;

        }

    };

    window.onmouseup = function(event) {

        mouseDown = false;

        isDisplayRotation = true;

    };

    window.onmousemove = function(event) {

        if(!mouseDown) {

            return;

        }

        var newY = event.clientY;

        var newX = event.clientX;

        

        var deltaY = newY - lastMouseY;

        var deltaX = newX - lastMouseX;

        

        // s *= (1 + deltaY / 1000);



        switch(mouseButtonId) {

            case 1:

            // left: rotation

            eulerX += -deltaY * 0.01;

            eulerY += deltaX * 0.01;

            break;

            case 3:

            // right

            translate[0] += deltaX * 0.001;

            translate[1] += -deltaY * 0.001;

            break;

        }

        

        

        lastMouseY = newY;

        lastMouseX = newX;

    };

    window.onwheel = function(event) {

        translate[2] += -event.deltaY * 0.001;

        // translate[2] *= 1 + (-event.deltaY * 0.01);

    };



    

    // 2.0

    // var gltfUrl = '../glTFs/glTF_version_2/Duck/glTF/Duck.gltf';

    var gltfUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf';



    var glTFLoader = new MinimalGLTFLoader.glTFLoader(gl);



    var glTFModelCount = 1;

    var scenes = [];



    gl.enable(gl.CULL_FACE);

    gl.cullFace(gl.BACK);

    gl.frontFace(gl.CCW);

    var isFaceCulling = true;





    function setupScene(glTF, replaceScene) {

        var i, len;



        // update animation list

        for(i = animationSelectionList.options.length - 1 ; i >= 0 ; i--) {

            animationSelectionList.remove(i);

        }

        if (glTF.animations) {

            var option;

            for (i = 0, len = glTF.animations.length; i < len; i++) {

                option = document.createElement("option");

                option.text = glTF.animations[i].name || i;

                animationSelectionList.add(option);

            }    

        }

        curAnimationId = 0;



        // ----------------

        

        var curGltfScene = glTF.scenes[glTF.defaultScene];



        var sceneDeltaTranslate = vec3.fromValues(curGltfScene.boundingBox.transform[0] * 1.2, 0, 0);

        var tmpVec3Translate = vec3.create();



        var newGltfRuntimeScene;

        if (!replaceScene) {

            newGltfRuntimeScene = new Scene(curGltfScene, glTF, scenes.length);

            scenes.push(newGltfRuntimeScene);

        } else {

            newGltfRuntimeScene = scenes[replaceScene.id] = new Scene(curGltfScene, glTF, replaceScene.id);

        }

        

        // for (i = 0, len = glTFModelCount; i < len; i++) {

        //     scenes.push(new Scene(curGltfScene, glTF));

        //     // vec3.scale(tmpVec3Translate, sceneDeltaTranslate, i);

        //     // mat4.fromTranslation(scenes[i].rootTransform, tmpVec3Translate);

        // }

        



        

        if (scenes.length === 1) {

            // first model, adjust camera

            mat4.identity(modelMatrix);

            

            // center

            s = 1.0 / Math.max( curGltfScene.boundingBox.transform[0], Math.max(curGltfScene.boundingBox.transform[5], curGltfScene.boundingBox.transform[10]) );

            mat4.getTranslation(translate, curGltfScene.boundingBox.transform);

            vec3.scale(translate, translate, -1);

            translate[0] += - 0.5 * curGltfScene.boundingBox.transform[0];

            translate[1] += - 0.5 * curGltfScene.boundingBox.transform[5];

            translate[2] += - 0.5 * curGltfScene.boundingBox.transform[10];

    

            s *= 0.5;

    

            modelMatrix[0] = s;

            modelMatrix[5] = s;

            modelMatrix[10] = s;

            mat4.translate(modelMatrix, modelMatrix, translate);

    

            vec3.set(translate, 0, 0, -1.5);

            s = 1;

        }

        





        // var in loop

        var mesh;

        var primitive;

        var vertexBuffer;

        var indexBuffer;

        var vertexArray;



        var nid, lenNodes;

        var mid, lenMeshes;

        

        var attribute;

        var material;



        var image, texture, sampler;



        var accessor, bufferView;



        var animation, animationSampler, channel;



        var skin;



        // create buffers

        for (i = 0, len = glTF.bufferViews.length; i < len; i++) {

            bufferView = glTF.bufferViews[i];

            bufferView.createBuffer(gl);

            bufferView.bindData(gl);

        }



        

        // create textures

        if (glTF.textures) {

            for (i = 0, len = glTF.textures.length; i < len; i++) {

                texture = glTF.textures[i];

                texture.createTexture(gl);

            }

        }



        // create samplers

        if (glTF.samplers) {

            for (i = 0, len = glTF.samplers.length; i < len; i++) {

                sampler = glTF.samplers[i];

                

                sampler.createSampler(gl);

            }

        }



        if (glTF.skins) {

            // gl.useProgram(programSkinBaseColor.program);

            // gl.uniformBlockBinding(programSkinBaseColor.program, programSkinBaseColor.uniformBlockIndexJointMatrix, 0);

            // gl.useProgram(null);

            for (i = 0, len = glTF.skins.length; i < len; i++) {

                skin = glTF.skins[i];

                

                skin.jointMatrixUniformBuffer = gl.createBuffer();



                // gl.bindBufferBase(gl.UNIFORM_BUFFER, i, skin.jointMatrixUniformBuffer);

                gl.bindBufferBase(gl.UNIFORM_BUFFER, skin.uniformBlockID, skin.jointMatrixUniformBuffer);



                gl.bindBuffer(gl.UNIFORM_BUFFER, skin.jointMatrixUniformBuffer);

                gl.bufferData(gl.UNIFORM_BUFFER, skin.jointMatrixUnidormBufferData, gl.DYNAMIC_DRAW);

                gl.bufferSubData(gl.UNIFORM_BUFFER, 0, skin.jointMatrixUnidormBufferData);

                gl.bindBuffer(gl.UNIFORM_BUFFER, null);

            }

        }







        function setupAttribuite(attrib, location) {

            if (attrib !== undefined) {

                // var accessor = glTF.accessors[ attrib ];

                var accessor = attrib;

                var bufferView = accessor.bufferView;

                if (bufferView.target === null) {

                    // console.log('WARNING: the bufferview of this accessor should have a target, or it should represent non buffer data (like animation)');

                    gl.bindBuffer(gl.ARRAY_BUFFER, bufferView.buffer);

                    gl.bufferData(gl.ARRAY_BUFFER, bufferView.data, gl.STATIC_DRAW);

                } else {

                    gl.bindBuffer(bufferView.target, bufferView.buffer);

                }

                accessor.prepareVertexAttrib(location, gl);

                return true;

            }

            return false;

        }





        // create vaos & materials shader source setup

        for (mid = 0, lenMeshes = glTF.meshes.length; mid < lenMeshes; mid++) {

            mesh = glTF.meshes[mid];

            // vertexArrayMaps[mid] = [];



            for (i = 0, len = mesh.primitives.length; i < len; ++i) {

                primitive = mesh.primitives[i];

                primitive.shader = new Shader();

                // WebGL2: create vertexArray

                primitive.vertexArray = vertexArray = gl.createVertexArray();

                gl.bindVertexArray(vertexArray);

                

                

                setupAttribuite(primitive.attributes.POSITION, POSITION_LOCATION);

                setupAttribuite(primitive.attributes.NORMAL, NORMAL_LOCATION);



                // @tmp, should consider together with material

                setupAttribuite(primitive.attributes.TEXCOORD_0, TEXCOORD_0_LOCATION);

                



                if (

                    setupAttribuite(primitive.attributes.JOINTS_0, JOINTS_0_LOCATION) &&

                    setupAttribuite(primitive.attributes.WEIGHTS_0, WEIGHTS_0_LOCATION)

                ) {

                    // assume these two attributes always appear together

                    primitive.shader.defineMacro('HAS_SKIN');

                }

                



                if (

                    setupAttribuite(primitive.attributes.JOINTS_1, JOINTS_1_LOCATION) &&

                    setupAttribuite(primitive.attributes.WEIGHTS_1, WEIGHTS_1_LOCATION)

                ) {

                    // assume these two attributes always appear together

                    primitive.shader.defineMacro('SKIN_VEC8');

                }



                // indices ( assume use indices )

                if (primitive.indices !== null) {

                    accessor = glTF.accessors[ primitive.indices ];

                    bufferView = accessor.bufferView;

                    if (bufferView.target === null) {

                        // console.log('WARNING: the bufferview of this accessor should have a target, or it should represent non buffer data (like animation)');

                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferView.buffer);

                        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bufferView.data, gl.STATIC_DRAW);

                    } else {

                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferView.buffer);

                    }

                }

                

                



                gl.bindVertexArray(null);



                gl.bindBuffer(gl.ARRAY_BUFFER, null);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);







                // material shader setup

                material = primitive.material;

                if (material) {

                    if (material.pbrMetallicRoughness.baseColorTexture) {

                        primitive.shader.defineMacro('HAS_BASECOLORMAP');

                    }

                    if (material.pbrMetallicRoughness.metallicRoughnessTexture) {

                        primitive.shader.defineMacro('HAS_METALROUGHNESSMAP');

                    }

                    if (material.normalTexture) {

                        primitive.shader.defineMacro('HAS_NORMALMAP');

                    }

                    if (material.occlusionTexture) {

                        primitive.shader.defineMacro('HAS_OCCLUSIONMAP');

                    }

                    if (material.emissiveTexture) {

                        primitive.shader.defineMacro('HAS_EMISSIVEMAP');

                    }

                }

                



                primitive.shader.compile();



            }

            

        }





        return newGltfRuntimeScene;

    }









    // -- Render preparation

    gl.enable(gl.DEPTH_TEST);

    gl.depthFunc(gl.LEQUAL);







    var Renderer = Renderer || {};



    var program = null; // current program object



    (function() {

        'use strict';





        var scale = vec3.create();

        

        var r = 0.0;

        var rotationSpeedY= 0.01;

        // var rotationSpeedY= 0.0;



        var perspective = mat4.create();

        mat4.perspective(perspective, 0.785, canvas.width / canvas.height, 0.01, 100);



        var modelView = mat4.create();



        var localMV = mat4.create();

        var localMVP = mat4.create();

        var localMVNormal = mat4.create();



        var VP = mat4.create();



        var hasIndices = true;



        var hasSkin = false;

        var uniformBlockID;     // same for uniform block binding id



        var curScene;





        function activeAndBindTexture(uniformLocation, textureInfo) {

            gl.uniform1i(uniformLocation, textureInfo.index);

            gl.activeTexture(gl.TEXTURE0 + textureInfo.index);

            var texture = curScene.glTF.textures[ textureInfo.index ];

            gl.bindTexture(gl.TEXTURE_2D, texture.texture);

            var sampler;

            if (texture.sampler) {

                sampler = texture.sampler.sampler;

            } else {

                sampler = defaultSampler;

            }



            gl.bindSampler(textureInfo.index, sampler);

        }

        



        var defaultColor = [1.0, 1.0, 1.0, 1.0];

        var drawPrimitive = Renderer.drawPrimitive = function(primitive, matrix) {

            mat4.multiply(localMV, modelView, matrix);

            mat4.multiply(localMVP, perspective, localMV);

            // mat4.multiply(localMVP, VP, matrix);



            mat4.invert(localMVNormal, localMV);

            mat4.transpose(localMVNormal, localMVNormal);





            var texture, sampler;

            var baseColor = defaultColor;



            var shader = primitive.shader;

            var material = primitive.material;

            



            if (material !== null) {

                var pbrMetallicRoughness = material.pbrMetallicRoughness;

                baseColor = pbrMetallicRoughness.baseColorFactor;

                

                if (primitive.material.doubleSided === isFaceCulling) {

                    isFaceCulling = !primitive.material.doubleSided;

                    if (isFaceCulling) {

                        gl.enable(gl.CULL_FACE);

                    } else {

                        gl.disable(gl.CULL_FACE);

                    }

                }

            }



            

            

            if (program != primitive.shader.programObject) {

                program = primitive.shader.programObject;

                gl.useProgram(program.program);

            }



            if (material) {

                // base color texture

                if (shader.hasBaseColorMap()) {

                    activeAndBindTexture(program.uniformLocations.baseColorTexture, pbrMetallicRoughness.baseColorTexture);

                }



                // normal texture

                if (shader.hasNormalMap()) {

                    activeAndBindTexture(program.uniformLocations.normalTexture, material.normalTexture);

                    gl.uniform1f(program.uniformLocations.normalTextureScale, material.normalTexture.scale);

                }



                // metallic roughness texture

                if (shader.hasMetalRoughnessMap()) {

                    activeAndBindTexture(program.uniformLocations.metallicRoughnessTexture, pbrMetallicRoughness.metallicRoughnessTexture);

                }

                

                gl.uniform1f(program.uniformLocations.metallicFactor, pbrMetallicRoughness.metallicFactor);

                gl.uniform1f(program.uniformLocations.roughnessFactor, pbrMetallicRoughness.roughnessFactor);



                // occlusion texture

                if (shader.hasOcclusionMap()) {

                    activeAndBindTexture(program.uniformLocations.occlusionTexture, material.occlusionTexture);

                    gl.uniform1f(program.uniformLocations.occlusionStrength, material.occlusionTexture.strength);

                }



                // emissive texture

                if (shader.hasEmissiveMap()) {

                    activeAndBindTexture(program.uniformLocations.emissiveTexture, material.emissiveTexture);

                    gl.uniform3fv(program.uniformLocations.emissiveFactor, material.emissiveFactor);

                }

            }

            

            

            // TODO: skin JointMatrix uniform block

            if (shader.hasSkin()) {

                gl.uniformBlockBinding(program.program, program.uniformBlockIndices.JointMatrix, uniformBlockID);

            }

            



            gl.activeTexture(gl.TEXTURE0 + BRDF_LUT.textureIndex);

            gl.bindTexture(gl.TEXTURE_2D, BRDF_LUT.texture);



            gl.activeTexture(gl.TEXTURE0 + CUBE_MAP.textureIndex);

            gl.bindTexture(gl.TEXTURE_CUBE_MAP, CUBE_MAP.texture);



            gl.activeTexture(gl.TEXTURE0 + CUBE_MAP.textureIBLDiffuseIndex);

            gl.bindTexture(gl.TEXTURE_CUBE_MAP, CUBE_MAP.textureIBLDiffuse);





            gl.uniform4fv(program.uniformLocations.baseColorFactor, baseColor);

            

            gl.uniformMatrix4fv(program.uniformLocations.MV, false, localMV);

            gl.uniformMatrix4fv(program.uniformLocations.MVP, false, localMVP);

            gl.uniformMatrix4fv(program.uniformLocations.MVNormal, false, localMVNormal);

            



            gl.bindVertexArray(primitive.vertexArray);



            if (primitive.indices !== null) {

                gl.drawElements(primitive.mode, primitive.indicesLength, primitive.indicesComponentType, primitive.indicesOffset);

            } else {

                gl.drawArrays(primitive.mode, primitive.drawArraysOffset, primitive.drawArraysCount);

            }





            gl.bindVertexArray(null);



        }



        



        var tmpMat4 = mat4.create();

        var inverseTransformMat4 = mat4.create();

        

        // @todo: 

        // in a real engine, it is better to simply parse the node tree stucture

        // to compute transform matrices,

        // then sort node array by material and render use a for loop

        // to minimize context switch

        var drawNode = Renderer.drawNode = function (node, nodeID, nodeMatrix, parentModelMatrix) {

            var matrix = nodeMatrix[nodeID];

            

            if (parentModelMatrix !== undefined) {

                mat4.mul(matrix, parentModelMatrix, node.matrix);

            } else {

                // from scene root, parent is identity

                mat4.copy(matrix, node.matrix);

            }

            // mat4.mul(matrix, parentModelMatrix, node.matrix);



            hasSkin = false;

            if (node.skin !== null) {

                // mesh node with skin

                hasSkin = true;

                var skin = node.skin;

                uniformBlockID = skin.uniformBlockID;

                var joints = node.skin.joints;

                var jointNode;



                mat4.invert(inverseTransformMat4, matrix);





                // @tmp: assume joint nodes are always in the front of the scene node list

                // so that their matrices are ready to use

                for (i = 0, len = joints.length; i < len; i++) {

                    jointNode = joints[i];

                    mat4.mul(tmpMat4, nodeMatrix[jointNode.nodeID], skin.inverseBindMatrix[i]);

                    mat4.mul(tmpMat4, inverseTransformMat4, tmpMat4);



                    // if (skin.skeleton !== null) {

                    //     mat4.mul(tmpMat4, inverseSkeletonRootMat4, tmpMat4);

                    // }



                    skin.jointMatrixUnidormBufferData.set(tmpMat4, i * 16);

                }



                gl.bindBuffer(gl.UNIFORM_BUFFER, skin.jointMatrixUniformBuffer);

                gl.bufferSubData(gl.UNIFORM_BUFFER, 0, skin.jointMatrixUnidormBufferData, 0, skin.jointMatrixUnidormBufferData.length);

            }





            var i, len;



            // draw cur node's mesh

            if (node.mesh !== null) {

                // drawMesh(glTF.meshes[node.mesh], matrix);



                // var mesh = glTF.meshes[node.mesh];

                var mesh = node.mesh;

                for (i = 0, len = mesh.primitives.length; i < len; i++) {

                    // draw primitive

                    drawPrimitive(mesh.primitives[i], matrix);

                }



                // BOUNDING_BOX.draw(mesh.boundingBox, matrix, modelView, perspective);

                // gl.useProgram(program);

            }

            

            if (node.skin !== null) {

                gl.bindBuffer(gl.UNIFORM_BUFFER, null);

            }

            



            // draw children

            

            var childNodeID;

            for (i = 0, len = node.children.length; i < len; i++) {

                // childNodeID = node.children[i];

                // drawNode(glTF.nodes[childNodeID], childNodeID, matrix);

                drawNode(node.children[i], node.children[i].nodeID, nodeMatrix, matrix);

            }

        }





        function applyAnimation(animation, glTF) {

            var j, lenj;

            var channel, animationSampler, node;



            for (j = 0, lenj = animation.samplers.length; j < lenj; j++) {

                animation.samplers[j].getValue(timeParameter);

            }



            for (j = 0, lenj = animation.channels.length; j < lenj; j++) {

                channel = animation.channels[j];

                animationSampler = channel.sampler;

                node = glTF.nodes[channel.target.nodeID];



                switch (channel.target.path) {

                    case 'rotation':

                    vec4.copy(node.rotation, animationSampler.curValue);

                    break;



                    case 'translation':

                    vec3.copy(node.translation, animationSampler.curValue);

                    break;



                    case 'scale':

                    vec3.copy(node.scale, animationSampler.curValue);

                    break;

                }



                node.updateMatrixFromTRS();

                

            }

        }



        var drawScene = Renderer.drawScene = function (scene) {

            // animation

            var animation;

            var i, len;



            var glTF = scene.glTF;

            if (glTF.animations) {

                if (playAllAnimationTogether) {

                    for (i = 0, len = glTF.animations.length; i < len; i++) {

                        animation = glTF.animations[i];

                        applyAnimation(animation, glTF);

                    }

                } else {

                    animation = glTF.animations[curAnimationId];

                    applyAnimation(animation, glTF);

                }

            }





            for (var i = 0, len = scene.glTFScene.nodes.length; i < len; i++) {

                drawNode( scene.glTFScene.nodes[i], scene.glTFScene.nodes[i].nodeID, scene.nodeMatrix, scene.rootTransform );

            }

        }






    arSource = new THREEx.ArToolkitSource({
        sourceType : 'webcam',
    });

    arContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: './assets/data/camera_para.dat',
        detectionMode: 'mono',
    });

  

    arMarker[1] = new THREEx.ArMarkerControls(arContext, camera, {
        type : 'pattern',
        patternUrl : 'patterns/monroe.patt',
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


   

}          
