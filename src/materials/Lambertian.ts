import { Color } from '../utils/color';
import { HitRecord } from '../utils/HitRecord';
import { Material, Scattered } from '../utils/Material';
import { Ray } from '../utils/Ray';
import { Vec3 } from '../utils/Vec3';

export class Lambertian extends Material {
  albedo: Color;

  constructor(albedo: Color) {
    super();
    this.albedo = albedo;
  }

  scatter(hit: HitRecord): Scattered {
    let scatterDirection = hit.normal.add(Vec3.randomUnitVector());

    // Catch degenerate scatter direction when the generated random unit vector
    // is exactly opposite the normal vector.
    if (scatterDirection.isNearZero()) {
      scatterDirection = hit.normal;
    }

    const scattered = new Ray(hit.point, scatterDirection);

    return {
      attenuation: this.albedo,
      ray: scattered,
    };
  }
}
