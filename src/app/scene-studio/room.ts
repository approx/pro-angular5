import { HudObj } from './objs';
import { WebObj} from './webObj';
import { Material,MeshBasicMaterial,TextureLoader } from 'three';
import { SceneStudio } from './scene';
import { SphericalCordinate } from './sphericalCordinate';

export class Room{
  obj:WebObj;
  imgsHud:HudObj[];

  constructor(textureUrl:string,imgsHud:HudObj[],scene:SceneStudio,onLoadedTexture?:()=>void){
    let mat= new MeshBasicMaterial({
      map: new TextureLoader().load(textureUrl,()=>{
        if(onLoadedTexture){
          onLoadedTexture();
        }
      }),
      transparent : true,
      opacity : 0
    });

    this.obj = SceneStudio.CreateSphere(500,60,60,mat,scene);
    this.obj.mesh.scale.set(-1,1,1);
    this.obj.mesh.visible=false;

    this.imgsHud = imgsHud ? imgsHud : [];
    for (let i = 0; i < this.imgsHud.length; i++) {
        scene.Add(this.imgsHud[i]);
    }
  }

  AddHud(hud:HudObj):void{
    this.imgsHud.push(hud);
  }

  Show(){
    if(this.obj.mesh.material instanceof Material){
      this.obj.mesh.material.opacity = 1;
      this.obj.mesh.visible=true;
    }
  }

  DisableHud():void{
    for (let i = 0; i < this.imgsHud.length; i++) {
        this.imgsHud[i].Disable();
    }
  }

  EnableHud():void{
    for (let i = 0; i < this.imgsHud.length; i++) {
        this.imgsHud[i].Enable();
    }
  }

  private _fade(to:Room):void{
    if(this.obj.mesh.material instanceof Material && to.obj.mesh.material instanceof Material){
      if(this.obj.mesh.material.opacity>0){
        to.obj.mesh.visible=true;
        this.obj.mesh.material.opacity-=1/100;
        to.obj.mesh.material.opacity+=1/100;
        requestAnimationFrame(()=>{
          this._fade(to);
        })
      }
      else{
        this.obj.mesh.visible=false;
      }
    }
  }

  Fade(to:Room):void{
    this.DisableHud();
    to.EnableHud();
    this._fade(to);
  }
}
