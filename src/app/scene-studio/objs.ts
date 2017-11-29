import {Mesh,Vector3,Camera} from 'three';
import * as $ from 'jquery';
import { SceneHelper } from './helper';
import { SphericalCordinate } from './sphericalCordinate'

export class HudObj{
  element:JQuery;
  update: () => void;
  start: () => void;
  enabled: boolean;

  constructor(element:JQuery,update?: ()=>void,start?: ()=>void){
    this.element = element;
    this.update = update ? update : function(){};
    this.start = start ? start :function(){};
    this.enabled = true;
  }

  Disable():void{
    this.enabled=false;
    this.element.fadeOut('slow');
  }

  Enable():void{
    this.enabled=true;
    this.element.fadeIn('slow');
  }

  SetToWorldSpace(position:Vector3 | SphericalCordinate,camera:Camera){
    let _position:Vector3 = (position instanceof SphericalCordinate) ? position.ToVector3() : position;
    this.update=()=>{
      let positioninHud = SceneHelper.VectorToScreen(_position.clone(),camera);
      this.element.offset({top:positioninHud.y,left:positioninHud.x});
      this.element.css({position:'absolute'});
      if(this.enabled){
        if(SceneHelper.IsVisibleByCamera(_position,camera)){
          this.element.show();
        }
        else{
          this.element.hide();
        }
      }
    }
  }
}

export class ImgHudObj extends HudObj{

  constructor(width:number,height:number,hud:JQuery,clickCallBack?:()=>void,src?:string){
    let element = $("<div><img src='"+(src ? src : 'assets/imgs/logo.png')+"' class='imgHud' width='"+width+"' height='"+height+"'></img></div>").appendTo(hud);
    let hudObj = new HudObj(element);
    if(clickCallBack){
      element.click((event)=>{
        clickCallBack();
      });
    }
    super(element);
  }
}

export class TextHudObj extends HudObj{

  constructor(text:string,width:number,height:number,hud:JQuery,clickCallBack?:()=>void){
    let element = $("<div class='textHud'><i>"+text+"<i/></div>").appendTo(hud);
    let hudObj = new HudObj(element);
    if(clickCallBack){
      element.click((event)=>{
        clickCallBack();
      });
    }
    super(element);
  }
}
