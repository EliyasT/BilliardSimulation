"use strict";

import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

// * Initialize webGL
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor("#ffffff"); // set background color
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Create a new Three.js scene with camera and Light
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  canvas.width / canvas.height,
  0.1,
  1000
);

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

camera.position.set(5, 5, 3);
camera.lookAt(scene.position);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

//Create a SpotLight and turn on shadows for the light
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.intensity = 30;
spotLight.castShadow = true;
spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 40;

//add floor
const fGeometry = new THREE.PlaneGeometry(10, 10);
const fMaterial = new THREE.MeshPhongMaterial({
  color: 0x808080,
  side: THREE.DoubleSide,
});
const floor = new THREE.Mesh(fGeometry, fMaterial);
floor.rotation.x = Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// addceiling
const ceiling = floor.clone();
ceiling.position.y = 6;
scene.add(ceiling);

//add Table
const tabletickness = 0.02;
const height = 1;
const length = 4;
const width = length / 2;
const tGeometry = new THREE.BoxGeometry(width, length, tabletickness);
const tMaterial = new THREE.MeshPhongMaterial({
  color: 0x4b7a22,
  side: THREE.DoubleSide,
});
const table = new THREE.Mesh(tGeometry, tMaterial);
table.rotation.x = Math.PI / 2;
table.position.y = height;
table.castShadow = true;
table.receiveShadow = true;
scene.add(table);

//add cushions
const depth = 0.2;
const thickness = 0.1;
const cGeometry = new THREE.BoxGeometry(width, depth, thickness);
const cMaterial = new THREE.MeshPhongMaterial({ color: 0x4b7a22 });
const cushion1 = new THREE.Mesh(cGeometry, cMaterial);
cushion1.position.z = -depth / 2;
cushion1.position.y = length / 2 - thickness / 2;
cushion1.rotation.x = Math.PI / 2;
cushion1.castShadow = true;
cushion1.receiveShadow = true;
table.add(cushion1);

const cushion2 = cushion1.clone();
cushion2.position.z = -depth / 2;
cushion2.position.y = -length / 2 + thickness / 2;
cushion2.castShadow = true;
cushion2.receiveShadow = true;
table.add(cushion2);

const c3Geometry = new THREE.BoxGeometry(thickness, length, depth);
const cushion3 = new THREE.Mesh(c3Geometry, cMaterial);
cushion3.position.z = -depth / 2;
cushion3.position.x = width / 2 - thickness / 2;
cushion3.castShadow = true;
cushion3.receiveShadow = true;
table.add(cushion3);

const cushion4 = cushion3.clone();
cushion4.position.z = -depth / 2;
cushion4.position.x = -width / 2 + thickness / 2;
cushion4.castShadow = true;
cushion4.receiveShadow = true;
table.add(cushion4);

//add legs
const dimension = 0.2;
const lGeometry = new THREE.BoxGeometry(dimension, dimension, height);
const lMaterial = new THREE.MeshPhongMaterial({ color: 0xa1662f });
const leg1 = new THREE.Mesh(lGeometry, lMaterial);
leg1.position.set(
  width / 2 - dimension / 2,
  length / 2 - dimension / 2,
  height / 2
);
leg1.castShadow = true;
table.add(leg1);

const leg2 = leg1.clone();
leg2.position.set(
  width / 2 - dimension / 2,
  -length / 2 + dimension / 2,
  height / 2
);
leg2.castShadow = true;
table.add(leg2);

const leg3 = leg1.clone();
leg3.position.set(
  -width / 2 + dimension / 2,
  -length / 2 + dimension / 2,
  height / 2
);
leg3.castShadow = true;
table.add(leg3);
const leg4 = leg1.clone();
leg4.position.set(
  -width / 2 + dimension / 2,
  length / 2 - dimension / 2,
  height / 2
);
leg4.castShadow = true;
table.add(leg4);

//Add chord
const chRadius = 0.01;
const chLength = 2;
const chGeometry = new THREE.CylinderGeometry(chRadius, chRadius, chLength, 32);
const chMaterial = new THREE.MeshPhongMaterial({ color: 0x00000 });
const chord = new THREE.Mesh(chGeometry, chMaterial);
chord.rotation.x = Math.PI / 2;
chord.position.z = chLength / 2;
ceiling.add(chord);

//Add bulb
const bRadius = 0.25;
const bGeometry = new THREE.SphereGeometry(bRadius, 32, 32);
const bMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const bulb = new THREE.Mesh(bGeometry, bMaterial);
bulb.position.y = chLength / 2 + bRadius / 2;
chord.add(bulb);
spotLight.position.y = bRadius / 5;
bulb.add(spotLight);

// Add balls
const loader = new THREE.TextureLoader();
const ballRadius = 0.1;
const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
const balls = [];
const numberOfBalls = 8;
const ballSpeed = [];
const speedValue = 3;

//balls texture
const ballsTexture = [
  "PoolBallSkins/Ball8.jpg",
  "PoolBallSkins/Ball9.jpg",
  "PoolBallSkins/Ball10.jpg",
  "PoolBallSkins/Ball11.jpg",
  "PoolBallSkins/Ball12.jpg",
  "PoolBallSkins/Ball13.jpg",
  "PoolBallSkins/Ball14.jpg",
  "PoolBallSkins/Ball15.jpg",
];

// speed and current position of translational motion
const planeNormal = [];
const ballPos = [];
const rollFriction = 0.2;
const reflectionLoss = 0.2;
const collisionLoss = 0.3;
const tableLengthX = width - 2 * thickness;
const tableLengthY = length - 2 * thickness;

for (let i = 0; i < numberOfBalls; i++) {
  const ballMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: loader.load(ballsTexture[i]),
    wireframe: true,
  });

  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.castShadow = true;

  do {
    const newPosition = getRandomPosition();
    const isNotOverlapping = checkOverlap(newPosition);

    if (isNotOverlapping) {
      ballPos.push(newPosition);
      ball.position.copy(newPosition);
      break;
    }
  } while (true);

  ball.matrixAutoUpdate = false;
  table.add(ball);
  balls.push(ball);

  ballSpeed.push(getRandomSpeed());
  const normal = new THREE.Vector3(0, 0, -1);
  normal.cross(ballSpeed[i]).normalize();
  planeNormal.push(normal);
}

function getRandomPosition() {
  const x = (Math.random() - 0.5) * (tableLengthX - 2 * ballRadius);
  const y = (Math.random() - 0.5) * (tableLengthY - 2 * ballRadius);
  const z = -(ballRadius + tabletickness / 2);

  return new THREE.Vector3(x, y, z);
}

function checkOverlap(newPosition) {
  for (let j = 0; j < ballPos.length; j++) {
    const distanceSquared = newPosition.distanceToSquared(ballPos[j]);
    const minDistanceSquared = 4 * ballRadius * ballRadius;

    if (distanceSquared < minDistanceSquared) {
      return false;
    }
  }
  return true;
}

function getRandomSpeed() {
  const randomSpeedX = (Math.random() - 0.5) * speedValue;
  const randomSpeedY = (Math.random() - 0.5) * speedValue;

  return new THREE.Vector3(randomSpeedX, randomSpeedY, 0);
}

function rollingBall(h) {
  for (let i = 0; i < numberOfBalls; i++) {
    if (ballSpeed[i].length() < 0.1) {
      ballSpeed[i].set(0, 0, 0);
    }
    updateRotationAndPosition(i, h);
    reflectOffCushion(i);
  }

  handleBallCollisions();
}

function updateRotationAndPosition(ballIndex, h) {
  planeNormal[ballIndex].set(0, 0, -1);
  planeNormal[ballIndex].cross(ballSpeed[ballIndex]).normalize();
  const omega = ballSpeed[ballIndex].length() / ballRadius;
  const rotationMatrix = new THREE.Matrix4().makeRotationAxis(
    planeNormal[ballIndex],
    omega * h
  );
  balls[ballIndex].matrix.premultiply(rotationMatrix);
  ballPos[ballIndex].add(ballSpeed[ballIndex].clone().multiplyScalar(h));
  balls[ballIndex].matrix.setPosition(ballPos[ballIndex]);
}

function reflectOffCushion(ballIndex) {
  if (
    ballPos[ballIndex].x + ballRadius >= tableLengthX / 2 ||
    ballPos[ballIndex].x - ballRadius <= -tableLengthX / 2
  ) {
    ballSpeed[ballIndex].x *= -1;
    ballSpeed[ballIndex].multiplyScalar(1 - reflectionLoss);
  }

  if (
    ballPos[ballIndex].y + ballRadius >= tableLengthY / 2 ||
    ballPos[ballIndex].y - ballRadius <= -tableLengthY / 2
  ) {
    ballSpeed[ballIndex].y *= -1;
    ballSpeed[ballIndex].multiplyScalar(1 - reflectionLoss);
  }
}

function handleBallCollisions() {
  for (let i = 0; i < numberOfBalls - 1; i++) {
    for (let j = i + 1; j < numberOfBalls; j++) {
      if (
        ballPos[i].distanceToSquared(ballPos[j]) <
        4 * ballRadius * ballRadius
      ) {
        const normal = new THREE.Vector3().copy(ballPos[i]).sub(ballPos[j]);
        const speedDiff = new THREE.Vector3()
          .copy(ballSpeed[i])
          .sub(ballSpeed[j]);
        const temp = new THREE.Vector3().copy(
          normal.multiplyScalar(speedDiff.dot(normal) / normal.lengthSq())
        );
        ballSpeed[i].sub(temp).multiplyScalar(1 - collisionLoss);
        ballSpeed[j].add(temp).multiplyScalar(1 - collisionLoss);
      }
    }
  }
}

// * Render loop
const computerClock = new THREE.Clock();
const controls = new TrackballControls(camera, renderer.domElement);

function render() {
  requestAnimationFrame(render);
  const h = computerClock.getDelta();
  for (let i = 0; i < balls.length; i++) {
    ballSpeed[i].multiplyScalar(1 - rollFriction * h);
  }
  rollingBall(h);
  controls.update();
  renderer.render(scene, camera);
}
render();
