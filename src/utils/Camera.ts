import { Point3 } from './Point3';
import { Ray } from './Ray';
import { Vec3 } from './Vec3';

export class Camera {
  private origin: Point3;
  private lowerLeftCorner: Point3;
  private horizontal: Vec3;
  private vertical: Vec3;

  constructor() {
    const aspectRatio = 16.0 / 9.0;
    const viewportHeight = 2.0;
    const viewportWidth = aspectRatio * viewportHeight;
    const focalLength = 1.0;

    this.origin = new Point3(0, 0, 0);
    this.horizontal = new Vec3(viewportWidth, 0.0, 0.0);
    this.vertical = new Vec3(0.0, viewportHeight, 0.0);

    // To get the lower left corner of the screen,
    // we subtract from the origin (which is behind the screen, at its center)
    // the focal length (thus we move forward from the camera and end up in the center of the screen)
    // half of the screen width (we end up in the middle of the left edge of the screen)
    // half of the screen height (we end up in the lower left corner of the screen).
    this.lowerLeftCorner = this.origin
      .subtract(new Vec3(0, 0, focalLength))
      .subtract(this.horizontal.scale(0.5))
      .subtract(this.vertical.scale(0.5));
  }

  rayTo(u: number, v: number): Ray {
    return new Ray(
      this.origin,
      this.lowerLeftCorner
        .add(this.horizontal.scale(u))
        .add(this.vertical.scale(v))
        .subtract(this.origin),
    );
  }
}
