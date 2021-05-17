import { Color } from '../utils/color';
import { HitRecord } from '../utils/HitRecord';
import { Material, Scattered } from '../utils/Material';
import { Ray } from '../utils/Ray';
import { Vec3 } from '../utils/Vec3';

export class Dielectric extends Material {
  refractionIndex: number;

  constructor(refractionIndex: number) {
    super();
    this.refractionIndex = refractionIndex;
  }

  scatter(hit: HitRecord, ray: Ray): Scattered | null {
    const attenuation = new Color(1.0, 1.0, 1.0);
    const refractionRatio = hit.frontFace
      ? 1.0 / this.refractionIndex
      : this.refractionIndex;

    const unitDirection = ray.direction.unit();
    const cosTheta = Math.min(unitDirection.negate().dot(hit.normal), 1.0);
    const sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);
    const canRefract = refractionRatio * sinTheta <= 1.0;
    let direction: Vec3;

    if (canRefract) {
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
