import { Engine } from 'babylonjs';

const canvas = document.getElementsByTagName('canvas')[0];
const engine = new Engine(canvas);
window.addEventListener('resize', () => engine.resize());

export default engine;
