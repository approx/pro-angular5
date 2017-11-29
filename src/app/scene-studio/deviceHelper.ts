import {Vector3,Camera,Euler,Quaternion,Math as THREEMath} from 'three';

export class DeviceOrientationControls{
  object:Camera;
  enabled: boolean;
  deviceOrientation:any;
  screenOrientation:string|number = 0;
  alphaOffset:number = 0;

  constructor(object:Camera){
    this.object = object;
    this.object.rotation.reorder( "YXZ" );
    this.connect();
  }

  onDeviceOrientationChangeEvent(event:Event):void{
    this.deviceOrientation = event;
  };

  onScreenOrientationChangeEvent():void{
    this.screenOrientation = window.orientation || 0;
  }

  static setObjectQuaternion():(quaternion,alpha,beta,gamma,orient)=>void{
    let zee = new Vector3(0,0,1);
    let euler = new Euler();
    let q0 = new Quaternion();
    let q1 = new Quaternion(-Math.sqrt(0.5),0,0,Math.sqrt(0.5));

    return function(quaternion,alpha,beta,gamma,orient){
      euler.set(beta,alpha,-gamma,'YXZ');
      quaternion.setFromEuler(euler);
      quaternion.multiply(q1);
      quaternion.multiply(q0.setFromAxisAngle(zee,-orient));
    }
  }

  connect():void{
    this.onScreenOrientationChangeEvent();

    window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent,false);
    window.addEventListener('deviceorientation', this.onScreenOrientationChangeEvent,false);

    this.enabled = true;
  }

  disconnect():void{
    window.removeEventListener('orientationchange', this.onScreenOrientationChangeEvent,false);
    window.removeEventListener('deviceorientation', this.onScreenOrientationChangeEvent,false);

    this.enabled = false;
  }

  update():void{
    if(this.enabled===false) return;

    var alpha = this.deviceOrientation.alpha ? THREEMath.degToRad(this.deviceOrientation.alpha) + this.alphaOffset : 0;
    var beta = this.deviceOrientation.beta ? THREEMath.degToRad( this.deviceOrientation.beta ) : 0; // X'
		var gamma = this.deviceOrientation.gamma ? THREEMath.degToRad( this.deviceOrientation.gamma ) : 0; // Y''

    if(typeof this.screenOrientation == 'number'){
    var orient = this.screenOrientation ? THREEMath.degToRad( this.screenOrientation ) : 0;
    }

    DeviceOrientationControls.setObjectQuaternion()(this.object.quaternion, alpha, beta, gamma, orient);
  }

  dispose():void{
    this.disconnect();
  }

}
