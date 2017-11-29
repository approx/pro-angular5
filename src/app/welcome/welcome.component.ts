import { Component, OnInit } from '@angular/core';
import { Typing } from './Typing';
import { LoaderService } from '../loader.service';
import { SceneService } from "../scene.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  pro:JQuery;
  title:JQuery;
  proFinalSize = 60;
  wHeight;

  constructor(private loaderService:LoaderService,private sceneService:SceneService) { }

  ngOnInit() {
    this.wHeight = $(window).outerHeight()>$(window).outerWidth() ? $(window).outerWidth():$(window).outerHeight();
    this.title = $('app-welcome .title');
    this.pro = $('app-welcome .title #PRO');
    let type = new Typing($('app-welcome .title span, app-welcome .title #PRO'),110,()=>{
      this.fadeOutText();
    });
    setTimeout(()=>{
      type.Type();
    },1000);
  }

  fadeOutText():void{
    let itens = $('app-welcome .title span');
    itens.css({opacity:0,transition:'all 1s'});
    setTimeout(()=>{
      this.title.css({width:this.title.outerWidth(true),justifyContent: 'flex-end'})
      itens.hide();
      setTimeout(()=>{
        this.title.css({transition:'all 1s',width:this.pro.outerWidth()});
        setTimeout(()=>{
          this.expandProIcon();
        },1000)
      },100)
    },1000);
  }

  expandProIcon(){
      this.title.css({height:(this.wHeight*this.proFinalSize)/100,width:(this.wHeight*this.proFinalSize)/100,transition:'all 1s'});
      this.pro.css({height:(this.wHeight*this.proFinalSize)/100,width:(this.wHeight*this.proFinalSize)/100,transition:'all 1s'});
      setTimeout(()=>{
        this.loaderService.AddCallBack(()=>{
          console.log('finish')
          $('app-welcome').css({backgroundColor:'rgba(19,19,19,0.85)'});
          this.enable360();
        });
        this.loaderService.Start();
      },1000);
  }

  enable360(){
    $('.start360').css({display:'block'});
    setTimeout(()=>{
      $('.start360').css({opacity:1,transition:'all 1s'}).click(()=>{
        this.hideFrontPage();
        this.sceneService.mainScene.Start();
      });

    },10);
  }

  hideFrontPage(){
    $('app-welcome').fadeOut('slow');
  }

}
