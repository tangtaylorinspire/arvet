/*  
    File Name: main.js
    This is the main application.
*/

import { findObjEvt } from './findObjEvt';
import { start, init, animate } from './main_vessel';

var renderer, camera, scene, markerRoot, constant, arSceneCop, kidneyScene, mixer, water;
var texture, waterUreter, kidneyGeometry, ureter, histColor, histChild, ureterObj, kidneyObj;
var loaded = false;
var id;
var inited = false;
var offsetU = null;
var triShLabel = false;
var pos, ureter_centroid;
var markerShow = false;
var zoomEnabled;

var clock = new THREE.Clock();
var step = 0;
var zoomIndex = 0.03;

/* Parms for the ureter water color */
var params = {
    color: 0xffffff,
    scale: 4,
    flowX: 1,
    flowY: 1,
    waterColor: "rgba(12, 132, 230, 0.8)",
    antialias: false
};

/*
    When the application load successfully, start the camera
    Parameter: videoParams - 
*/
function cameraSuccess(videoParams) {
    ARController.getUserMediaThreeScene({
        maxARVideoSize: 640,
        //width: { max: 640 },
        //height: { max: 480 },
        cameraParam: 'Data/camera_para-iPhone 6 Plus rear 1280x720 1.0m.dat',
        deviceId: videoParams.deviceId,
        facing: 'environment',
        onSuccess: createAR
    })
}

/*
    When the application load successfully, create the AR
    Parameter:  arScene - , 
                arController - ,
                arCameraParam - 
*/
function createAR(arScene, arController, arCameraParam) {

    /* Init the VAR */
    camera = arScene.camera;

    /* Marker detection mode */
    /* For QR Marker */
    //arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);

    /* For Image Marker */
    arController.setPatternDetectionMode(artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX);

    /* Store the current water color */
    histColor = params.waterColor;

    /* Scene for the Kidney */
    kidneyScene = new THREE.Scene();
    kidneyScene.background = new THREE.Color(0xffffff);

    /* Scene for the AR */
    arScene.scene.clearColor = new THREE.Color(0xffffff);

    /* Light position */
    var light = new THREE.PointLight(0xffffff);
    arScene.scene.add(light);

    /* Model Path */
    var model_url = './model/kidney_part1.obj';
    var model_url1 = './model/kidney_part2.obj';

    /* Manager for loading the 3D model */
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
        var plainBg = document.getElementById("plainBg");

        /* Wait Until the OBJ model load */
        plainBg.style.opacity = 0;
        plainBg.style.visibility = "hidden";
        plainBg.style.transition = 'opacity 1s, visibility 1s';

        /* For the Device otherthan Desktop */
        if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
            document.getElementById("overlayDetect").style.display = "none";
            //document.getElementById("overlayIntro-phone").style.display = "block";
        }
    };

    /* Show the status of the loading */
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
            document.getElementById("loading").innerHTML = Math.round(percentComplete, 1) + '%';
        }
    };

    var onError = function (xhr) { };

    /* OBJ Loader */
    var loader = new THREE.OBJLoader2(manager);

    /* For the screen element */
    document.body.className = arController.orientation;
    renderer = new THREE.WebGLRenderer({ antialias: params.antialias, alpha: true, powerPreference: 'low-power', autoClear: true });
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);

    var w = window.innerWidth;
    var h = window.innerHeight;

    var type = window.screen.orientation.type;
    var firstPort = false;

    if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
        document.body.className += ' phone';
        if (h > w) resize(h, w, arScene, renderer);
        else resize(w, h, arScene, renderer);
    } else {
        if (h > w || arController.orientation === 'portrait' || type === 'portrait-secondary' || type === 'portrait-primary') {
            document.getElementById("overlayDetect").style.display = "block";
            firstPort = true;
        } else {
            resize(w, h, arScene, renderer);
            document.body.className += ' desktop';
        }
    }

    /* if antialias is false, add the 'SD' id to identify */
    params.antialias === false ? renderer.domElement.id = 'SD' : renderer.domElement.id = 'HD';
    document.body.insertBefore(renderer.domElement, document.body.firstChild);

    /* Resize window function */
    window.addEventListener('resize', function () {
        if (h > w && !(/Android|mobile|iPad|iPhone/i.test(navigator.userAgent))) document.getElementById("overlayDetect").style.display = "block";
        else if (firstPort === true) location.reload();
        else if (firstPort === false) {
            resize(w, h, arScene, renderer);
            document.getElementById("overlayDetect").style.display = "none";
        }
    })

    /* Detect the orientation change */
    window.addEventListener('orientationchange', function () {
        var type = window.screen.orientation.type;
        if (type === 'portrait-secondary' || type === 'portrait-primary') document.getElementById("overlayDetect").style.display = "block";
        else if (type === 'landscape-primary' || type === 'landscape-secondary') document.getElementById("overlayDetect").style.display = "none";
    })

    /* Create domElement listener, e.g. Button */
    if (inited === false) {

        /* Button for the 3 change drink button */
        var drinkButton = [{ buttonID: "OverlayWater", materialType: "Water" },
        { buttonID: "OverlayMilk", materialType: "Milk" },
        { buttonID: "OverlayJuice", materialType: "Orange Juice" }]

        for (var i = 0; i < drinkButton.length; i++) {
            (function (i) {
                document.getElementById(drinkButton[i].buttonID).addEventListener("click", function (e) {
                    changeDrink(kidneyScene, drinkButton[i].materialType)
                }, false);
            })(i, this)
        }

        /* Button for switch the scence to HD */
        document.getElementById("hdBtn").addEventListener("click", function (event) {
            var el;
            params.antialias == true ? el = document.getElementById('HD') : el = document.getElementById('SD');
            if (el) {
                renderer.dispose();

                /* Change the button style for HD / SD */
                params.antialias == true ? document.getElementById("hdBtn").style.backgroundColor = "rgba(192, 192, 192, 0.8)"
                    : document.getElementById("hdBtn").style.backgroundColor = "rgba(255, 165, 000, 0.8)";
                params.antialias = !params.antialias;

                var plainBg = document.getElementById("plainBg");
                plainBg.style.opacity = 1;
                plainBg.style.visibility = "visible";
                plainBg.style.transition = 'opacity 1s, visibility 1s';

                /* Refresh the application */
                cancelAnimationFrame(id);
                scene = null;
                camera = null;
                arScene = null;
                arController = null;
                kidneyScene = null;
                renderer = null;
                el.remove();
                ARThreeOnLoad();
            }
            event.preventDefault();
        }, false);

        /* Close button for ureter info box */
        document.getElementById("overlayIDU").addEventListener("click", function (e) {
            var overlayUreter = document.getElementById("overlayUreter")

            /* Animation opacity, right and position */
            overlayUreter.style.opacity = 0;
            overlayUreter.style.right = '-100%';
            overlayUreter.style.transition = 'right 1s, opacity 1s';
            overlayUreter.style.removeProperty('width');

            chOpacity("Main_Kidney", 1, true);
            document.getElementById("ureterVideo").src = "";

            if (zoomEnabled === true) handleZoom();
        }, false);

        /* Close button for kidney info box */
        document.getElementById("overlayIDK").addEventListener("click", function (e) {
            var overlayKindney = document.getElementById("overlayKindney")

            /* Animation opacity, right and position */
            overlayKindney.style.opacity = 0;
            overlayKindney.style.right = '-100%';
            overlayKindney.style.transition = 'right 1s, opacity 1s';
            overlayKindney.style.removeProperty('width');

            chOpacity("Ureter_mesh", 0.5, true);
            document.getElementById("kidneyVideo").src = "";
        }, false);

        /* Button for the label */
        document.getElementById("shLabel").addEventListener("click", function (event) {
            triShLabel = !triShLabel
            triShLabel === false ? document.getElementById("shLabel").style.backgroundColor = "rgba(192, 192, 192, 0.8)"
                : document.getElementById("shLabel").style.backgroundColor = "rgba(255, 0, 0, 0.8)";
            event.preventDefault();
        }, false);

        /* Button for the zoom feature */
        document.getElementById("overlayZoom").addEventListener("click", function (event) {
            handleZoom();
        }, false);

        /* If all listener are initialized, update the inited tag */
        inited = true;
    }

    /* DomElement for the 3D model */
    renderer.domElement.addEventListener('click', function (ev) {
        var obj = findObjEvt(ev, arScene.camera, kidneyScene, 1);
        if (obj) {
            var obj = findObjEvt(ev, arScene.camera, kidneyScene, 1);
            for (var i = 0; i < obj.length; i++) {
                /* Show the kidney only */
                if (obj[i].object.name === 'MainKidney') {
                    onKindney();
                    chOpacity("Ureter_mesh", 0.1, false);
                    break;
                    /* Show the ureter only */
                } else if (obj[i].object.name === 'Ureter_mesh') {
                    onUreter();
                    chOpacity("Main_Kidney", 0.3, false);
                    break;
                }
            }
        }
    }, false);

    /*
        Use to handle the Zoom in Zoom out on the Ureter
        Parameter:  null
    */
    function handleZoom() {
        zoomEnabled = !zoomEnabled;

        /* Change Sence animation start */
        var curtain = document.getElementById("curtain")
        var zoomButton = document.getElementById("overlayZoom")
        var closeButton = document.getElementById("overlayIDU")

        /* Animation opacity, right and position - to make the fade in function */
        curtain.style.opacity = 1;
        curtain.style.right = '0%';
        curtain.style.transition = 'opacity 3s';
        zoomButton.disabled = true;
        closeButton.disabled = true;

        /* Animation opacity, right and position - to make the fade out function */
        setTimeout(function () {
            if (zoomEnabled) start();
            else if (!zoomEnabled) {
                var vessel = document.getElementById('vessel');
                vessel.remove(); // Removes the div with the 'div-02' id
                $('#overlayIDU').tooltip('hide'); /* Close all of the tooltip */
                $('#overlayZoom').tooltip('hide');
            }
            curtain.style.opacity = 0;
            curtain.style.transition = 'opacity 3s';
        }, 3000);

        setTimeout(function () {
            zoomButton.disabled = false;
            closeButton.disabled = false;
            curtain.style.right = '100%';
        }, 6000);

        event.preventDefault();
    }

    /*  Change the Opacity for the model 
        Parameter:  name (str) - The name of the object,
                    opacity (int, 0-1) - The index of the opacity
                    reset (Boolean) - Reset the object ?
    */
    function chOpacity(name, opacity, reset) {
        var selectedObject = kidneyScene.getObjectByName(name);
        if (name === "Main_Kidney") {
            selectedObject.children[0].traverse(function (child) {
                child.material.transparent = true;
                child.material.opacity = opacity;
            });
        } else if (name === "Ureter_mesh" && reset === true) {
            selectedObject.material.transparent = false;
            selectedObject.material.opacity = opacity;
            changeDrink(kidneyScene, "reset")
        } else if (name === "Ureter_mesh" && reset === false) {
            selectedObject.material.transparent = true;
            selectedObject.material.opacity = opacity;
        }
    }

    /* Main Kidney loader */
    loader.load(model_url, function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) child.material.transparent = true;
        });
        object.name = "Main_Kidney"

        object.rotation.set((90 * Math.PI) / 180, (20 * Math.PI) / 180, 0); // Degree: (degree*Math.PI) / 180 

        if (h > w) {
            var scaleH = h / w;
            object.scale.set(0.03 * scaleH, 0.03, 0.03);
        } else object.scale.set(0.03, 0.03, 0.03);

        kidneyScene.add(object);
        kidneyObj = object
    }, onProgress, onError);

    var ureterGroup = new THREE.Object3D();
    ureterGroup.name = "ureterGroup"

    /* Ureter loader */
    loader.load(model_url1, function (object) {
        object.traverse(function (child) { load_child(child) });

        waterUreter.rotation.set((90 * Math.PI) / 180, (20 * Math.PI) / 180, 0); // Degree: (degree*Math.PI) / 180
        object.rotation.set((90 * Math.PI) / 180, (20 * Math.PI) / 180, 0);

        if (h > w) {
            var scaleH = h / w;
            object.scale.set(0.03 * scaleH, 0.03, 0.03);
        } else object.scale.set(0.03, 0.03, 0.03);

        ureterObj = object
    }, onProgress, onError);

    /* Ureter Child loader */
    function load_child(child) {
        if (child instanceof THREE.Mesh) {
            /* Create kidney Geometry */
            kidneyGeometry = child.geometry.clone();

            /* Create Water material */
            waterUreter = new THREE.Water(child.geometry.clone(), {
                color: params.color,
                scale: params.scale,
                flowDirection: new THREE.Vector2(params.flowX, params.flowY),
                textureWidth: 1024,
                textureWidth: 1024
            });

            /* Create Water material texture */
            texture = ctx_texture()
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                depthWrite: true,
                depthTest: true,
                transparent: true,
                opacity: 0.5
            });

            var mesh = new THREE.Mesh(kidneyGeometry, material);
            mesh.renderOrder = 1;
            mesh.rotation.set((90 * Math.PI) / 180, (20 * Math.PI) / 180, 0);

            var helper = new THREE.BoxHelper(mesh, 0xff0000);
            helper.update();

            waterUreter.rotation.set((90 * Math.PI) / 180, (20 * Math.PI) / 180, 0);

            var helper2 = new THREE.BoxHelper(waterUreter, 0xff0000);
            helper2.update();

            mesh.geometry.computeBoundingBox();
            var centroid = mesh.geometry.boundingBox.getCenter();
            centroid.applyMatrix4(mesh.matrixWorld);
            mesh.position.set(centroid.x, centroid.y, centroid.z);
            mesh.geometry.center()

            waterUreter.name = "Ureter"
            mesh.name = "Ureter_mesh"
            ureterGroup.add(waterUreter);
            ureterGroup.add(mesh);
            ureterGroup.scale.set(0.03, 0.03, 0.03);
        }
    }

    kidneyScene.add(ureterGroup)

    /* Background animation

    var meshes = [];
    var geometry = new THREE.TorusGeometry(0.5, 0.3, 32, 16, Math.PI * 1.25);
    var N_OBJECTS = 2000
    //geometry = new THREE.TorusKnotGeometry( 0.5, 0.124, 128, 4, 8, 1 );

    console.log(geometry.faces.length, geometry.faces.length * N_OBJECTS);

    texture = ctx_texture();
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        depthWrite: true,
        depthTest: true,
        transparent: true,
        opacity: 0.5
    });


    var dd = 10;
    var group = new THREE.Object3D();

    for (var i = 0; i < N_OBJECTS; i++) {

        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = THREE.Math.randFloatSpread(dd);
        mesh.position.y = THREE.Math.randFloatSpread(dd);
        mesh.position.z = THREE.Math.randFloatSpread(dd);

        //console.log(THREE.Math.randFloatSpread(dd))

        mesh.rotation.x = Math.random() * 360 * (Math.PI / 180);
        mesh.rotation.y = Math.random() * 360 * (Math.PI / 180);
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.1;

        group.add(mesh);
        meshes[i] = mesh;
    }

    //group.position.y = 5000;
    kidney.add(group);

    console.log(kidney)*/

    /* AR sence loader */
    arController.loadMarker('Data/patt.bigpeeBoyWBlack', function (markerId) {
        markerRoot = arController.createThreeMarker(markerId);
        markerRoot.add(kidneyScene);
        arScene.scene.add(markerRoot);
    });

    arController.addEventListener('getMarker', function (ev) {
        if (ev.data.type === -1) markerShow = false;
        else if (ev.data.type === 0) markerShow = true;
    });

    /*  Return the object in term of screen postition 
        Parameter:  obj (three.js Object) - The object that want to get the screen position,
                    camera (three.js camera) - The camera of the sence
    */
    function toScreenPosition2(obj, camera) {
        var vector = new THREE.Vector3();

        var widthHalf = 0.5 * renderer.context.canvas.width;
        var heightHalf = 0.5 * renderer.context.canvas.height;

        obj.updateMatrixWorld();
        vector.applyMatrix4(obj.matrixWorld);
        vector.project(camera);

        vector.x = (vector.x * widthHalf) + widthHalf;
        vector.y = - (vector.y * heightHalf) + heightHalf;

        return { x: vector.x, y: vector.y };
    };

    /*
        Return the object in term of 3D Position
        Parameter:  mesh - three.js mesh
    */
    function get3DPosition(mesh) {
        var helper = new THREE.BoxHelper(mesh, 0xff0000);
        helper.update();

        mesh.geometry.computeBoundingBox();
        var centroid = mesh.geometry.boundingBox.getCenter();
        centroid.applyMatrix4(mesh.matrixWorld);
        return centroid;
    };

    /* Hover Function */
    /*
    var needResetK, needResetU = false
    var INTERSECTED = null

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    function onDocumentMouseMove(event) {
        event.preventDefault();
        var obj = findObjEvt(event, arScene.camera, kidney, 1);
        if (obj && INTERSECTED === null) {
            if (INTERSECTED != obj[0].object) {
                var obj = findObjEvt(event, arScene.camera, kidney, 1);
                for (var i = 0; i < obj.length; i++) {
                    // Show the Kidney 
                    if (obj[i].object.name === 'MainKidney') {
                        chOpacity("Ureter_mesh", 0.1, false);
                        INTERSECTED = obj[0].object;
                        break;
                    } else if (obj[i].object.name === 'Ureter_mesh') {
                        chOpacity("Main_Kidney", 0.3, false);
                        INTERSECTED = obj[0].object;
                        break;
                    }
                }
            }
        } else {
            if (INTERSECTED) {
                if (INTERSECTED.name === 'MainKidney') chOpacity("Ureter_mesh", 0.5, true);
                else if (INTERSECTED.name === 'Ureter_mesh') chOpacity("Main_Kidney", 1, true);
            }
            INTERSECTED = null;
        }
        setTimeout(function () { }, 500);
    }*/

    var posIndex = 0.09;
    var histPos = -1;
    var ureterXOffset = 1.5;

    /*  Tick function will loop until the application end
        Parameter:  null   
    */
    var tick = function () {
        arScene.process();
        arScene.renderOn(renderer);
        id = requestAnimationFrame(tick);

        var delta = clock.getDelta();
        var esTime = clock.getElapsedTime();
        texture.offset.y -= delta * 2;
        texture.offset.x -= delta

        /* If the marker shown on the camera, the label will present  */
        if (triShLabel === true && clock.elapsedTime % 0.1 >= 0.05 && markerShow === true) {
            var screenPos = toScreenPosition2(kidneyScene.getObjectByName("Main_Kidney"), arScene.camera)
            document.getElementById("label_tip_K").style.top = (screenPos.y) + "px";
            document.getElementById("label_tip_K").style.left = (screenPos.x) + "px";
            $('#label_tip_K').tooltip('show');
            screenPos = toScreenPosition2(kidneyScene.getObjectByName("Ureter_mesh"), arScene.camera)
            document.getElementById("label_tip_U").style.top = screenPos.y + "px";
            document.getElementById("label_tip_U").style.left = screenPos.x + "px";
            $('#label_tip_U').tooltip('show');
        } else if (triShLabel === false || markerShow === false) {
            $('#label_tip_U').tooltip('hide');
            $('#label_tip_K').tooltip('hide');
        }

        /* Enable the zoom function */
        if (zoomEnabled === true) {
            var position = get3DPosition(kidneyScene.getObjectByName("Ureter_mesh"))
            /* Perform the object zoom in */
            if (zoomIndex <= 0.5) {
                zoomIndex += 0.003;
                var selectedObject = kidneyScene.getObjectByName("Main_Kidney");
                selectedObject.scale.set(zoomIndex, zoomIndex, zoomIndex)

                selectedObject = kidneyScene.getObjectByName("ureterGroup");
                selectedObject.scale.set(zoomIndex, zoomIndex, zoomIndex)

                position.x += ureterXOffset
            }

            /*  To aviod unstable value, toFixed(N) is used to handle the value between 0 to posIndex,
                If position.x/y is near than 0 but smaller the posIndex, the kidneyScene.position.x/y will not be change
            */

            /*  Perform the object move the x position to Ureter */
            if (position.x < 0) {
                if ((position.x).toFixed(2) > -1 * posIndex) kidneyScene.position.x = 0
                else kidneyScene.position.x = kidneyScene.position.x + posIndex
            } else if (position.x > 0) {
                // Handle the if the position.x move between 0 to posIndex
                if ((position.x).toFixed(2) < posIndex) kidneyScene.position.x = 0
                else kidneyScene.position.x = kidneyScene.position.x - posIndex
            }

            /*  Perform the object move the y position to Ureter */
            if (position.y < 0) {
                if ((position.y).toFixed(2) > -1 * posIndex) kidneyScene.position.y = 0
                else kidneyScene.position.y = kidneyScene.position.y + posIndex
            } else if (position.y > 0) {
                // Handle the if the position.y move between 0 to posIndex
                if ((position.x).toFixed(2) < posIndex) kidneyScene.position.y = 0
                else kidneyScene.position.y = kidneyScene.position.y - posIndex
            }
        } else if (zoomEnabled === false) {
            /* Perform the object zoom out */
            if (zoomIndex > 0.03) {
                zoomIndex -= 0.003;
                var selectedObject = kidneyScene.getObjectByName("Main_Kidney");
                selectedObject.scale.set(zoomIndex, zoomIndex, zoomIndex)

                selectedObject = kidneyScene.getObjectByName("ureterGroup");
                selectedObject.scale.set(zoomIndex, zoomIndex, zoomIndex)
            }

            /* Perform the object move the x position to the scene position 0 */
            if (kidneyScene.position.x < 0) {
                if ((kidneyScene.position.x).toFixed(2) > -1 * posIndex) kidneyScene.position.x = kidneyScene.position.x
                else kidneyScene.position.x = kidneyScene.position.x + posIndex
            } else if (kidneyScene.position.x > 0) {
                // Handle the if the kidneyScene.position.x move between 0 to posIndex
                if ((kidneyScene.position.x).toFixed(2) < posIndex) kidneyScene.position.x = kidneyScene.position.x
                else kidneyScene.position.x = kidneyScene.position.x - posIndex
            }

            /* Perform the object move the y position to the scene position 0 */
            if (kidneyScene.position.y < 0) {
                if ((kidneyScene.position.y).toFixed(2) > -1 * posIndex) kidneyScene.position.y = kidneyScene.position.y
                else kidneyScene.position.y = kidneyScene.position.y + posIndex
            } else if (kidneyScene.position.y > 0) {
                // Handle the if the kidneyScene.position.y move between 0 to posIndex
                if ((kidneyScene.position.y).toFixed(2) < posIndex) kidneyScene.position.y = kidneyScene.position.y
                else kidneyScene.position.y = kidneyScene.position.y - posIndex
            }
        };

        //if (offsetU != null) console.log(toScreenPosition(kidney.getObjectByName("Main_Kidney"), offsetU, arScene.camera))

        /*for (var i = 0; i < N_OBJECTS; i++) {

            var mesh = meshes[i];

            mesh.rotation.x += 0.3 * delta;
            mesh.rotation.y += 0.5 * delta;

            //console.log( mesh.position.y)

            mesh.position.y = (mesh.position.y - 1 * delta) % 10;

        }*/
    };

    tick();
}

/*
    Resize the camera dimension
*/
function resize(w, h, arScene, renderer) {
    // Get the scale of the windows dimension
    var scaleH = h / arScene.video.videoHeight;
    var scaleW = w / arScene.video.videoWidth;
    if (h >= w) {
        renderer.setSize(arScene.video.videoWidth * scaleH, h, false);
    } else if (w >= h) {
        if (scaleW * arScene.video.videoHeight < h) renderer.setSize(arScene.video.videoWidth * scaleH, h, false);
        else renderer.setSize(w, scaleW * arScene.video.videoHeight, false);
    }
}

/*
    Change the Ureter liquid color
    Parameter:  kidneyScene - The scene that include kidney
                value - The liquid material 
*/
function changeDrink(kidneyScene, value) {
    /* Switch the ureter material */
    switch (value) {
        case "Water":
            histColor = params.waterColor;
            params.waterColor = "rgba(12, 132, 230, 0.8)";
            break;
        case "Milk":
            histColor = params.waterColor;
            params.waterColor = "rgba(220, 217, 205, 0.8)";
            break;
        case "Orange Juice":
            histColor = params.waterColor;
            params.waterColor = "rgba(255, 127, 51,0.8)";
            break;
        case "reset":
            params.waterColor = histColor;
            break;
        default:
            console.log("error")
    }
    var selectedObject = kidneyScene.getObjectByName("Ureter_mesh");
    selectedObject.traverse(function (child) {
        const texture = ctx_texture()
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            depthWrite: true,
            depthTest: true,
            transparent: true,
            opacity: 0.5
        });
        child.material = material;
    });
}

window.ARThreeOnLoad = function () {
    navigator
        .mediaDevices
        .enumerateDevices()
        .then(function (devices) {
            var device = devices.find(function (element) {
                return element.label.indexOf('back') !== -1
            })

            var videoParams = { deviceId: device ? { exact: device.deviceId } : undefined }
            cameraSuccess(videoParams);
        })
        .catch(function (err) {
            alert(err.name + ": " + err.message);
        })
}

/*
    Turn on the kidney info box 
    Parameter:  null 
*/
function onKindney() {
    var overloayKindney = document.getElementById("overlayKindney");
    var overlayUreter = document.getElementById("overlayUreter");

    /* Set the style and Animation of overloayKindney info box */
    overlayUreter.style.opacity = 0;
    overlayUreter.style.right = '-100%';
    overlayUreter.style.transition = 'right 1s, opacity 1s';
    overlayUreter.style.removeProperty('width');

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        // Take the user to a different screen here.
        overloayKindney.style.width = '100%';
        overloayKindney.style.height = '50%';
        overloayKindney.style.top = '50%';
    }

    /* Animation opacity, right and position */
    overloayKindney.style.opacity = 1;
    overloayKindney.style.right = 0;
    overloayKindney.style.transition = 'opacity 1s, right 1s';

    /* Put back the video source */
    document.getElementById("kidneyVideo").src = "https://www.youtube.com/embed/FN3MFhYPWWo?enablejsapi=1";
}

/*
    Turn on the ureter info box 
    Parameter:  null 
*/
function onUreter() {
    var overloayKindney = document.getElementById("overlayKindney");
    var overlayUreter = document.getElementById("overlayUreter");

    /* Set the style and Animation of overloayKindney info box */
    overloayKindney.style.opacity = 0;
    overloayKindney.style.right = '-100%';
    overloayKindney.style.transition = 'right 1s, opacity 1s';
    overloayKindney.style.removeProperty('width');

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        // Take the user to a different screen here.
        overlayUreter.style.width = '100%';
        overlayUreter.style.height = '50%';
        overlayUreter.style.top = '50%';
    }

    /* Animation opacity, right and position */
    overlayUreter.style.opacity = 1;
    overlayUreter.style.right = 0;
    overlayUreter.style.transition = 'opacity 1s, right 1s';

    /* Put back the video source */
    document.getElementById("ureterVideo").src = "https://www.youtube.com/embed/-yfuSrt-0Uk?enablejsapi=1";
}

/*
    Hide the info box 
    Parameter:  null 
*/
/*function hide() {
    var overlayAllTheTime = document.getElementById("overlayAllTheTime");
    var overlayButton = document.getElementById("overlayButton");

    /* Hide the introduction page */
    /*if (overlayAllTheTime.style.display === "none") {
        overlayAllTheTime.style.display = "block";
        overlayButton.style.display = "none";
    } else {
        overlayAllTheTime.style.display = "none";
        overlayButton.style.display = "block";
    }
}*/

/* Texture for the ureter */
function ctx_texture() {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = 64;
    ctx.canvas.height = 64;

    ctx.fillStyle = params.waterColor
    ctx.fillRect(0, 0, 64, 64);

    ctx.translate(8, 8);
    ctx.rotate(Math.PI * .5);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "64px sans-serif";
    ctx.fillText("•", 0, 0);

    texture = new THREE.CanvasTexture(ctx.canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 1;
    texture.repeat.y = 1;
    return texture;
}

if (window.ARController && ARController.getUserMediaThreeScene) {
    ARThreeOnLoad();
}