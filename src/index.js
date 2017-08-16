import {
  Color3,
  HemisphericLight,
  UniversalCamera,
  Vector3,
} from 'babylonjs';

import engine from './engine';
import scene from './scene';
import court from './court';

const camera = new UniversalCamera('camera', new Vector3(0, 120, 0), scene);
camera.setTarget(Vector3.Zero());

const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
light.diffuse = new Color3(1, 1, 1);
light.specular = new Color3(1, 1, 1);
light.groundColor = new Color3(0, 0, 0);

scene.activeCamera = camera;

engine.runRenderLoop(() => scene.render())

