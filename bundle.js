!function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.findObjEvt=function(e,t,n,i){e.preventDefault();var o=getComputedStyle(e.target),r=o.getPropertyValue("transform"),a=o.getPropertyValue("transform-origin").replace(/px/g,"").split(" ");a[0]=parseFloat(a[0]),a[1]=parseFloat(a[1]),a[2]=parseFloat(a[2]||0);var d=new THREE.Matrix4;if(d.identity(),/^matrix\(/.test(r)){var l=r.replace(/^matrix\(|\)$/g,"").split(" ");d.elements[0]=parseFloat(l[0]),d.elements[1]=parseFloat(l[1]),d.elements[4]=parseFloat(l[2]),d.elements[5]=parseFloat(l[3]),d.elements[12]=parseFloat(l[4]),d.elements[13]=parseFloat(l[5])}else if(/^matrix3d\(/i.test(r))for(var l=r.replace(/^matrix3d\(|\)$/gi,"").split(" "),s=0;s<16;s++)d.elements[s]=parseFloat(l[s]);var c=new THREE.Matrix4;c.makeTranslation(a[0],a[1],a[2]),c.multiply(d),d.makeTranslation(-a[0],-a[1],-a[2]),c.multiply(d);var y=new THREE.Vector3(e.layerX,e.layerY,0);y.applyMatrix4(c);var p=parseFloat(o.getPropertyValue("width")),u=parseFloat(o.getPropertyValue("height")),v=new THREE.Vector3(y.x/p*2-1,-y.y/u*2+1,.5);v.unproject(t),v.sub(t.position),v.normalize();var m=new THREE.Raycaster(t.position,v);if(0==i){var g=m.intersectObject(n);console.log(n)}else if(1==i){var g=m.intersectObjects(n.children,!0);console.log(n)}if(g.length>0){var h=g;return h}}},function(e,t,n){"use strict";var i=n(0);function o(e,t,n){t.setPatternDetectionMode(artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX);var o=new THREE.PointLight(16777215);e.scene.add(o);var a=new THREE.Scene;(new THREE.OBJLoader2).load("./model/1kidney_VLP.OBJ",function(e){e.rotation.set(90*Math.PI/180,20*Math.PI/180,0),e.scale.set(.03,.03,.03),e.position.set(-2.5,6,0),a.add(e),console.log("Load ready"),!0,document.getElementById("plainBg").style.opacity=0,document.getElementById("plainBg").style.visibility="hidden",document.getElementById("plainBg").style.transition="opacity 1s, visibility 1s"}),document.body.className=t.orientation;var d=new THREE.WebGLRenderer({antialias:!1,alpha:!0,powerPreference:"low-power"});d.autoClear=!0;var l=Math.min(window.innerWidth/e.video.videoWidth,window.innerHeight/e.video.videoHeight),s=(e.video.videoWidth,e.video.videoHeight,window.innerWidth),c=window.innerHeight,y=window.screen.orientation.type,p=!1;window.innerHeight>window.innerWidth||"portrait"===t.orientation||"portrait-secondary"===y||"portrait-primary"===y?(document.getElementById("overlayDetect").style.display="block",p=!0):/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)?d.setSize(window.innerWidth,window.innerWidth/t.videoWidth*t.videoHeight):(r(s,c,e,d),document.body.className+=" desktop"),document.body.insertBefore(d.domElement,document.body.firstChild),window.addEventListener("resize",function(){if(window.innerHeight>window.innerWidth)document.getElementById("overlayDetect").style.display="block";else if(!0===p)location.reload();else if(!1===p){r(window.innerWidth,window.innerHeight,e,d),document.getElementById("overlayDetect").style.display="none"}}),window.addEventListener("orientationchange",function(){console.log(window.screen.orientation.type);var e=window.screen.orientation.type;"portrait-secondary"===e||"portrait-primary"===e?(document.getElementById("overlayDetect").style.display="block",console.log("hihihi")):"landscape-primary"!==e&&"landscape-secondary"!==e||(document.getElementById("overlayDetect").style.display="none")}),t.loadMarker("Data/patt.bigpeeBoyWBlack",function(n){var i=t.createThreeMarker(n);i.add(a),e.scene.add(i)});d.domElement.addEventListener("click",function(t){(0,i.findObjEvt)(t,e.camera,a,1)&&function(){/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)&&(document.getElementById("overlay").style.width="100%");document.getElementById("overlay").style.opacity=1,document.getElementById("overlay").style.right=0,document.getElementById("overlay").style.transition="opacity 1s, right 1s"}()},!1);!function t(){e.process(),e.renderOn(d),requestAnimationFrame(t)}()}function r(e,t,n,i){var o=t/n.video.videoHeight,r=e/n.video.videoWidth;t>=e?i.setSize(n.video.videoWidth*o,t):e>=t&&(r*n.video.videoHeight<t?i.setSize(n.video.videoWidth*o,t):i.setSize(e,r*n.video.videoHeight))}window.ARThreeOnLoad=function(){navigator.mediaDevices.enumerateDevices().then(function(e){var t=e.find(function(e){return-1!==e.label.indexOf("back")});!function(e){ARController.getUserMediaThreeScene({maxARVideoSize:640,cameraParam:"Data/camera_para-iPhone 6 Plus rear 1280x720 1.0m.dat",deviceId:e.deviceId,facing:"environment",onSuccess:o})}({deviceId:t?{exact:t.deviceId}:void 0})}).catch(function(e){alert(e.name+": "+e.message)})},window.ARController&&ARController.getUserMediaThreeScene&&ARThreeOnLoad()}]);