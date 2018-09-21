/*  
    File Name: findObjEvt.js

    This function is use to find the intersection of the AR object.
    For objType == 0, is Single object
    For objType == 1, is multi-object (E.G. object file)
*/

export function findObjEvt(event, camera, objects, objType) {

    event.preventDefault();

    var style = getComputedStyle(event.target);
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

    var vec = new THREE.Vector3(event.layerX, event.layerY, 0);
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

    if (objType == 0) {
        var intersects = raycaster.intersectObject(objects);
    } else if (objType == 1) {
        var intersects = raycaster.intersectObjects(objects.children, true);
        /*for (var i = 0; i < intersects.length; i++) {
            //console.log(intersects[i]);
            //intersects[i].object.material.color.set(Math.random() * 0xffffff);
        }*/
    }

    if (intersects.length > 0) {
        var obj = intersects
        return obj;
    }
};