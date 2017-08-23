import {
  Mesh,
  Vector3,
} from 'babylonjs';
import scene from './scene';
import {
  lineWidth,
  courtLength,
  backboardOffsetFromBaseline,
} from './courtDimensions.js';

const backboardZ = courtLength / 2 - backboardOffsetFromBaseline;

function paintLine(path, name, opts={}) {
  const {
    symmetryX=0,
    symmetryY=0,
    offsetFirstX=true,
    offsetFirstY=true,
    offsetLastX=true,
    offsetLastY=true,
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
    let shouldOffsetY = true;

    if (idx === 0) {
      shouldOffsetX = offsetFirstX;
      shouldOffsetY = offsetFirstY;
    }

    if (idx === path.length - 1) {
      shouldOffsetX = offsetLastX;
      shouldOffsetY = offsetLastY;
    }

    let offsetX = x;
    let offsetY = y;

    if (shouldOffsetX) {
      if (x >= symmetryX) {
        offsetX = x - lineWidth;
      } else {
        offsetX = x + lineWidth;
      }
    }

    if (shouldOffsetY) {
      if (y >= symmetryY) {
        offsetY = y - lineWidth;
      } else {
        offsetY = y + lineWidth;
      }
    }

    const offsetVector = new Vector3(
      offsetX,
      offsetY,
      z,
    );

    offsetPath.push(offsetVector);

    if (reflectZ) {
      reflectedPathZ.push(new Vector3(x, y, z * -1));
      reflectedOffsetPathZ.push(new Vector3(offsetX, offsetY, z * -1));
    }

    if (reflectX) {
      reflectedPathX.push(new Vector3(x * -1 , y, z));
      reflectedOffsetPathX.push(new Vector3(offsetX * -1, offsetY, z));

      if (reflectZ) {
        reflectedPathXZ.push(new Vector3(x * -1 , y, z * -1))
        reflectedOffsetPathXZ.push(new Vector3(offsetX * -1, offsetY, z * -1));
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

function paintBackboardOutline() {
  const backboardY = 10 - 0.5;
  const path = [
    new Vector3(0, backboardY + 3.5, backboardZ),
    new Vector3(3, backboardY + 3.5, backboardZ),
    new Vector3(3, backboardY, backboardZ),
    new Vector3(0, backboardY, backboardZ),
  ];

  paintLine(path, 'backboard', {
    symmetryY: backboardY + 3.5 / 2,
    reflectX: true,
  });
}

function paintWindow() {
  const windowHeight = 18 / 12;
  const path = [
    new Vector3(0, 10 + windowHeight, backboardZ),
    new Vector3(1, 10 + windowHeight, backboardZ),
    new Vector3(1, 10, backboardZ),
    new Vector3(0, 10, backboardZ),
  ];

  paintLine(path, 'window', {
    symmetryY:10 + windowHeight / 2,
    reflectX: true,
  });
}

paintBackboardOutline();
paintWindow();
