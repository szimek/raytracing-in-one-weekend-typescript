import { Color } from '../utils/color';
import { HitRecord } from '../utils/HitRecord';
import { Material, Scattered } from '../utils/Material';
import { Ray } from '../utils/Ray';

export class Metal extends Material {
  albedo: Color;

  constructor(albedo: Color) {
    super();
    this.albedo = albedo;
  }

  scatter(hit: HitRecord, ray: Ray): Scattered | null {
    const reflected = ray.direction.unit().reflect(hit.normal);
    const scattered = new Ray(hit.point, reflected);

    if (scattered.direction.dot(hit.normal) <= 0) {
      return null;
    }

    return {
      attenuation: this.albedo,
      ray: scattered,
    };
  }
}
