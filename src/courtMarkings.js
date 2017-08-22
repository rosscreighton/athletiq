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

function createMarking(path, name, opts={}) {
  const {
    symmetryX=0,
    symmetryZ=0,
    offsetFirstX=true,
    offsetFirstZ=true,
    offsetLastX=true,
    offsetLastZ=true,
    reflect=true
  } = opts;
  const offsetPath = [];
  const reflectedPath = [];
  const reflectedOffsetPath = [];

  path.forEach(({ x, y, z }, idx) => {
    let shouldOffsetX = true;
    let shouldOffsetZ = true;

    if (idx === 0) {
      shouldOffsetX = offsetFirstX;
      shouldOffsetZ = offsetFirstZ;
    }

    if (idx === path.length - 1) {
      shouldOffsetX = offsetLastX;
      shouldOffsetZ = offsetLastZ;
    }

    let offsetX = x;
    let offsetZ = z;

    if (shouldOffsetX) {
      if (x >= symmetryX) {
        offsetX = x - lineWidth;
      } else {
        offsetX = x + lineWidth;
      }
    }

    if (shouldOffsetZ) {
      if (z >= symmetryZ) {
        offsetZ = z - lineWidth;
      } else {
        offsetZ = z + lineWidth;
      }
    }

    const offsetVector = new Vector3(
      offsetX,
      y,
      offsetZ,
    );

    offsetPath.push(offsetVector);

    if (reflect) {
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

  if (reflect) {
    Mesh.CreateRibbon(
      name + 'Reflected',
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

function createBoundaryLine() {
  const path = [
    halfCourtLeft,
    frontLeftCorner,
    frontRightCorner,
    halfCourtRight,
  ];

  createMarking(path, 'boundaryLine');
}

function createDivisionLine() {
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

  createMarking(path, 'divisionLine', { reflect: false });
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

  createMarking(path, 'lane', {
    symmetryZ: courtLength / 2,
    reflect: true,
  });
}

function createKey() {
  const path = [];
  const outerIncrement = 0.1;
  const keyDiameter = laneBackRightCorner.x - laneBackLeftCorner.x;
  const numberOfPoints = keyDiameter / outerIncrement;
  const innerIncrement = (keyDiameter - lineWidth * 2) / numberOfPoints;

  /* calculate outer edge of key circle */
  for (let x = laneBackRightCorner.x; x >= laneBackLeftCorner.x; x -= outerIncrement) {
    let z = freeThrowLineCenter.z - calcCircleZ(0, 0, keyDiameter / 2, x);
    path.push(new Vector3(x, 0, z));
  }

  createMarking(path, 'key', {
    symmetryZ: freeThrowLineCenter.z,
    offsetFirstZ: false,
    offsetLastZ: false,
    reflect: true,
  });
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

createBoundaryLine();
createDivisionLine();
createCenterCircle();
createLane();
createKey();
createThreePointLine();
