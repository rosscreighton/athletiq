import { UniversalCamera, Vector3 } from 'babylonjs';

import scene from './scene';

const camera = new UniversalCamera('camera', new Vector3(0, 30, -30), scene);
camera.setTarget(new Vector3(0, 0, 47));

scene.activeCamera = camera;

export default camera;
