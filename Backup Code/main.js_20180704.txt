import { findObjEvt } from './findObjEvt';

/*function getStream() {
	if (window.stream) {
		window.stream.getTracks().forEach(function (track) {
			track.stop();
		});
	}

	var constraints = {
		audio: {
			deviceId: { exact: audioSelect.value }
		},
		video: {
			deviceId: { exact: videoSelect.value }
		}
	};

	navigator.mediaDevices.getUserMedia(constraints).
		then(gotStream).catch(handleError);
}*/

function cameraSuccess(videoParams) {
    ARController.getUserMediaThreeScene({
        maxARVideoSize: 640,
        /*width: { max: 640 },
        height: { max: 480 },*/
        cameraParam: 'Data/camera_para-iPhone 6 Plus rear 1280x720 1.0m.dat',
        deviceId: videoParams.deviceId,
        facing: 'environment',
        onSuccess: createAR
    })
}

function createAR(arScene, arController, arCameraParam) {
    //console.log(arController.getCameraMatrix());
    //arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);
    arController.setPatternDetectionMode(artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX);
    console.log(arScene);
    console.log(arController);
    console.log(arCameraParam);

    // Create a couple of lights for our AR scene.
    /*var light = new THREE.PointLight(0xffffff);
    light.position.set(40, 40, 40);
    arScene.scene.add(light);*/

    //var light = new THREE.PointLight(0xff8800);
    var light = new THREE.PointLight(0xffffff);
    //light.position.set(-40, -20, -30);
    arScene.scene.add(light);

    //var box = createBox();
    //var sphere = createShpere();
    //var sphere2 = createShpere();
    //var plane = createPlane("I'm a sphere", 1, 1, 1000, 750, 300);
    //var box = createBox();
    //var plane2 = createPlane("I'm a box", -600, 1, 1000, 750, 300);
    //var duck = createDuck();
    //var aeroplane = createAeroplane();
    //plane2.visible = false;

    //sphere2.position.z = 3;

	/*var overlay = document.getElementById('overlay');
	overlay.onclick = function () {
		document.getElementById("overlay").style.display = "none";
		//document.getElementById("overlay").classList.add("active");
	}*/

	/*window.addEventListener('resize', function () {
		renderer.setSize(window.innerWidth, window.innerHeight);
	});*/


    //var markerRoot = arController.createThreeBarcodeMarker(5);
    //markerRoot.add(box.box);
    //markerRoot.add(sphere);
    //markerRoot.add(box);
    //markerRoot.add(sphere2);
    //markerRoot.add(plane);
    //markerRoot.add(plane2);
    //markerRoot.add(duck);

    //arScene.scene.add(markerRoot);

    //markerRoot.add(aeroplane);

    //arScene.scene.add(aeroplane);

    //scene = new THREE.Scene();

    var kidney = new THREE.Scene();
    //var duck = new THREE.Object3D();

    //var model_url = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Duck/glTF-Embedded/Duck.gltf';
    //var model_url = './model/male02.obj';
    var model_url = './model/1kidney_VLP.OBJ';
    //var model_url = './model/all3KidneySamples.obj';
    //var model_url = 'https://groups.csail.mit.edu/graphics/classes/6.837/F03/models/teapot.obj'

    // Callback the progress
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
        // Wait Until the OBJ model load
        document.getElementById("plainBg").style.opacity = 0;
        document.getElementById("plainBg").style.visibility = "hidden";
        document.getElementById("plainBg").style.transition = 'opacity 1s, visibility 1s';
        document.getElementById("overlayReload").style.right = '5%';
        document.getElementById("overlayReload").style.transition = 'right 3s';
        if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
            document.getElementById("overlayDetect").style.display = "none";
            //document.getElementById("overlayIntro-phone").style.display = "block";
        }
    };

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
            document.getElementById("loading").innerHTML = Math.round(percentComplete, 1) + '%';
        }
    };

    var onError = function (xhr) { };

    // model
    //var loader = new THREE.GLTF2Loader();
    var loader = new THREE.OBJLoader2(manager);

	/*THREE.DRACOLoader.setDecoderPath('libs');
    loader.setDRACOLoader(new THREE.DRACOLoader());*/
    loader.load(model_url, function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                console.log(child);
            }
        });

        // Degree: (degree*Math.PI) / 180
        object.rotation.set((90 * Math.PI) / 180, (20 * Math.PI) / 180, 0);
        //if (arController.orientation === 'portrait') {
        if (window.innerHeight > window.innerWidth) {
            var scaleH = window.innerHeight / window.innerWidth;
            object.scale.set(0.03 * scaleH, 0.03, 0.03);
        } else {
            object.scale.set(0.03, 0.03, 0.03);
        }
        // Kidney Offical
        //object.scale.set(0.03, 0.03, 0.03);
        object.position.set(-2.5, 6, 0);
        kidney.add(object);
    }, onProgress, onError);

    document.body.className = arController.orientation;

    var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
    renderer.autoClear = true;
    renderer.setPixelRatio(window.devicePixelRatio);

    var f = Math.min(
        window.innerWidth / arScene.video.videoWidth,
        window.innerHeight / arScene.video.videoHeight
    );
    var ww = f * arScene.video.videoWidth;
    var hh = f * arScene.video.videoHeight;

    var w = window.innerWidth;
    var h = window.innerHeight;

    var type = window.screen.orientation.type;
    var firstPort = false;


    if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
        document.body.className += ' phone';
        //arScene.scene.rotation.z = (90 * Math.PI) / 180;
        //renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
        // Create a three.js camera.
        //var camera = new THREE.PerspectiveCamera(42, 1.333, 0.1, 100);
        //arScene.scene.add(camera);
        //resize(h, w, arScene, renderer);
        /*renderer.domElement.style.transformOrigin = '0 0';
        renderer.domElement.style.transform = 'rotate(-90deg) translateX(-100%)';*/
        //renderer.setSize(window.innerWidth*(arController.videoHeight/arController.videoWidth), window.innerHeight);
        //let matrix = arScene.camera.projectionMatrix;

        // If the device is in landscape mode, we scale the matrix to invert the aspect ratio.
        // I use 4 / 3 because my artoolkitSource is set to 640 x 480. 
        /*mat = mat.clone()
        const ratio = 4 / 3
        matrix.elements[0] *= ratio
        matrix.elements[5] *= 1 / ratio*/

        // Update the projection matrix of the camera
        //arScene.camera.projectionMatrix.copy(matrix)
        //arScene.scene.rotation.z = (90 * Math.PI) / 180;
        //arScene.scene.rotation.set(0, 0, Math.PI / 2, 0);
        //renderer.setSize(arController.videoWidth * (window.innerHeight / arController.videoHeight), arController.videoWidth);
        resize(h, w, arScene, renderer);
        //renderer.domElement.style.transformOrigin = '0 0';
        //renderer.domElement.style.transform = 'rotate(-90deg) translateX(-100%)';
        //resize(w, h, arScene, renderer);
    } else if (window.innerHeight > window.innerWidth || arController.orientation === 'portrait' || type === 'portrait-secondary' || type === 'portrait-primary') {
        document.getElementById("overlayDetect").style.display = "block";
        firstPort = true;
    } else {
        /*if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
            document.body.className += ' phone';
            renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
        } else {*/

        //var aspect = window.innerWidth / window.innerHeight;
        //camera.updateProjectionMatrix();

        //renderer.setSize(window.innerWidth, window.innerHeight);
        //var camera = new THREE.PerspectiveCamera(42, 1.333, 0.1, 100);
        //arScene.scene.add(camera);
        resize(w, h, arScene, renderer);
        //renderer.setSize(arController.videoWidth, arController.videoHeight);
        //renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
        document.body.className += ' desktop';
        //}
    }

    document.body.insertBefore(renderer.domElement, document.body.firstChild);

    window.addEventListener('resize', function () {
        if (window.innerHeight > window.innerWidth && !(/Android|mobile|iPad|iPhone/i.test(navigator.userAgent))) {
            document.getElementById("overlayDetect").style.display = "block";
        } else if (firstPort === true) {
            location.reload();
        } else if (firstPort === false) {
            var w = window.innerWidth;
            var h = window.innerHeight;
            //console.log("height: " + h + " ,wight: " + w)
            //console.log("Video: height: " + arScene.video.videoHeight + " ,wight: " + arScene.video.videoWidth)
            resize(w, h, arScene, renderer);
            document.getElementById("overlayDetect").style.display = "none";
        }
        //renderer.setSize(arController.videoWidth, arController.videoHeight);
        //renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
    })

    window.addEventListener('orientationchange', function () {
        console.log(window.screen.orientation.type);
        var type = window.screen.orientation.type;
        if (type === 'portrait-secondary' || type === 'portrait-primary') {
            document.getElementById("overlayDetect").style.display = "block";
        } else if (type === 'landscape-primary' || type === 'landscape-secondary') {
            document.getElementById("overlayDetect").style.display = "none";
        }
    })
    //markerRoot.add(duck);
    //arScene.scene.add(markerRoot);

    arController.loadMarker('Data/patt.bigpeeBoyWBlack', function (markerId) {
        var markerRoot = arController.createThreeMarker(markerId);
        //markerRoot.add(box);
        //markerRoot.add(plane2);
        markerRoot.add(kidney);
        arScene.scene.add(markerRoot);
    });

    //arScene.scene.add(markerRoot);

    var rotationV = 0;
    var rotationTarget = 0;

    renderer.domElement.addEventListener('click', function (ev) {
        var obj = findObjEvt(ev, arScene.camera, kidney, 1);
        if (obj) {
            var obj = findObjEvt(ev, arScene.camera, kidney, 1);
            for (var i = 0; i < obj.length; i++) {
                // Show the Kidney 
                if (obj[i].object.name === 'MainKidney') {
                    onKindney();
                }
            }
        }
    }, false);

    var tick = function () {
        arScene.process();
        //console.log(arScene);

        //box.box.tick();

        //rotationV += (rotationTarget - sphere.rotation.z) * 0.05;
        //sphere.rotation.z += rotationV;
        //torus.rotation.y += rotationV;
        //rotationV *= 0.8;
        // Render the scene.
        arScene.renderOn(renderer);
        requestAnimationFrame(tick);
    };

    tick();
}

function resize(w, h, arScene, renderer) {
    var scaleH = h / arScene.video.videoHeight;
    var scaleW = w / arScene.video.videoWidth;
    if (h >= w) {
        renderer.setSize(arScene.video.videoWidth * scaleH, h);
    } else if (w >= h) {
        if (scaleW * arScene.video.videoHeight < h) renderer.setSize(arScene.video.videoWidth * scaleH, h);
        else renderer.setSize(w, scaleW * arScene.video.videoHeight);
    }
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

function onKindney() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        // Take the user to a different screen here.
        document.getElementById("overlayKindney").style.width = '100%';
        document.getElementById("overlayKindney").style.height = '50%';
        document.getElementById("overlayKindney").style.top = '50%';
    }
    //document.querySelector('.overlay').classList.toggle('active');
    // Animation opacity
    document.getElementById("overlayKindney").style.opacity = 1;
    // Animation right
    document.getElementById("overlayKindney").style.right = 0;
    document.getElementById("overlayKindney").style.transition = 'opacity 1s, right 1s';
    // Animation position
    //document.getElementById('#overlay').toggleClass('show');
}

function hide() {
    var overlayAllTheTime = document.getElementById("overlayAllTheTime");
    var overlayButton = document.getElementById("overlayButton");
    if (overlayAllTheTime.style.display === "none") {
        overlayAllTheTime.style.display = "block";
        overlayButton.style.display = "none";
    } else {
        overlayAllTheTime.style.display = "none";
        overlayButton.style.display = "block";
    }
}

if (window.ARController && ARController.getUserMediaThreeScene) {

    ARThreeOnLoad();
}

/*window.ARThreeOnLoad = function () {

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

	ARController.getUserMediaThreeScene({
		//maxARVideoSize: 320, video: { facingMode: { exact: "environment" } },
		onSuccess: function (arScene, arController, arCamera) {

			arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);

			document.body.className = arController.orientation;

			var renderer = new THREE.WebGLRenderer({ antialias: true });
			if (arController.orientation === 'portrait') {
				var w = (window.innerWidth / arController.videoHeight) * arController.videoWidth;
				var h = window.innerWidth;
				renderer.setSize(w, h);
				renderer.domElement.style.paddingBottom = (w - h) + 'px';
			} else {
				if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
					renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
				} else {
					renderer.setSize(arController.videoWidth, arController.videoHeight);
					document.body.className += ' desktop';
				}
			}

			document.body.insertBefore(renderer.domElement, document.body.firstChild);


			// Create a couple of lights for our AR scene.
			var light = new THREE.PointLight(0xffffff);
			light.position.set(40, 40, 40);
			arScene.scene.add(light);

			var light = new THREE.PointLight(0xff8800);
			light.position.set(-40, -20, -30);
			arScene.scene.add(light);

			var box = createBox();
			var sphere = createShpere();

			renderer.domElement.addEventListener('click', function (ev) {
				if (findObjectUnderEvent(ev, arScene.camera, sphere)) {
					//box.box.open = !box.box.open;
					ev.preventDefault();
					rotationTarget += 1;
				}
			}, false);

			var markerRoot = arController.createThreeBarcodeMarker(5);
			//markerRoot.add(box.box);
			markerRoot.add(sphere);
			arScene.scene.add(markerRoot);

			var rotationV = 0;
			var rotationTarget = 0;

			var tick = function () {
				arScene.process();

				//box.box.tick();

				rotationV += (rotationTarget - sphere.rotation.z) * 0.05;
				sphere.rotation.z += rotationV;
				//torus.rotation.y += rotationV;
				rotationV *= 0.8;

				arScene.renderOn(renderer);
				requestAnimationFrame(tick);
			};

			tick();
		}
	});

	delete window.ARThreeOnLoad;

};*/