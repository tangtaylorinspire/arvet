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

    var radius = 50;

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

/*var createDuck = function () {
    var duck = new THREE.Object3D();

    // model
    var loader = new THREE.GLTF2Loader();
	THREE.DRACOLoader.setDecoderPath('libs');
	loader.setDRACOLoader(new THREE.DRACOLoader());
    loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Duck/glTF-Embedded/Duck.gltf', function (gltf) {
		gltf.scene.traverse(function (child) {
			if (child.isMesh) {
				child.material.envMap = envMap;
			}
		});
        var duck2 = gltf.scene;
        duck2.rotation.set(-Math.PI / 2, -Math.PI / 2000, Math.PI);
        //duck.add(gltf.asset);
    });
    return duck;
}*/