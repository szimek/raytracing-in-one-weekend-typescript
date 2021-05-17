import { Vec3 } from './Vec3';
import { Point3 } from './Point3';
import { Ray } from './Ray';

export class HitRecord {
  frontFace: boolean;

  constructor(public point: Point3, public normal: Vec3, public t: number) {}

  setFaceNormal(ray: Ray, outwardNormal: Vec3): void {
    this.frontFace = ray.direction.dot(outwardNormal) < 0;
    this.normal = this.frontFace ? outwardNormal : outwardNormal.negate();
  }
}
