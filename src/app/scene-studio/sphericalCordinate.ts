import {Vector3} from 'three';
import {SceneHelper} from './helper'

export class SphericalCordinate{
  colatitude:number;
  azimute:number;
  dist:number;

  constructor(colatitude:number,azimute:number,dist:number){
    this.colatitude = colatitude;
    this.azimute = azimute;
    this.dist = dist;
  }

  ToVector3():Vector3{
    let x = this.dist*SceneHelper.RoundedSin(SceneHelper.degree2rad(this.azimute))*SceneHelper.RoundedCos(SceneHelper.degree2rad(this.colatitude));
    let z = this.dist*SceneHelper.RoundedSin(SceneHelper.degree2rad(this.azimute))*SceneHelper.RoundedSin(SceneHelper.degree2rad(this.colatitude));
    let y = this.dist*SceneHelper.RoundedCos(SceneHelper.degree2rad(this.azimute));
    return new Vector3(x,y,z);
  }
}
