import { Color } from './color';
import { HittableList } from './HittableList';
import { Point3 } from './Point3';
import { Vec3 } from './Vec3';

export class Ray {
  constructor(public origin: Point3, public direction: Vec3) {}

  at(t: number): Point3 {
    return this.origin.add(this.direction.scale(t));
  }

  color(scene: HittableList): Color {
    const hit = scene.hit(this, 0, Infinity);

    if (hit) {
      return hit.normal.add(new Color(1, 1, 1)).scale(0.5);
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
