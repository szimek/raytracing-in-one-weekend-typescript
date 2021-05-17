import { Color } from './color';
import { HitRecord } from './HitRecord';
import { Ray } from './Ray';

export type Scattered = { attenuation: Color; ray: Ray };

export abstract class Material {
  abstract scatter(hit: HitRecord, ray?: Ray): Scattered | null;
}
