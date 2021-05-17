import { Color } from '../utils/color';
import { HitRecord } from '../utils/HitRecord';
import { Material, Scattered } from '../utils/Material';
import { Ray } from '../utils/Ray';

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
    const refracted = unitDirection.refract(hit.normal, refractionRatio);

    const scattered = new Ray(hit.point, refracted);

    return {
      ray: scattered,
      attenuation,
    };
  }
}
