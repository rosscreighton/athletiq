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

function createMarking(path, axisOfSymmetryX, axisOfSymmetryZ, name, reflectAcrossDivisionLine) {
  const offsetPath = [];
  const reflectedPath = [];
  const reflectedOffsetPath = [];

  path.forEach(({ x, y, z }) => {
    let offsetX;
    let offsetZ;

    if (x >= axisOfSymmetryX) {
      offsetX = x - lineWidth;
    } else {
      offsetX = x + lineWidth;
    }

    if (z >= axisOfSymmetryZ) {
      offsetZ = z - lineWidth;
    } else {
      offsetZ = z + lineWidth;
    }

    const offsetVector = new Vector3(
      offsetX,
      y,
      offsetZ,
    );

    offsetPath.push(offsetVector);

    if (reflectAcrossDivisionLine) {
      reflectedPath.push(new Vector3(x, y, z * -1))
      reflectedOffsetPath.push(new Vector3(offsetX, y, offsetZ * -1))
    }
  });

  Mesh.CreateRibbon(
    name,
    [
      path,
      offsetPath,
    ],
    false,
    false,
    0,
    scene,
    false,
  );

  if (reflectAcrossDivisionLine) {
    Mesh.CreateRibbon(
      name + 'reflected',
      [
        reflectedOffsetPath,
        reflectedPath,
      ],
      false,
      false,
      0,
      scene,
      false,
    );
  }
}

function createOutOfBoundsLine() {
  const path = [
    backRightCorner,
    backLeftCorner,
    frontLeftCorner,
    frontRightCorner,
    backRightCorner,
  ];

  createMarking(path, 0, 0, 'boundaryLine');
}

function createHalfCourtLine() {
  const path = [
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

  createMarking(path, 0, 0, 'divisionLine');
}

function createCenterCircle() {
  const disc = Mesh.CreateDisc('centerCircle', 6, 64, scene);
  disc.rotation.x = Math.PI / 2;
}

function createLane() {
  const path = [
    laneBackRightCorner,
    laneBackLeftCorner,
    laneFrontLeftCorner,
    laneFrontRightCorner,
    laneBackRightCorner,
  ];

  createMarking(path, 0, courtLength / 2, 'lane', true);
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

  const outerEdge2 = outerEdge.map(vector => {
    return new Vector3(
      vector.x,
      vector.y,
      vector.z * -1,
    )
  })

  const innerEdge2 = innerEdge.map(vector => {
    return new Vector3(
      vector.x,
      vector.y,
      vector.z * -1,
    )
  })

  Mesh.CreateRibbon(
    'key2',
    [
      outerEdge2,
      innerEdge2,
    ],
    false,
    false,
    0,
    scene,
    false,
    Mesh.BACKSIDE,
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

  const outerEdge2 = outerEdge.map(vector => {
    return new Vector3(
      vector.x,
      vector.y,
      vector.z * -1,
    )
  })

  const innerEdge2 = innerEdge.map(vector => {
    return new Vector3(
      vector.x,
      vector.y,
      vector.z * -1,
    )
  })

  Mesh.CreateRibbon(
    'threePointLine2',
    [
      outerEdge2,
      innerEdge2,
    ],
    false,
    false,
    0,
    scene,
    false,
    Mesh.BACKSIDE,
  );
}

createOutOfBoundsLine();
createHalfCourtLine();
createCenterCircle();
createLane();
createKey();
createThreePointLine();
