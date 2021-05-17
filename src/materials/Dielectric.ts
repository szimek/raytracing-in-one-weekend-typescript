import { Color } from '../utils/color';
import { HitRecord } from '../utils/HitRecord';
import { Material, Scattered } from '../utils/Material';
import { random } from '../utils/random';
import { Ray } from '../utils/Ray';
import { Vec3 } from '../utils/Vec3';

export class Dielectric extends Material {
  refractiveIndex: number;

  // Use Schlick's approximation for reflectance.
  static reflectance(cosine: number, refractiveIndex: number): number {
    const r0 = (1 - refractiveIndex) / (1 + refractiveIndex);
    const r0Squared = r0 * r0;
    return r0Squared + (1 - r0Squared) * (1 - cosine) ** 5;
  }

  constructor(refractiveIndex: number) {
    super();
    this.refractiveIndex = refractiveIndex;
  }

  scatter(hit: HitRecord, ray: Ray): Scattered | null {
    const attenuation = new Color(1.0, 1.0, 1.0);
    const refractionRatio = hit.frontFace
      ? 1.0 / this.refractiveIndex
      : this.refractiveIndex;

    const unitDirection = ray.direction.unit();
    const cosTheta = Math.min(unitDirection.negate().dot(hit.normal), 1.0);
    const sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);
    const canRefract = refractionRatio * sinTheta <= 1.0;
    let direction: Vec3;

    if (
      canRefract ||
      Dielectric.reflectance(cosTheta, refractionRatio) <= random()
    ) {
      direction = unitDirection.refract(hit.normal, refractionRatio);
    } else {
      direction = unitDirection.reflect(hit.normal);
    }

    const scattered = new Ray(hit.point, direction);

    return {
      ray: scattered,
      attenuation,
    };
  }
}
