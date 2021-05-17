import { Point3 } from './Point3';
import { Ray } from './Ray';
import { Vec3 } from './Vec3';

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export class Camera {
  private origin: Point3;
  private lowerLeftCorner: Point3;
  private horizontal: Vec3;
  private vertical: Vec3;
  private v: Vec3;
  private u: Vec3;
  private w: Vec3;
  private lensRadius: number;

  constructor(
    lookFrom: Point3,
    lookAt: Point3,
    viewUp: Vec3,
    fov: number,
    aspectRatio: number,
    aperture: number,
    focusDist: number,
  ) {
    const theta = degreesToRadians(fov);
    const h = Math.tan(theta / 2);
    const viewportHeight = 2.0 * h;
    const viewportWidth = aspectRatio * viewportHeight;

    this.w = lookFrom.subtract(lookAt).unit();
    this.u = viewUp.cross(this.w).unit();
    this.v = this.w.cross(this.u);

    this.origin = lookFrom;
    this.horizontal = this.u.scale(focusDist * viewportWidth);
    this.vertical = this.v.scale(focusDist * viewportHeight);
    this.horizontal = this.u.scale(viewportWidth);
    this.vertical = this.v.scale(viewportHeight);
    this.lowerLeftCorner = this.origin
      .subtract(this.horizontal.scale(0.5))
      .subtract(this.vertical.scale(0.5))
      .subtract(this.w.scale(focusDist));
    this.lensRadius = aperture / 2;
  }

  rayTo(s: number, t: number): Ray {
    const rd = Vec3.randomInUnitDisk().scale(this.lensRadius);
    const offset = this.u.scale(rd.x).add(this.v.scale(rd.y));

    return new Ray(
      this.origin.add(offset),
      this.lowerLeftCorner
        .add(this.horizontal.scale(s))
        .add(this.vertical.scale(t))
        .subtract(this.origin)
        .subtract(offset),
    );
  }
}
