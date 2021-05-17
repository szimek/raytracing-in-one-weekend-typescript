import { HitRecord } from './HitRecord';
import { Hittable } from './Hittable';
import { Ray } from './Ray';

export class HittableList {
  objects: Hittable[] = [];

  add(object: Hittable): void {
    this.objects.push(object);
  }

  clear(): void {
    this.objects = [];
  }

  hit(ray: Ray, tMin: number, tMax: number): HitRecord | null {
    let closestHit: HitRecord | null = null;

    for (const object of this.objects) {
      const objectHit = object.hit(ray, tMin, closestHit?.t ?? tMax);

      if (objectHit) {
        closestHit = objectHit;
      }
    }

    return closestHit;
  }
}
