var renderer, camera, scene, control;
var cellGroup;

export function start() {
    init();
    animate();
}

export function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    //document.body.appendChild(renderer.domElement);
    renderer.domElement.id = 'vessel'
    document.body.insertBefore(renderer.domElement, document.body.firstChild);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = - 50;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8B0000);

    var vesselGeometry = new THREE.CylinderBufferGeometry(10, 10, 40, 32);
    var vesselMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
    var vessel = new THREE.Mesh(vesselGeometry, vesselMaterial);
    scene.add(vessel);
    vessel.rotation.z = Math.PI / 2;

    cellGroup = new THREE.Group();

    for (var i = 0; i < 10; i++) {
        var cell = new THREE.Group();
        var cellGeometry = new THREE.TorusBufferGeometry(1, 1, 15, 30);
        var cellMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        var cellLineMaterial = new THREE.LineBasicMaterial({ color: 0xFF4C4C });
        var cellLine = new THREE.LineSegments(cellGeometry, cellLineMaterial);
        var cellShape = new THREE.Mesh(cellGeometry, cellMaterial);
        cellLine.position.set(Math.random() * 40 - 20, Math.random() * 7.5 - 3.75, Math.random() * 7.5 - 3.75);
        cellShape.position.set(cellLine.position.x, cellLine.position.y, cellLine.position.z);
        cellShape.rotation.x = cellLine.rotation.x = Math.PI / 2;
        cellShape.rotation.y = cellLine.rotation.y = Math.random() * Math.PI;
        cell.add(cellLine);
        cell.add(cellShape);
        cellGroup.add(cell);
    }

    scene.add(cellGroup);
    scene.add(new THREE.AmbientLight(0xffffff));

    control = new THREE.OrbitControls(camera);

    window.addEventListener('resize', onWindowResize, false);

}

export function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    for (var i = 0; i < 10; i++) {

        cellGroup.children[i].children[0].position.x += Math.random() * 0.05;
        cellGroup.children[i].children[1].position.x = cellGroup.children[i].children[0].position.x;
        cellGroup.children[i].children[0].rotation.x += Math.random() * 0.025;
        cellGroup.children[i].children[1].rotation.x = cellGroup.children[i].children[0].rotation.x;
        cellGroup.children[i].children[0].rotation.y += Math.random() * 0.025;
        cellGroup.children[i].children[1].rotation.y = cellGroup.children[i].children[0].rotation.y;
        if (cellGroup.children[i].children[0].position.x > 19) {
            cellGroup.children[i].children[0].position.x = - 19;
            cellGroup.children[i].children[1].position.x = - 19;
        }
    }

    renderer.render(scene, camera);
}