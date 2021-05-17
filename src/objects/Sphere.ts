import { HitRecord } from '../utils/HitRecord';
import { Hittable } from '../utils/Hittable';
import { Material } from '../utils/Material';
import { Point3 } from '../utils/Point3';
import { Ray } from '../utils/Ray';

export class Sphere extends Hittable {
  center: Point3;
  radius: number;
  material: Material;

  constructor(center: Point3, radius: number, material: Material) {
    super();
    this.center = center;
    this.radius = radius;
    this.material = material;
  }

  hit(ray: Ray, tMin: number, tMax: number): HitRecord | null {
    const oc = ray.origin.subtract(this.center); // from ray to center
    const a = ray.direction.lengthSquared();
    const halfB = oc.dot(ray.direction);
    const c = oc.lengthSquared() - this.radius * this.radius;
    const discriminant = halfB * halfB - a * c;

    if (discriminant < 0) {
      return null;
    }

    const sqrtd = Math.sqrt(discriminant);

    // Find the nearest root that lies in the acceptable range.
    let root = (-halfB - sqrtd) / a;
    if (root < tMin || tMax < root) {
      root = (-halfB + sqrtd) / a;
      if (root < tMin || tMax < root) {
        return null;
      }
    }

    const point = ray.at(root);
    const normal = point.subtract(this.center).scale(1 / this.radius);

    const hit = new HitRecord(point, normal, root, this.material);
    const outwardNormal = hit.point
      .subtract(this.center)
      .scale(1 / this.radius);
    hit.setFaceNormal(ray, outwardNormal);

    return hit;
  }
}
