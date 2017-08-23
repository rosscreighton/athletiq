import { UniversalCamera, Vector3 } from 'babylonjs';

import scene from './scene';

const camera = new UniversalCamera('camera', new Vector3(0, 30, -35), scene);
camera.setTarget(new Vector3(0, 0, 47));

//const camera = new UniversalCamera('camera', new Vector3(0, 120, 0), scene);
//camera.setTarget(new Vector3(0, 0, 0));

scene.activeCamera = camera;

export default camera;
