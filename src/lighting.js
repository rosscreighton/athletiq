import { HemisphericLight, Color3, Vector3 } from 'babylonjs';
import scene from './scene';

const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

export default light;

