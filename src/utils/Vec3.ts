import { random } from './random';

export class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static random(min?: number, max?: number): Vec3 {
    return new Vec3(random(min, max), random(min, max), random(min, max));
  }

  static randomInUnitSphere(): Vec3 {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const v = Vec3.random(-1, 1);

      if (v.lengthSquared() < 1) {
        return v;
      }
    }
  }

  static randomUnitVector(): Vec3 {
    return Vec3.randomInUnitSphere().unit();
  }

  static randomInUnitDisk(): Vec3 {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const p = new Vec3(random(-1, 1), random(-1, 1), 0);
      if (p.lengthSquared() < 1) {
        return p;
      }
    }
  }

  negate(): Vec3 {
    return new Vec3(-this.x, -this.y, -this.z);
  }

  invert(): Vec3 {
    return new Vec3(1 / this.x, 1 / this.y, 1 / this.z);
  }

  add(other: Vec3): Vec3 {
    return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  subtract(other: Vec3): Vec3 {
    return this.add(other.negate());
  }

  multiply(other: Vec3): Vec3 {
    return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
  }

  divide(other: Vec3): Vec3 {
    return this.multiply(other.invert());
  }

  dot(other: Vec3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross(other: Vec3): Vec3 {
    return new Vec3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x,
    );
  }

  scale(factor: number): Vec3 {
    return new Vec3(this.x * factor, this.y * factor, this.z * factor);
  }

  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  unit(): Vec3 {
    return this.scale(1.0 / this.length());
  }

  isNearZero(): boolean {
    const s = 1e-8;

    return Math.abs(this.x) < s && Math.abs(this.y) < s && Math.abs(this.z) < s;
  }

  reflect(normal: Vec3): Vec3 {
    return this.subtract(normal.scale(this.dot(normal)).scale(2));
  }

  refract(normal: Vec3, etaiOverEtat: number): Vec3 {
    const unit = this.unit();
    const cosTheta = Math.min(unit.negate().dot(normal), 1.0);
    const perpendicular = this.add(normal.scale(cosTheta)).scale(etaiOverEtat);
    const parallel = normal.scale(
      -Math.sqrt(Math.abs(1.0 - perpendicular.lengthSquared())),
    );

    return perpendicular.add(parallel);
  }
}
