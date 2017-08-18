import {
  Color3,
  Mesh,
  Vector3,
  StandardMaterial,
} from 'babylonjs';

import scene from './scene';
import {
  frontRightCorner,
  frontLeftCorner,
  backRightCorner,
  backLeftCorner,
  halfCourtLeft,
  halfCourtRight,
  laneFrontRightCorner,
  laneFrontLeftCorner,
  laneBackRightCorner,
  laneBackLeftCorner,
  freeThrowLineCenter,
  lineWidth,
} from './courtDimensions';

function createOutOfBoundsLine() {
  const outerEdge = [
    backRightCorner,
    backLeftCorner,
    frontLeftCorner,
    frontRightCorner,
  ];

  const innerEdge = [];

  outerEdge.forEach(vector => {
    let innerX;
    let innerZ;

    if (vector.x >= 0) {
      innerX = vector.x - lineWidth;
    } else {
      innerX = vector.x + lineWidth;
    }

    if (vector.z >= 0) {
      innerZ = vector.z - lineWidth;
    } else {
      innerZ = vector.z + lineWidth;
    }

    innerEdge.push(
      new Vector3(
        innerX,
        vector.y,
        innerZ,
      )
    );
  });

  Mesh.CreateRibbon(
    'outOfBoundsLine',
    [
      outerEdge,
      innerEdge,
    ],
    false,
    true,
    0,
    scene,
    false,
  );
}

function createHalfCourtLine() {
  const forwardEdge = [
    new Vector3(
      halfCourtLeft.x,
      halfCourtLeft.y,
      halfCourtLeft.z + lineWidth / 2,
    ),
    new Vector3(
      halfCourtRight.x,
      halfCourtRight.y,
      halfCourtRight.z + lineWidth / 2,
    )
  ];

  const backwardEdge = [
    new Vector3(
      halfCourtLeft.x,
      halfCourtLeft.y,
      halfCourtLeft.z - lineWidth / 2,
    ),
    new Vector3(
      halfCourtRight.x,
      halfCourtRight.y,
      halfCourtRight.z - lineWidth / 2,
    )
  ];

  Mesh.CreateRibbon(
    'halfCourtLine',
    [
      forwardEdge,
      backwardEdge,
    ],
    false,
    false,
    0,
    scene,
    false,
  );
}

function createCenterCircle() {
  const disc = Mesh.CreateDisc('centerCircle', 6, 64, scene);
  disc.rotation.x = Math.PI/2;
}

function createLane() {
  const outerEdge = [
    laneBackRightCorner,
    laneBackLeftCorner,
    laneFrontLeftCorner,
    laneFrontRightCorner,
  ];

  const innerEdge = [
    new Vector3(
      laneBackRightCorner.x - lineWidth,
      laneBackRightCorner.y,
      laneBackRightCorner.z + lineWidth,
    ),
    new Vector3(
      laneBackLeftCorner.x + lineWidth,
      laneBackLeftCorner.y,
      laneBackLeftCorner.z + lineWidth,
    ),
    new Vector3(
      laneFrontLeftCorner.x + lineWidth,
      laneFrontLeftCorner.y,
      laneFrontLeftCorner.z,
    ),
    new Vector3(
      laneFrontRightCorner.x - lineWidth,
      laneFrontRightCorner.y,
      laneFrontRightCorner.z,
    )
  ];

  Mesh.CreateRibbon(
    'lane',
    [
      outerEdge,
      innerEdge,
    ],
    false,
    true,
    0,
    scene,
    false,
  );
}
/* this function is terrible. lets fix it */
function createKey() {
  function calculateCircleCoord(r, x) {
    const h = freeThrowLineCenter.x;
    const k = freeThrowLineCenter.z;
    return freeThrowLineCenter.z - Math.sqrt(Math.pow(r, 2) - Math.pow(x - h, 2));
  }

  const innerEdge = [];
  const outerEdge = [];

  outerEdge.push(new Vector3(laneBackRightCorner.x, 0, laneBackRightCorner.z));
  innerEdge.push(new Vector3(laneBackRightCorner.x - lineWidth, 0, laneBackRightCorner.z));

  for (let x = laneBackRightCorner.x - lineWidth; x >= laneBackLeftCorner.x + lineWidth; x -= 0.1) {
    let zOuter = calculateCircleCoord(6, x);
    let zInner = calculateCircleCoord(6 - lineWidth, x);
    outerEdge.push(new Vector3(x, 0, zOuter));
    innerEdge.push(new Vector3(x, 0, zInner));
  }

  outerEdge.push(new Vector3(laneBackLeftCorner.x, 0, laneBackLeftCorner.z));
  innerEdge.push(new Vector3(laneBackLeftCorner.x + lineWidth, 0, laneBackLeftCorner.z));

  console.log(outerEdge, innerEdge)

  Mesh.CreateRibbon(
    'key',
    [
      outerEdge,
      innerEdge,
    ],
    false,
    false,
    0,
    scene,
    false,
  );
}

createOutOfBoundsLine();
createHalfCourtLine();
createCenterCircle();
createLane();
createKey();
