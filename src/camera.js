import { UniversalCamera, Vector3 } from 'babylonjs';

import scene from './scene';

const camera = new UniversalCamera('camera', new Vector3(0, 120, 0), scene);
camera.setTarget(Vector3.Zero());

scene.activeCamera = camera;

export default camera;
