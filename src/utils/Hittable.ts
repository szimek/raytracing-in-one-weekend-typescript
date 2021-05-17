import { HitRecord } from './HitRecord';
import { Ray } from './Ray';

export abstract class Hittable {
  abstract hit(ray: Ray, tMin: number, tMax: number): HitRecord | null;
}
