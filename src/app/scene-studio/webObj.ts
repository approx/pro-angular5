import { Mesh } from 'three';

export class WebObj{
  mesh:Mesh;
  update: () => void;
  start: ()=> void;

  constructor(obj3D:Mesh);
  constructor(obj3D:Mesh,update?:()=> void,start?:()=> void){
    this.mesh = obj3D;
    this.update = update ? update : function(){};
    this.start = start ? start :function(){};
  }
}
