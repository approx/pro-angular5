import { Injectable } from '@angular/core';

@Injectable()
export class LoaderService {
  toLoad:number=0;
  loaded:number=0;
  loadedCalback:(()=>void)[]=[];
  onLoading:(percentage:number)=>void;
  onStart:(()=>void)[] = [];

  Add(){
    this.toLoad++;
  }

  Loaded(){
    this.loaded++;
    if(this.onLoading){
      this.onLoading((this.loaded*100)/this.toLoad);
    }
    if(this.loaded>=this.toLoad){
      if(this.loadedCalback){
        for (let i = 0; i < this.loadedCalback.length; i++) {
            this.loadedCalback[i]();
        }
        this.toLoad=0;
        this.loaded=0;
      }
    }
  }

  AddOnStart(onStart:()=>void){
    this.onStart.push(onStart);
  }

  Start(){
    for (let i = 0; i < this.onStart.length; i++) {
        this.onStart[i]();
    }
  }

  AddCallBack(calback:()=>void){
    this.loadedCalback.push(calback);
  }

  SetOnLoading(calback:(percentage:number)=>void){
    this.onLoading = calback;
  }

}
