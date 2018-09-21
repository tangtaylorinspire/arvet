# arJS with a-frame Guide
## Basic HTML / JS
## Including the Libraries

```html
<script src="https://aframe.io/releases/0.8.0/aframe.min.js"></script>
<script src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.6.0/aframe/build/aframe-ar.js"></script>
```

## Ten lines code example provide by [Alexandra Etienne](https://medium.com/arjs/augmented-reality-in-10-lines-of-html-4e193ea9fdbf)

```html
<!doctype HTML>
<html>
<script src="https://aframe.io/releases/0.8.0/aframe.min.js"></script>
<script src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.6.0/aframe/build/aframe-ar.js"></script>
  <body style='margin : 0px; overflow: hidden;'>
    <a-scene embedded arjs>
  	<a-marker preset="hiro">
            <a-box position='0 0.5 0' material='color: black;'></a-box>
  	</a-marker>
  	<a-entity camera></a-entity>
    </a-scene>
  </body>
</html>
```

## A-scene setting
A-scene allow user select diffence AR backend such as arjs or tengo
### For AR.JS backend
```html
<a-scene embedded stats arjs='trackingMethod: best; debugUIEnabled: false; sourceType: webcam'>
  ...
</a-scene>
```
#### Basic Attribute
Attribute | Option | Usage
--------- | ------ | -------------
stats | - | Show the performance of the current scene
trackingMethod | best | -
debugUIEnabled | Boolean | Show the debug tool on the scene
sourceType | webcam | Select the type of the scene

## Including the Marker example

### Build-in 'hiro' / 'kanji' Marker

```html
<a-marker-camera preset='hiro'>
  <!-- the object or 3D model after recongzine the QR-Marker-->
  <a-box position='0 0.5 0' material='color: black;'></a-box>
</a-marker-camera>
```
```html
<a-marker-camera preset='kanji'>
  <!-- the object or 3D model after recongzine the QR-Marker-->
  <a-box position='0 0.5 0' material='color: black;'></a-box>
</a-marker-camera>
```

### Custom Marker
#### Image marker
```html
<a-marker preset='custom' type='pattern' url='your-marker.patt'>
  <!-- the object or 3D model after recongzine the QR-Marker-->
  <a-box position='0 0.5 0' material='color: black;'></a-box>
</a-marker-camera>
```
[Online marker generate tool](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html)

#### Barcode Marker
##### Edit the Scene Config before use the Barcode Marker
```html
<a-scene arjs='detectionMode: mono_and_matrix; matrixCodeType: 3x3;'></a-scene>
```
##### Example of include the barcode marker
```html
<a-marker type='barcode' value='5'></a-marker>
```

## Including the 3D object
### Include the 3D box
```html
<a-box position='0 0.5 0' material='color: black;'></a-box>
```
[Attributes](https://aframe.io/docs/0.8.0/primitives/a-box.html)
### Include the Text
```html
<a-text value="Hello, World!"></a-text>
```
[Attributes](https://aframe.io/docs/0.8.0/primitives/a-text.html#attributes)
### Include glb/gltf model
#### Include as assets
The example of including the Boeing 747-800 3D aircraft model with .glb extension which provide by [Flightradar24 3D models](https://github.com/kalmykov/fr24-3d-models). There are different aircraft model with glb or gltf extension as well.
```html
<a-assets>
  <a-asset-item id="model" src="https://raw.githubusercontent.com/kalmykov/fr24-3d-models/master/models/b748.glb" crossOrigin="anonymous">
  </a-asset-item>
</a-assets>
<a-gltf-model scale="1 1 1" src="#model"></a-gltf-model>
```
#### Include inline
```html
<a-gltf-model src="https://raw.githubusercontent.com/kalmykov/fr24-3d-models/master/models/b748.glb"></a-gltf-model>
```

## Animating the 3D model
```html
<a-gltf-model scale=".05 .05 .05" src="#model">
  <a-animation attribute="position" from="0 0 10" to="0 0 -10" direction="normal" dur="3000" repeat="indefinite"></a-animation>
</a-gltf-model>
```
### Basic Attribute

Attribute | Option | Usage
--------- | ------ | -------------
attribute | 'Position' / 'rotation' / 'visible' / 'intensity' | How to animate the model
from | [float float float] | Inital position of the 3D object
to | [float float float] | Final position of the 3D object
direction | "alternate", "alternateReverse", "normal", "reverse" | How the 3D object move
dur | int | Duration in (milliseconds) of the animation
repeat | int / "indefinite" | Repeat count of the object or repeat the animation indefinity

[Attributes](https://aframe.io/docs/0.8.0/core/animations.html)

## Cursor (Can actviate at VR mode only)
Can shown the cursor on the center of the screen, so that user can use "aframe-event-set-component" to click or trigger the object.
```html
<a-cursor fuse="true" color="yellow"></a-cursor>
```
### Basic Attribute

Attribute | Option | Usage
--------- | ------ | -------------
color | Name of the Color (e.g. 'yellow') / Hex color code| Color of the cursor
fuse | Boolean | How to trigger the object

[Attributes](https://aframe.io/docs/0.8.0/primitives/a-cursor.htm)

## Webpack (Base on React Building) 
### Include the Libraries in the entry point (i.e. index.html)
```html
<script src="https://aframe.io/releases/0.8.0/aframe.min.js"></script>
<script src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.6.0/aframe/build/aframe-ar.js"></script>
```
### Install aframe-react
```
npm install --save-dev aframe-react
```
Also install aframe-particle-system-component and aframe-environment-component
```
npm install --save-dev aframe-particle-system-component aframe-environment-component
```
### Include it in app.js header
```javascript
import { Scene, Entity } from 'aframe-react';
```
## Render the aframe scene, entity and model or asset or marker
The symbol is same as html basically
```html
<Scene artoolkit={{ debugUIEnabled: false, sourceType: 'webcam', trackingMethod: 'best' }}>
  <a-assets>
    <a-asset-item id="model" src="https://raw.githubusercontent.com/kalmykov/fr24-3d-models/master/models/b748.glb" crossOrigin="anonymous">
    </a-asset-item>
  </a-assets>
  <a-gltf-model scale="1 1 1" src="#model"></a-gltf-model>
  <a-marker-camera preset='hiro'>
    <a-box position='0 0.5 0' material='color: black;' event-set__click="material.color: red; scale: 2 2 2"></a-box>
    <a-gltf-model scale="1 1 1" src="#model"></a-gltf-model>
  </a-marker-camera>
  <Entity camera></Entity>
</Scene>
```
