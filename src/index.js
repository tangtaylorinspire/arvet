var findObjectUnderEvent = function (ev, camera, objects) {

	var style = getComputedStyle(ev.target);
	var elementTransform = style.getPropertyValue('transform');
	var elementTransformOrigin = style.getPropertyValue('transform-origin');

	var xyz = elementTransformOrigin.replace(/px/g, '').split(" ");
	xyz[0] = parseFloat(xyz[0]);
	xyz[1] = parseFloat(xyz[1]);
	xyz[2] = parseFloat(xyz[2] || 0);

	var mat = new THREE.Matrix4();
	mat.identity();
	if (/^matrix\(/.test(elementTransform)) {
		var elems = elementTransform.replace(/^matrix\(|\)$/g, '').split(' ');
		mat.elements[0] = parseFloat(elems[0]);
		mat.elements[1] = parseFloat(elems[1]);
		mat.elements[4] = parseFloat(elems[2]);
		mat.elements[5] = parseFloat(elems[3]);
		mat.elements[12] = parseFloat(elems[4]);
		mat.elements[13] = parseFloat(elems[5]);
	} else if (/^matrix3d\(/i.test(elementTransform)) {
		var elems = elementTransform.replace(/^matrix3d\(|\)$/ig, '').split(' ');
		for (var i = 0; i < 16; i++) {
			mat.elements[i] = parseFloat(elems[i]);
		}
	}

	var mat2 = new THREE.Matrix4();
	mat2.makeTranslation(xyz[0], xyz[1], xyz[2]);
	mat2.multiply(mat);
	mat.makeTranslation(-xyz[0], -xyz[1], -xyz[2]);
	mat2.multiply(mat);

	var vec = new THREE.Vector3(ev.layerX, ev.layerY, 0);
	vec.applyMatrix4(mat2);

	var width = parseFloat(style.getPropertyValue('width'));
	var height = parseFloat(style.getPropertyValue('height'));

	var mouse3D = new THREE.Vector3(
		(vec.x / width) * 2 - 1,
		-(vec.y / height) * 2 + 1,
		0.5
	);
	mouse3D.unproject(camera);
	mouse3D.sub(camera.position);
	mouse3D.normalize();

	var raycaster = new THREE.Raycaster(camera.position, mouse3D);

	/* For Multi object please use intersectObjects(objects)*/

	//var intersects = raycaster.intersectObjects(objects.children, true);
	var intersects = raycaster.intersectObject(objects);
	if (intersects.length > 0) {
		//var obj = intersects[0].object
		var obj = intersects
		return obj;
	}
};

var findObjectUnderEvent2 = function (ev, camera, objects) {

	/*var style = getComputedStyle(ev.target);
	var elementTransform = style.getPropertyValue('transform');
	var elementTransformOrigin = style.getPropertyValue('transform-origin');

	var xyz = elementTransformOrigin.replace(/px/g, '').split(" ");
	xyz[0] = parseFloat(xyz[0]);
	xyz[1] = parseFloat(xyz[1]);
	xyz[2] = parseFloat(xyz[2] || 0);

	var mat = new THREE.Matrix4();
	mat.identity();
	if (/^matrix\(/.test(elementTransform)) {
		var elems = elementTransform.replace(/^matrix\(|\)$/g, '').split(' ');
		mat.elements[0] = parseFloat(elems[0]);
		mat.elements[1] = parseFloat(elems[1]);
		mat.elements[4] = parseFloat(elems[2]);
		mat.elements[5] = parseFloat(elems[3]);
		mat.elements[12] = parseFloat(elems[4]);
		mat.elements[13] = parseFloat(elems[5]);
	} else if (/^matrix3d\(/i.test(elementTransform)) {
		var elems = elementTransform.replace(/^matrix3d\(|\)$/ig, '').split(' ');
		for (var i = 0; i < 16; i++) {
			mat.elements[i] = parseFloat(elems[i]);
		}
	}

	var mat2 = new THREE.Matrix4();
	mat2.makeTranslation(xyz[0], xyz[1], xyz[2]);
	mat2.multiply(mat);
	mat.makeTranslation(-xyz[0], -xyz[1], -xyz[2]);
	mat2.multiply(mat);

	var vec = new THREE.Vector3(ev.layerX, ev.layerY, 0);
	vec.applyMatrix4(mat2);

	var width = parseFloat(style.getPropertyValue('width'));
	var height = parseFloat(style.getPropertyValue('height'));

	var mouse3D = new THREE.Vector3(
		(vec.x / width) * 2 - 1,
		-(vec.y / height) * 2 + 1,
		0.5
	);
	mouse3D.unproject(camera);
	mouse3D.sub(camera.position);
	mouse3D.normalize();

	//console.log(objects.children["0"].children["0"].children["0"]);
	var raycaster = new THREE.Raycaster(camera.position, mouse3D);*/


	var vec = new THREE.Vector3(ev.layerX, ev.layerY, 0);

	var mouse3D = new THREE.Vector3();
	var style = getComputedStyle(ev.target);
	var width = parseFloat(style.getPropertyValue('width'));
	var height = parseFloat(style.getPropertyValue('height'));

	var mouse3D = new THREE.Vector3(
		(vec.x / width) * 2 - 1,
		-(vec.y / height) * 2 + 1,
		0.5
	);

	ev.preventDefault();

	mouse3D.unproject(camera);
	mouse3D.sub(camera.position);
	mouse3D.normalize();

	var raycaster = new THREE.Raycaster(camera.position, mouse3D);

	//projector.unprojectVector(mouse3D, camera);
	//raycaster.setFromCamera(mouse3D, camera);

	//var intersects = raycaster.intersectObjects(scene.children);

	/* For Multi object please use intersectObjects(objects)*/
	var intersects = raycaster.intersectObjects(objects.children, false);

	//var intersects = raycaster.intersectObject(objects);
	if (intersects.length > 0) {
		//var obj = intersects[0].object
		var obj = intersects;
		console.log(objects);
		return obj;
	}
};

var createBox = function () {
	// The AR scene.
	//
	// The box object is going to be placed on top of the marker in the video.
	// I'm adding it to the markerRoot object and when the markerRoot moves,
	// the box and its children move with it.
	//
	var box = new THREE.Object3D();
	var boxWall = new THREE.Mesh(
		new THREE.BoxGeometry(1, 1, 0.1, 1, 1, 1),
		new THREE.MeshLambertMaterial({ color: 0xffffff })
	);
	boxWall.position.z = -0.5;
	box.add(boxWall);

	boxWall = boxWall.clone();
	boxWall.position.z = +0.5;
	box.add(boxWall);

	boxWall = boxWall.clone();
	boxWall.position.z = 0;
	boxWall.position.x = -0.5;
	boxWall.rotation.y = Math.PI / 2;
	box.add(boxWall);

	boxWall = boxWall.clone();
	boxWall.position.x = +0.5;
	box.add(boxWall);

	boxWall = boxWall.clone();
	boxWall.position.x = 0;
	boxWall.position.y = -0.5;
	boxWall.rotation.y = 0;
	boxWall.rotation.x = Math.PI / 2;
	box.add(boxWall);

	// Keep track of the box walls to test if the mouse clicks happen on top of them.
	var walls = box.children.slice();

	// Create a pivot for the lid of the box to make it rotate around its "hinge".
	var pivot = new THREE.Object3D();
	pivot.position.y = 0.5;
	pivot.position.x = 0.5;

	// The lid of the box is attached to the pivot and the pivot is attached to the box.
	boxWall = boxWall.clone();
	boxWall.position.y = 0;
	boxWall.position.x = -0.5;
	pivot.add(boxWall);
	box.add(pivot);

	walls.push(boxWall);

	box.position.z = 0.5;
	box.rotation.x = Math.PI / 2;

	box.open = false;

	box.tick = function () {
		// Animate the box lid to open rotation or closed rotation, depending on the value of the open variable.
		pivot.rotation.z += ((box.open ? -Math.PI / 1.5 : 0) - pivot.rotation.z) * 0.1;
	};

	return { box: box, walls: walls };
};

var createShpere = function () {
	var sphere = new THREE.Mesh(
		new THREE.SphereGeometry(0.5, 8, 8),
		new THREE.MeshNormalMaterial()
	);
	sphere.material.shading = THREE.FlatShading;
	sphere.position.z = 0.5;

	return sphere;
}

var createBox = function () {
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshNormalMaterial()
	var cube = new THREE.Mesh(geometry, material);
	cube.position.z = 0.5;
	cube.position.x = 1.5;
	return cube;
}

var createPlane = function (text, x, y, z, width, height) {

	radius = 50;

	// Rounded rectangle
	var plane = new THREE.Object3D();
	var roundedRectShape = new THREE.Shape();
	roundedRectShape.moveTo(x, y + radius);
	roundedRectShape.lineTo(x, y + height - radius);
	roundedRectShape.quadraticCurveTo(x, y + height, x + radius, y + height);
	roundedRectShape.lineTo(x + width - radius, y + height);
	roundedRectShape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
	roundedRectShape.lineTo(x + width, y + radius);
	roundedRectShape.quadraticCurveTo(x + width, y, x + width - radius, y);
	roundedRectShape.lineTo(x + radius, y);
	roundedRectShape.quadraticCurveTo(x, y, x, y + radius);

	var geometry = new THREE.ShapeGeometry(roundedRectShape);
	var material = new THREE.MeshBasicMaterial({ color: 0x3399ff });
	var mesh = new THREE.Mesh(geometry, material);

	//mesh.scale.set(0.02, 0.02, 0.02);
	mesh.rotation.set(Math.PI / 2, -Math.PI / 2000, Math.PI);
	mesh.position.z = z;
	mesh.position.x = -x;
	mesh.position.y = 0;

	var loader = new THREE.FontLoader();

	loader.load('Data/helvetiker_regular.typeface.json',
		function (font) {
			var textGeo = new THREE.TextGeometry(text, {
				font: font,
				size: 80,
				height: 5,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 10,
				bevelSize: 8,
				bevelSegments: 5

			});

			var textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

			var mesh = new THREE.Mesh(textGeo, textMaterial);
			//mesh.scale.set(0.0009, 0.0009, 0.0009);
			mesh.rotation.set(-Math.PI / 2, -Math.PI / 2000, Math.PI);
			//mesh.rotation.set(Math.PI, -Math.PI, Math.PI);
			mesh.position.z = z - 200;
			if (x >= 0) {
				mesh.position.x = -x - 100;
			} else {
				mesh.position.x = -x + 500;
			}
			plane.add(mesh);
		});
	plane.add(mesh);

	plane.scale.set(0.0019, 0.0019, 0.0019);

	return plane;
}

var createDuck = function () {
	var duck = new THREE.Object3D();

	// model
	var loader = new THREE.GLTF2Loader();
	/*THREE.DRACOLoader.setDecoderPath('libs');
	loader.setDRACOLoader(new THREE.DRACOLoader());*/
	loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Duck/glTF-Embedded/Duck.gltf', function (gltf) {
		/*gltf.scene.traverse(function (child) {
			if (child.isMesh) {
				child.material.envMap = envMap;
			}
		});*/
		var duck2 = gltf.scene;
		duck2.rotation.set(-Math.PI / 2, -Math.PI / 2000, Math.PI);
		//duck.add(gltf.asset);
	});
	return duck;
}

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
		//maxARVideoSize: 640,
		width: { min: 1024, ideal: 1280, max: 1920 },
		height: { min: 576, ideal: 720, max: 1080 },
		cameraParam: 'Data/camera_para-iPhone 6 Plus rear 1280x720 1.0m.dat',
		deviceId: videoParams.deviceId,
		onSuccess: createAR
	})
}

function createAR(arScene, arController, arCameraParam) {
	//arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);

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

			var aspect = window.innerWidth / window.innerHeight;
			/*camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth, window.innerHeight);*/
			renderer.setSize(window.innerWidth, window.innerHeight);
			//renderer.setSize(arController.videoWidth, arController.videoHeight);
			//renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
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
	var sphere2 = createShpere();
	//var plane = createPlane("I'm a sphere", 1, 1, 1000, 750, 300);
	var box = createBox();
	var plane2 = createPlane("I'm a box", -600, 1, 1000, 750, 300);
	var duck = createDuck();
	//var aeroplane = createAeroplane();
	plane2.visible = false;

	sphere2.position.z = 3;

	renderer.domElement.addEventListener('click', function (ev) {
		if (findObjectUnderEvent(ev, arScene.camera, sphere)) {
			//box.box.open = !box.box.open;
			ev.preventDefault();
			rotationTarget += 1;
			plane.visible = !plane.visible;
		}
		if (findObjectUnderEvent(ev, arScene.camera, box)) {
			//box.box.open = !box.box.open;
			//ev.preventDefault();
			//rotationTarget += 1;
			//sphere2.position.z += 0.1;
			plane2.visible = !plane2.visible;
		}
		if (findObjectUnderEvent2(ev, arScene.camera, duck)) {
			//box.box.open = !box.box.open;
			//ev.preventDefault();
			//rotationTarget += 1;
			//sphere2.position.z += 0.1;
			//plane2.visible = !plane2.visible;
			console.log(duck);
			on();
			//window.open("https://www.google.com", "_self");
		}
	}, false);

	/*var overlay = document.getElementById('overlay');
	overlay.onclick = function () {
		document.getElementById("overlay").style.display = "none";
		//document.getElementById("overlay").classList.add("active");
	}*/

	/*window.addEventListener('resize', function () {
		renderer.setSize(window.innerWidth, window.innerHeight);
	});*/

	/*arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);

	var markerRoot = arController.createThreeBarcodeMarker(5);
	//markerRoot.add(box.box);
	//markerRoot.add(sphere);
	markerRoot.add(box);
	//markerRoot.add(sphere2);
	//markerRoot.add(plane);
	markerRoot.add(plane2);
	markerRoot.add(duck);

	arScene.scene.add(markerRoot);*/

	//markerRoot.add(aeroplane);

	//arScene.scene.add(aeroplane);

	//scene = new THREE.Scene();

	//var duck = new THREE.Scene();
	var duck = new THREE.Object3D();

	// model
	var loader = new THREE.GLTF2Loader();
	/*THREE.DRACOLoader.setDecoderPath('libs');
	loader.setDRACOLoader(new THREE.DRACOLoader());*/
	loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Duck/glTF-Embedded/Duck.gltf', function (gltf) {
		/*gltf.scene.traverse(function (child) {
			if (child.isMesh) {
				child.material.envMap = envMap;
			}
		});*/
		var duck2 = gltf.scene;
		duck2.rotation.set(-Math.PI / 2, -Math.PI / 2000, Math.PI);
		duck.add(duck2);
	});

	arController.loadMarker('Data/peeBoy.patt', function (markerId) {
		var markerRoot = arController.createThreeMarker(markerId);
		markerRoot.add(box);
		markerRoot.add(plane2);
		arScene.scene.add(markerRoot);
	});

	markerRoot.add(duck);
	arScene.scene.add(markerRoot);

	//arScene.scene.add(markerRoot);

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

function on() {
	//document.querySelector('.overlay').classList.toggle('active');
	// Animation opacity
	document.getElementById("overlay").style.opacity = 1;
	// Animation right
	document.getElementById("overlay").style.right = 0;
	document.getElementById("overlay").style.transition = 'opacity 1s, right 1s';
	// Animation position
	//document.getElementById('#overlay').toggleClass('show');
}

function off() {
	document.getElementById("overlay").style.opacity = 0;
	document.getElementById("overlay").style.right = '-20%';
	document.getElementById("overlay").style.transition = 'opacity 1s, right 1s';
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

if (window.ARController && ARController.getUserMediaThreeScene) {
	ARThreeOnLoad();
}