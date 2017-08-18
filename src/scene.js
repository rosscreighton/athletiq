import { Scene } from 'babylonjs';
import engine from './engine';

const scene = new Scene(engine);

engine.runRenderLoop(() => scene.render())

export default scene;
