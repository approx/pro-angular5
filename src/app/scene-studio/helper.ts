import { Frustum,Vector3,Camera,Mesh,Matrix4} from 'three';

export const SceneHelper = {
  degree2rad(degree:number):number {
    let radian = (degree*Math.PI)/180;
    //console.log('degree :'+degree+' radian:'+radian);
    return radian;
  },
  RoundedSin(rad:number):number {
    var sin = Math.sin(rad);
    return Math.round(sin*100)/100;
  },
  RoundedCos(rad:number):number {
    var cos = Math.cos(rad);
    console.log(Math.round(cos*10000)/10000);
    return Math.round(cos*100)/100;
  },
  IsVisibleByCamera(position:Vector3,camera:Camera):boolean{
    let frustum = new Frustum();
    let cameraViewProjectionMatrix = new Matrix4();

    camera.updateMatrixWorld(false);
    camera.matrixWorldInverse.getInverse(camera.matrixWorld);
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
    frustum.setFromMatrix(cameraViewProjectionMatrix);

    return frustum.containsPoint(position);

  },
  GetMiddlePoint(mesh:Mesh):Vector3{
    let middle = new Vector3();
    let geometry = mesh.geometry;

    geometry.computeBoundingBox();

    middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
    middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
    middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

    mesh.localToWorld( middle );
    return middle;
  },
  VectorToScreen(vector:Vector3,camera:Camera):Vector3{
    vector.project(camera);
    vector.x = Math.round((vector.x + 1) * window.innerWidth /2);
    vector.y = Math.round(( -vector.y + 1) * window.innerHeight /2);
    vector.z = 0;

    return vector;
  }
}
