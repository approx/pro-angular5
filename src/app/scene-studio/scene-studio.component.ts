import { Component, OnInit, ElementRef } from '@angular/core';
import { SceneStudio } from './scene';
import { Vector3 } from 'three';
import { Room } from './room';
import { ImgHudObj} from './objs';
import { SphericalCordinate } from './sphericalCordinate';
import { LoaderService } from '../loader.service';
import { SceneService } from '../scene.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-scene-studio',
  templateUrl: './scene-studio.component.html',
  styleUrls: ['./scene-studio.component.css']
})
export class SceneStudioComponent implements OnInit {
  scene:SceneStudio;
  ambiente:Room;
  reception:Room;
  kitchen:Room;
  creation:Room;

  constructor(public element:ElementRef,public loaderService:LoaderService,private sceneService:SceneService) {

  }

  ngOnInit() {
    this.sceneService.mainScene = this;
    this.loaderService.AddOnStart(()=>{
      this.scene = new SceneStudio("black",new Vector3(0,0,0),75,$('app-scene-studio'));
      this.scene.StartRendering();
      this.scene.AddMouseControlCamera();
      this.setAllRooms();
    });
  }

  setAmbient():void{
    let ambientToReception = new ImgHudObj(50,50,this.scene.hud,()=>{
      this.ambiente.Fade(this.reception);
    });
    ambientToReception.SetToWorldSpace(new SphericalCordinate(0,90,600),this.scene.camera);

    this.loaderService.Add();
    this.ambiente = new Room('assets/imgs/ambiente.png',[
      ambientToReception
    ],this.scene,()=>{
    this.loaderService.Loaded();
    })

    this.ambiente.DisableHud();
  }

  setReception():void {
    let recptionToAmbient = new ImgHudObj(50,50,this.scene.hud,()=>{
      this.reception.Fade(this.ambiente);
    });

    recptionToAmbient.SetToWorldSpace(new SphericalCordinate(180,85,600),this.scene.camera);
    console.log(this.loaderService);
    this.loaderService.Add();
    this.reception = new Room('assets/imgs/360recepcao.png',[
      recptionToAmbient
    ],this.scene,()=>{
      this.loaderService.Loaded();
    });

    this.reception.Show();
    this.reception.DisableHud();
  }

  setKitchen():void{
    this.loaderService.Add();
    this.kitchen = new Room('assets/imgs/cozinha.png',[

    ],this.scene,()=>{
    this.loaderService.Loaded();
    })
  }

  setCreationRoom():void{
    this.loaderService.Add();
    this.creation = new Room('assets/imgs/criacao.png',[

    ],this.scene,()=>{
    this.loaderService.Loaded();
    })
  }

  setAllRooms():void{
    this.setKitchen();
    this.setReception();
    this.setCreationRoom();
    this.setAmbient();
  }

  Start():void{
    this.reception.EnableHud();
  }

  Load360(){

  }
}
