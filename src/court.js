import { Color3, Mesh, StandardMaterial } from 'babylonjs';
import scene from './scene';

const courtWidth = 50;
const courtDepth = 94;

const court = Mesh.CreateGround('court', courtWidth, courtDepth, 1);

const material = new StandardMaterial('material', scene);
material.diffuseColor = new Color3(1, 1, 1);
court.material = material;

export default court;
