import { Color } from '../utils/color';
import { HitRecord } from '../utils/HitRecord';
import { Material, Scattered } from '../utils/Material';
import { Ray } from '../utils/Ray';
import { Vec3 } from '../utils/Vec3';

export class Metal extends Material {
  albedo: Color;
  fuzziness: number;

  constructor(albedo: Color, fuzziness = 0) {
    super();
    this.albedo = albedo;
    this.fuzziness = fuzziness;
  }

  scatter(hit: HitRecord, ray: Ray): Scattered | null {
    const reflected = ray.direction.unit().reflect(hit.normal);
    // const scattered = ray(rec.p, reflected + fuzz*random_in_unit_sphere());

    const scattered = new Ray(
      hit.point,
      reflected.add(Vec3.randomInUnitSphere().scale(this.fuzziness)),
    );

    if (scattered.direction.dot(hit.normal) <= 0) {
      return null;
    }

    return {
      attenuation: this.albedo,
      ray: scattered,
    };
  }
}
