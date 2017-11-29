import {Object3D,Frustum,Matrix4,Math as THREEMath,MeshBasicMaterial,RepeatWrapping,LoadingManager,JSONLoader,TextureLoader,Texture,Vector3,WebGLRenderer,Scene,DirectionalLight,Light,Color,Raycaster,Camera,Material,Intersection,PerspectiveCamera,AmbientLight,Group,Mesh,SphereGeometry} from 'three';
import * as JQ from 'jquery';
import { HudObj } from './objs';
import { WebObj } from './webObj';
import { DeviceOrientationControls } from './deviceHelper';
import { OrbitControls } from 'three-orbitcontrols-ts';

class Ray{
  ray:Raycaster;
  from:{x:number,y:number};

  constructor(coord:{x:number,y:number}){
    this.ray = new Raycaster();
    this.from = coord;
  }

  Fire(camera:Camera){
    this.ray.setFromCamera(this.from,camera);
  }
}

export class SceneStudio{
  renderer:WebGLRenderer;
  scene:Scene;
  camera:PerspectiveCamera;
  ambientlight:AmbientLight;
  hud:JQuery;
  objects = [];
  hudObjs: HudObj[] = [];
  lights:Light[]=[];
  devicecontrols:DeviceOrientationControls;
  raycasters:Ray[]=[];
  controls:OrbitControls;

  constructor(backgroundColor:string, cameraPosition:Vector3,fov:number,element:JQuery) {
    let container = element.find('#container');
    this.hud = element.find('#hud');
    this.renderer = new WebGLRenderer({antialias:true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.outerWidth(),container.outerHeight());
    container[0].appendChild(this.renderer.domElement);

    this.scene = new Scene();

    this.scene.background = new Color(backgroundColor);

    this.camera = new PerspectiveCamera(fov,container[0].offsetWidth/container[0].offsetHeight,1,4000);

    this.camera.position.set(cameraPosition.x,cameraPosition.y,cameraPosition.z);

    this.scene.add(this.camera);

    this.ambientlight = new AmbientLight(0x404040);
    this.scene.add(this.ambientlight);

    this.renderer.autoClear = false;
  }


  Add(obj:WebObj | HudObj | Group):void{
    if(obj instanceof WebObj){
      this.scene.add(obj.mesh);
      this.objects.push(obj);
    }
    if(obj instanceof Group){
      for (var i = 0; i < obj.children.length; i++) {
        if(obj.children[i] instanceof Mesh){
          this.scene.add(obj);
          this.objects.push(obj);
        }
      }
    }
    if(obj instanceof HudObj){
      this.hudObjs.push(obj);
    }
    console.log('object added')
  }

  static CreateSphere(radius:number,horizontalSeg:number,verticalSeg:number,material:Material,scene:SceneStudio): WebObj{
    let geometry = new SphereGeometry(radius,horizontalSeg,verticalSeg);
    let  mesh = new Mesh(geometry,material);
    let webobj = new WebObj(mesh)
    scene.Add(webobj);
    return webobj;
  }

  RayIntersects(rayCaster:Raycaster,group?:Group):Intersection[]{
    let intersects;
    if(group){
      intersects = rayCaster.intersectObject(group);
    }
    else{
      rayCaster.intersectObjects(this.scene.children);
    }
    return intersects;
  }

  EnableDeviceControls():void{
    this.devicecontrols = new DeviceOrientationControls(this.camera);
  }

  FireRayCasters():void{
    for (let i = 0; i < this.raycasters.length; i++) {
        this.raycasters[i].Fire(this.camera);
    }
  }

  AddRayCaster(from:{x:number,y:number}):Ray{
    let ray = new Ray(from);
    this.raycasters.push(ray);
    return ray;
  }

  CreateDirectionalLight():DirectionalLight{
    let light = new DirectionalLight(0xffffff,1.5);
    this.lights.push(light);
    this.scene.add(light);
    return light;
  }

  LoadTexture(imgUrl:string): Promise<Texture> {
    return new Promise((resolve)=>{
      let texture = new TextureLoader().load(imgUrl,(texture)=>{
        resolve(texture);
      })
    })
  }

  LoadJsonObj(objUrl:string,texture?:Texture,group?:Group): Promise<WebObj>{
    return new Promise((resolve,reject)=>{
      let manager = new LoadingManager();
      manager.onProgress = (item,loaded,total)=>{
        console.log(item,loaded,total);
      }

      let loader = new JSONLoader(manager);
      loader.load(objUrl,(geometry,materials)=>{
        let material;

        if(texture){
          texture.wrapS=texture.wrapT=RepeatWrapping;
          texture.anisotropy = 16;
          material = new MeshBasicMaterial({map:texture});
        }
        else{
          material = new MeshBasicMaterial();
        }

        let mesh = new Mesh(geometry,material);
        let obj = new WebObj(mesh);
        if(group){
          group.add(mesh);
          this.objects.push(obj);
        }
        else{
          this.Add(obj);
        }
        resolve(obj);
      },(event)=>{
        if(event.lengthComputable){
          let percentComplete = event.loaded/event.total * 100;
          console.log(Math.round(percentComplete)+'% loaded');
        }
      },(event)=>{
        reject('some error happens on load json object');
      });
    })
  }

  Render():void{
    this.renderer.render(this.scene,this.camera);
  }

  AddOrbitControls():OrbitControls{
    this.controls = new OrbitControls(this.camera,this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    return this.controls;
  }

  AddMouseControlCamera():void{
    let mouseControlCamera=false;
    let mouseX=10,onMouseDownLon=0;
    let mouseY=0,onMouseDownLat=0;
    let deltaMoveX=0,deltaMovey=0,lon=180,lat=0;
    let target = new Vector3(0,0,0);
    this.hud.on('mousedown',(event)=>{
      event.preventDefault();
      mouseControlCamera=true;
      mouseX=event.clientX;
      mouseY=event.clientY;
      onMouseDownLon = lon;
      onMouseDownLat = lat;
    }).on('mouseup',(event)=>{
      mouseControlCamera=false;
    }).on('mousemove',(event)=>{
      if(mouseControlCamera){
        lon = ( mouseX - event.clientX ) * 0.05 + onMouseDownLon;
        lat = ( event.clientY - mouseY ) * 0.05 + onMouseDownLat;
        lat = Math.max( - 85, Math.min( 85, lat ) );
        let phi = THREEMath.degToRad( 90 - lat );
        let theta = THREEMath.degToRad( lon );
        target.x = 500 * Math.sin( phi ) * Math.cos( theta );
        target.y = 500 * Math.cos( phi );
        target.z = 500 * Math.sin( phi ) * Math.sin( theta );
        this.camera.lookAt( target );
      }
    });
    lat = Math.max( - 85, Math.min( 85, lat ) );
    let phi = THREEMath.degToRad( 90 - lat );
    let theta = THREEMath.degToRad( lon );
    target.x = 500 * Math.sin( phi ) * Math.cos( theta );
    target.y = 500 * Math.cos( phi );
    target.z = 500 * Math.sin( phi ) * Math.sin( theta );
    this.camera.lookAt( target );
  }

  RemoveMouserControll():void{
    this.hud.off('mouseup mousemove mousedown');
  }

  LookAt(obj:Object3D|Vector3):void{
    if(obj instanceof Object3D){
      this.camera.lookAt(obj.position);
    }
    else if(obj instanceof Vector3){
      this.camera.lookAt(obj);
    }
  }

  OnWindowResize():void{
    this.camera.aspect=window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  Run():void{
    this.FireRayCasters();
    if(('onorientationchange' in window)){
      this.devicecontrols.update();
    }

    for (let i = 0; i < this.objects.length; i++) {
        this.objects[i].update();
    }
    for (let i = 0; i < this.hudObjs.length; i++) {
        this.hudObjs[i].update();
    }

    this.renderer.clear();
    this.renderer.render(this.scene,this.camera);
    requestAnimationFrame(()=>{
      if(this.controls){
        this.controls.update();
      }
      this.Run();
    });
  }

  StartRendering():void{
    this.Run();
    for (let i = 0; i < this.objects.length; i++) {
        this.objects[i].start();
    }
    for (let i = 0; i < this.hudObjs.length; i++) {
        this.hudObjs[i].start();
    }
  }

  private RecursiveSmoothLokAt(position:Vector3,index:number,quantite:0.01,callback?:()=>void){
    let lerped = new Vector3();
    if(index<0.5){
      let projectedPosition = new Vector3((<any>window).offsetWidth/2,(<any>window).offsetHeight/2,-1).unproject(this.camera);
      lerped.lerpVectors(projectedPosition,position,index+quantite);
      this.camera.lookAt(lerped);
      requestAnimationFrame(()=>{
        this.RecursiveSmoothLokAt(position,index+quantite,quantite,callback);
      })
    }
    else{
      if(callback){
        callback();
      }
    }
  }

  SmoothLookAt(position:Vector3,callback?:()=>void){
    this.RecursiveSmoothLokAt(position,0,0.01,callback);
  }

}
