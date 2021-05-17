import { Color } from './color';
import { HittableList } from './HittableList';
import { Point3 } from './Point3';
import { Vec3 } from './Vec3';

export class Ray {
  constructor(public origin: Point3, public direction: Vec3) {}

  at(t: number): Point3 {
    return this.origin.add(this.direction.scale(t));
  }

  color(scene: HittableList, remainingBounces = 1): Color {
    if (remainingBounces <= 0) {
      return new Color(0, 0, 0);
    }

    const hit = scene.hit(this, 0.001, Infinity);

    if (hit) {
      const target = hit.point.add(hit.normal).add(Vec3.randomInUnitSphere());
      const childRay = new Ray(hit.point, target.subtract(hit.point));

      return childRay.color(scene, remainingBounces - 1).scale(0.5);
    }

    // Scale Y to -1.0 ... 1.0
    const unitDirection = this.direction.unit();

    // Scale Y (as t) to 0.0 ... 1.0
    const t = 0.5 * (unitDirection.y + 1.0);

    const white = new Color(1.0, 1.0, 1.0); // start value
    const blue = new Color(0.5, 0.7, 1.0); // end value

    // Linear interpolation (LERP)
    // blendedValue = (1 − t) * startValue + t * endValue
    return white.scale(1.0 - t).add(blue.scale(t));
  }
}
