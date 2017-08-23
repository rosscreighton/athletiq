import {
  Mesh,
  Vector3,
} from 'babylonjs';

import scene from './scene';
import {
  courtLength,
  courtWidth,
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
  restrictedAreaRadius,
  backboardOffsetFromBaseline,
  freeThrowLineCenter,
  threePointLineRadius,
  threePointLineRadiusAtBaseline,
  threePointLineOffsetFromBaseline,
  centerOfHoopProjectedToFloor,
  hashMarkZ,
  lineWidth,
} from './courtDimensions';
import { calcCircleZ } from './utils';

function createRibbon(path, name, opts={}) {
  const {
    symmetryX=0,
    symmetryZ=0,
    offsetFirstX=true,
    offsetFirstZ=true,
    offsetLastX=true,
    offsetLastZ=true,
    reflectZ=true,
    reflectX=false,
  } = opts;
  const offsetPath = [];
  const reflectedPathZ = [];
  const reflectedOffsetPathZ = [];
  const reflectedPathX = [];
  const reflectedOffsetPathX = [];
  const reflectedPathXZ = [];
  const reflectedOffsetPathXZ = [];

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

    if (reflectZ) {
      reflectedPathZ.push(new Vector3(x, y, z * -1))
      reflectedOffsetPathZ.push(new Vector3(offsetX, y, offsetZ * -1))
    }

    if (reflectX) {
      reflectedPathX.push(new Vector3(x * -1 , y, z))
      reflectedOffsetPathX.push(new Vector3(offsetX * -1, y, offsetZ))

      if (reflectZ) {
        reflectedPathXZ.push(new Vector3(x * -1 , y, z * -1))
        reflectedOffsetPathXZ.push(new Vector3(offsetX * -1, y, offsetZ * -1))
      }
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

  if (reflectZ) {
    Mesh.CreateRibbon(
      name + 'ReflectedZ',
      [
        reflectedOffsetPathZ,
        reflectedPathZ,
      ],
      false,
      false,
      0,
      scene,
      false,
    );
  }

  if (reflectX) {
    Mesh.CreateRibbon(
      name + 'ReflectedX',
      [
        reflectedOffsetPathX,
        reflectedPathX,
      ],
      false,
      false,
      0,
      scene,
      false,
    );

    if (reflectZ) {
      Mesh.CreateRibbon(
        name + 'ReflectedXZ',
        [
          reflectedPathXZ,
          reflectedOffsetPathXZ,
        ],
        false,
        false,
        0,
        scene,
        false,
      );
    }
  }
}

function createBoundaryLine() {
  const path = [
    halfCourtLeft,
    frontLeftCorner,
    frontRightCorner,
    halfCourtRight,
  ];

  createRibbon(path, 'boundaryLine');
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

  createRibbon(path, 'divisionLine', { reflectZ: false });
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

  createRibbon(path, 'lane', {
    symmetryZ: courtLength / 2,
  });
}

function createRestrictedArea() {
  const path = [];
  const circleCenterZ = courtLength / 2 - backboardOffsetFromBaseline;

  for (let x = restrictedAreaRadius; x >= -1 * restrictedAreaRadius; x -= 0.1) {
    let z = circleCenterZ - calcCircleZ(0, 0, restrictedAreaRadius, x);
    path.push(new Vector3(x, 0, z));
  }

  /* this easier than dealing with the floating point bs
  that messes up the iterator above */
  path.push(new Vector3(-1 * restrictedAreaRadius, 0, circleCenterZ));

  createRibbon(path, 'restrictedArea', {
    symmetryZ: circleCenterZ,
    offsetFirstZ: false,
    offsetLastZ: false,
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

  createRibbon(path, 'nbaLane', {
    symmetryZ: courtLength / 2,
  });
}

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
    createRibbon(path, 'blocks', {
      offsetLastX: false,
      reflectX: true,
    });
  });
}

function createKey() {
  const path = [];
  const keyRadius = (laneBackRightCorner.x - laneBackLeftCorner.x) / 2;

  /* calculate outer edge of key circle */
  for (let x = laneBackRightCorner.x; x >= laneBackLeftCorner.x; x -= 0.1) {
    let z = freeThrowLineCenter.z - calcCircleZ(0, 0, keyRadius, x);
    path.push(new Vector3(x, 0, z));
  }

  createRibbon(path, 'key', {
    symmetryZ: freeThrowLineCenter.z,
    offsetFirstZ: false,
    offsetLastZ: false,
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

  createRibbon(path, 'threePointLine', {
    symmetryZ: courtLength / 2,
    offsetFirstZ: false,
    offsetLastZ: false,
  });
}

function createHashMarks() {
  const path = [
    new Vector3(courtWidth / 2 - 2, 0, hashMarkZ),
    new Vector3(courtWidth / 2, 0, hashMarkZ),
  ]

  createRibbon(path, 'threePointLine', {
    offsetFirstX: false,
    offsetLastX: false,
    reflectX: true,
  });
}

createBoundaryLine();
createDivisionLine();
createCenterCircle();
createLane();
createNBALane();
createRestrictedArea();
createBlocks();
createKey();
createThreePointLine();
createHashMarks();
