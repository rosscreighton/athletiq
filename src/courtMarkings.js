import {
  Mesh,
  Vector3,
} from 'babylonjs';

import scene from './scene';
import {
  courtLength,
  frontRightCorner,
  frontLeftCorner,
  halfCourtLeft,
  halfCourtRight,
  laneFrontRightCorner,
  laneFrontLeftCorner,
  laneBackRightCorner,
  laneBackLeftCorner,
  laneBackRightCornerNBA,
  laneBackLeftCornerNBA,
  laneFrontLeftCornerNBA,
  laneFrontRightCornerNBA,
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

function createNBALane() {
  const path = [
    laneBackRightCornerNBA,
    laneBackLeftCornerNBA,
    laneFrontLeftCornerNBA,
    laneFrontRightCornerNBA,
    laneBackRightCornerNBA,
  ];

  createMarking(path, 'nbaLane', {
    symmetryZ: courtLength / 2,
    reflectZ: true,
  });
};

function createBlocks() {
  const block1 = [
    new Vector3(
      laneFrontRightCornerNBA.x,
      0,
      laneFrontRightCornerNBA.z - 7,
    ),
    new Vector3(
      laneFrontRightCornerNBA.x + 1,
      0,
      laneFrontRightCornerNBA.z - 7,
    ),
  ];

  const block2 = [
    new Vector3(
      laneFrontRightCornerNBA.x,
      0,
      laneFrontRightCornerNBA.z - 8,
    ),
    new Vector3(
      laneFrontRightCornerNBA.x + 0.75,
      0,
      laneFrontRightCornerNBA.z - 8,
    ),
  ];

  const block3 = [
    new Vector3(
      laneFrontRightCornerNBA.x,
      0,
      laneFrontRightCornerNBA.z - 11,
    ),
    new Vector3(
      laneFrontRightCornerNBA.x + 0.5,
      0,
      laneFrontRightCornerNBA.z - 11,
    ),
  ];

  const block4 = [
    new Vector3(
      laneFrontRightCornerNBA.x,
      0,
      laneFrontRightCornerNBA.z - 14,
    ),
    new Vector3(
      laneFrontRightCornerNBA.x + 0.4,
      0,
      laneFrontRightCornerNBA.z - 14,
    ),
  ];


  [block1, block2, block3, block4].forEach(path => {
    createMarking(path, 'blocks', {
      offsetLastX: false,
      reflectZ: true,
    });
  });
};

function createKey() {
  const path = [];
  const keyDiameter = laneBackRightCorner.x - laneBackLeftCorner.x;

  /* calculate outer edge of key circle */
  for (let x = laneBackRightCorner.x; x >= laneBackLeftCorner.x; x -= 0.1) {
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
  const path = [];
  const startDrawingThreePointArc = courtLength / 2 - threePointLineOffsetFromBaseline;

  path.push(new Vector3(threePointLineRadiusAtBaseline, 0, courtLength / 2));

  for (let x = threePointLineRadius; x >= -1 * threePointLineRadius; x -= 0.1) {
    let z = centerOfHoopProjectedToFloor.z - calcCircleZ(0, 0, threePointLineRadius, x);
    if (z <= startDrawingThreePointArc) {
      if (x < threePointLineRadiusAtBaseline || x > -1 * threePointLineRadiusAtBaseline) {
        path.push(new Vector3(x, 0, z));
      }
    }
  }

  path.push(new Vector3(-1 * threePointLineRadiusAtBaseline, 0, courtLength / 2));

  createMarking(path, 'threePointLine', {
    symmetryZ: courtLength / 2,
    offsetFirstZ: false,
    offsetLastZ: false,
  });
}

createBoundaryLine();
createDivisionLine();
createCenterCircle();
createLane();
createNBALane();
createBlocks();
createKey();
createThreePointLine();
