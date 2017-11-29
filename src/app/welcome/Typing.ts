import * as $ from 'jquery';

export class Typing{
  elements:JQuery;
  speed:number;
  callback?:()=>void

  constructor(element:JQuery,speed:number,callback?:()=>void) {
    this.callback = callback ? callback : ()=>{};
    this.elements =  element;
    this.speed = speed;
    this.elements.css({display:'none'});
  }

  Type(){
    $.each(this.elements,(index,element)=>{
      setTimeout(()=>{
        $(element).css({display:'inline-block'});
      },this.speed*index)
    });
    setTimeout(()=>{
      this.callback();
    },this.speed*this.elements.length);
  }
}
