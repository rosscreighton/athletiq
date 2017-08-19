import {
  Color3,
  Mesh,
  Vector3,
  StandardMaterial,
} from 'babylonjs';

import scene from './scene';
import {
  courtLength,
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
  threePointLineRadius,
  threePointLineRadiusAtBaseline,
  threePointLineOffsetFromBaseline,
  centerOfHoopProjectedToFloor,
  lineWidth,
} from './courtDimensions';
import { calcCircleZ } from './utils';

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

function createKey() {
  const innerEdge = [];
  const outerEdge = [];
  const outerIncrement = 0.1;
  const keyDiameter = laneBackRightCorner.x - laneBackLeftCorner.x;
  const numberOfPoints = keyDiameter / outerIncrement;
  const innerIncrement = (keyDiameter - lineWidth * 2) / numberOfPoints;

  /* calculate outer edge of key circle */
  for (let x = laneBackRightCorner.x; x >= laneBackLeftCorner.x; x -= outerIncrement) {
    let zOuter = freeThrowLineCenter.z - calcCircleZ(0, 0, keyDiameter / 2, x);
    outerEdge.push(new Vector3(x, 0, zOuter));
  }

  /* calculate inner edge of key circle */
  for (let x = laneBackRightCorner.x - lineWidth; x >= laneBackLeftCorner.x + lineWidth; x -= innerIncrement) {
    let zInner = freeThrowLineCenter.z - calcCircleZ(0, 0, (keyDiameter / 2) - lineWidth, x);
    innerEdge.push(new Vector3(x, 0, zInner));
  }

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

function createThreePointLine() {
  const outerEdge = [];
  const innerEdge = [];
  const outerIncrement = 0.1;
  const numberOfPoints = (threePointLineRadius * 2) / outerIncrement;
  const innerIncrement = (threePointLineRadius * 2 - lineWidth * 2) / numberOfPoints;
  const startDrawingThreePointArc = courtLength / 2 - threePointLineOffsetFromBaseline;

  outerEdge.push(new Vector3(threePointLineRadiusAtBaseline, 0, courtLength / 2));
  innerEdge.push(new Vector3(threePointLineRadiusAtBaseline - lineWidth, 0, courtLength / 2));

  /* calculate outer edge of three point line */
  for (let x = threePointLineRadius; x >= -1 * threePointLineRadius; x -= outerIncrement) {
    let zOuter = centerOfHoopProjectedToFloor.z - calcCircleZ(0, 0, threePointLineRadius, x);
    if (zOuter <= startDrawingThreePointArc) {
      if (x < threePointLineRadiusAtBaseline || x > -1 * threePointLineRadiusAtBaseline) {
        outerEdge.push(new Vector3(x, 0, zOuter));
      }
    }
  }

  /* calculate inner edge of three point line */
  for (let x = threePointLineRadius - lineWidth; x >= (-1 * threePointLineRadius) + lineWidth; x -= innerIncrement) {
    let zInner = centerOfHoopProjectedToFloor.z - calcCircleZ(0, 0, threePointLineRadius - lineWidth, x);
    if (zInner <= startDrawingThreePointArc) {
      if (x < threePointLineRadiusAtBaseline || x > -1 * threePointLineRadiusAtBaseline) {
        innerEdge.push(new Vector3(x, 0, zInner));
      }
    }
  }

  outerEdge.push(new Vector3(-1 * threePointLineRadiusAtBaseline, 0, courtLength / 2));
  innerEdge.push(new Vector3(-1 * threePointLineRadiusAtBaseline + lineWidth, 0, courtLength / 2));

  console.log(outerEdge, innerEdge);

  Mesh.CreateRibbon(
    'threePointLine',
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
createThreePointLine();
