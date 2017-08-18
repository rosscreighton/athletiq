import { Vector3 } from 'babylonjs';

const courtWidth = 50;
const courtLength = 94;
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
  -6,
  0,
  courtLength / 2,
);

export const laneFrontRightCorner = new Vector3(
  6,
  0,
  courtLength / 2,
);

export const laneBackLeftCorner = new Vector3(
  -6,
  0,
  courtLength / 2 - 19,
);

export const laneBackRightCorner = new Vector3(
  6,
  0,
  courtLength / 2 - 19,
);
