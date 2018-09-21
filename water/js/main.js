let renderer, camera, scene, clock;
let control, water;

let params = {
	color: '#d7f5ff',
	scale: 4,
	flowX: 1,
	flowY: 1
};

init();

function init() {
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	document.body.appendChild( renderer.domElement );
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xdddddd );
	
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000);
	camera.position.set( 20,0,20);
	camera.lookAt( scene.position );
	
	control = new THREE.OrbitControls( camera, renderer.domElement );
	
	clock = new THREE.Clock();
	
	var waterGeometry = new THREE.CylinderBufferGeometry( 10, 10, 25, 32);
	
	water = new THREE.Water( waterGeometry, {
		color: params.color,
		scale: params.scale,
		flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
		textureWidth: 1024,
		textureWidth: 1024
	} );
	
	scene.add( water );
	
	var ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 );
	scene.add( ambientLight );
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
	directionalLight.position.set( 100, 100, 100 );
	scene.add( directionalLight );
	
	const ctx = document.createElement("canvas").getContext("2d");
	ctx.canvas.width = 64;
	ctx.canvas.height = 64;

	ctx.translate(32, 32);
	ctx.rotate(Math.PI * .5);
	ctx.fillStyle = "rgb(0,255,255)";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "48px sans-serif";
	ctx.fillText("➡︎", 0, 0);

	const texture = new THREE.CanvasTexture(ctx.canvas);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.x = 1;
	texture.repeat.y = 5;
	
	const stripGeo = new THREE.PlaneBufferGeometry(10 * 1.7, 25);
	const stripMat = new THREE.MeshBasicMaterial({
   		map: texture,
   		opacity: 0.5,
   		side: THREE.DoubleSide,
   		depthWrite: false,
   		depthTest: false,
   		transparent: true,
	});
	
	const stripMesh = new THREE.Mesh(stripGeo, stripMat);
	scene.add(stripMesh);
	
	window.addEventListener( 'resize', onWindowResize, false);
	
	animate();
	
	function animate() {
	
		var delta = clock.getDelta();
	
		requestAnimationFrame( animate );
	
		texture.offset.y += delta;
	
		renderer.render( scene, camera );
	
	}
	
}

function onWindowResize() {
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
}

