import { HemisphericLight, Color3, Vector3 } from 'babylonjs';
import scene from './scene';

const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
light.diffuse = new Color3(1, 1, 1);
light.specular = new Color3(1, 1, 1);
light.groundColor = new Color3(0, 0, 0);

export default light;

