import { Vector3 } from 'babylonjs';

const courtWidth = 50;
export const courtLength = 94;
const laneWidth = 12;
const laneLength = 19;
const rimRadius = 9/12;
const rimAttachmentLength = 5.9/12;
const backboardOffsetFromBaseline = 4;
export const threePointLineRadius = 23.9;
export const threePointLineRadiusAtBaseline = 22;
export const threePointLineOffsetFromBaseline = 14;
const oneInch = 1/12;
export const lineWidth = oneInch * 3;

export const backRightCorner = new Vector3(
  courtWidth / 2,
  0,
  (courtLength / 2) * -1,
);

export const backLeftCorner = new Vector3(
  (courtWidth / 2) * -1,
  0,
  (courtLength / 2) * -1,
);

export const frontLeftCorner = new Vector3(
  courtWidth / 2 * -1,
  0,
  courtLength / 2,
);

export const frontRightCorner = new Vector3(
  courtWidth / 2,
  0,
  courtLength / 2,
);

export const halfCourtLeft = new Vector3(
  (courtWidth / 2) * -1,
  0,
  0,
);

export const halfCourtRight = new Vector3(
  courtWidth / 2,
  0,
  0,
);

export const laneFrontLeftCorner = new Vector3(
  -1 * (laneWidth / 2),
  0,
  courtLength / 2,
);

export const laneFrontRightCorner = new Vector3(
  laneWidth / 2,
  0,
  courtLength / 2,
);

export const laneBackLeftCorner = new Vector3(
  -1 * (laneWidth / 2),
  0,
  courtLength / 2 - laneLength,
);

export const laneBackRightCorner = new Vector3(
  laneWidth / 2,
  0,
  courtLength / 2 - laneLength,
);

export const freeThrowLineCenter = new Vector3(
  0,
  0,
  courtLength / 2 - laneLength,
);

export const centerOfHoopProjectedToFloor = new Vector3(
  0,
  0,
  (courtLength / 2) - backboardOffsetFromBaseline - rimAttachmentLength - rimRadius,
);
