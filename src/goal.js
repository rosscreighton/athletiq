import {
  Mesh,
  Vector3,
} from 'babylonjs';
import scene from './scene';
import {
  courtLength,
  backboardOffsetFromBaseline,
} from './courtDimensions.js';

function createBackboard() {
  const backboard = Mesh.CreateBox('backboard', 6, scene);
  backboard.position.z = courtLength / 2 - backboardOffsetFromBaseline;
  backboard.position.y = 10 - 0.5;
  backboard.scaling.z = 0.5 / 6;
  backboard.scaling.y = (7 / 2) * (1 / 6);

  const reflectedBackboard = Mesh.CreateBox('backboard', 6, scene);
  reflectedBackboard.position.z = backboard.position.z * -1;
  reflectedBackboard.position.y = 10 - 0.5;
  reflectedBackboard.scaling = backboard.scaling;
}

createBackboard();
