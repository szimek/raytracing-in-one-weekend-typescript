import { Color, write } from './utils/Color';
import { Ray } from './utils/Ray';
import { Point3 } from './utils/Point3';
import { Vec3 } from './utils/Vec3';

// https://raytracing.github.io/books/RayTracingInOneWeekend.html#addingasphere/ray-sphereintersection
function hasHitSphere(center: Point3, radius: number, ray: Ray): number {
  const oc = ray.origin.subtract(center);
  const a = ray.direction.lengthSquared();
  const halfB = oc.dot(ray.direction);
  const c = oc.lengthSquared() - radius * radius;
  const discriminant = halfB * halfB - a * c;

  if (discriminant < 0) {
    return -1.0;
  }

  return (-halfB - Math.sqrt(discriminant)) / a;
}

function rayColor(ray: Ray): Color {
  const sphereCenter = new Point3(0, 0, -1);
  const sphereRadius = 0.5;

  let t = hasHitSphere(sphereCenter, sphereRadius, ray);

  if (t > 0.0) {
    const normal = ray.at(t).subtract(sphereCenter).unit();

    return new Color(normal.x + 1, normal.y + 1, normal.z + 1).scale(0.5);
  }

  // Scale Y to -1.0 ... 1.0
  const unitDirection = ray.direction.unit();

  // Scale Y (as t) to 0.0 ... 1.0
  t = 0.5 * (unitDirection.y + 1.0);

  const white = new Color(1.0, 1.0, 1.0); // start value
  const blue = new Color(0.5, 0.7, 1.0); // end value

  // Linear interpolation (LERP)
  // blendedValue = (1 − t) * startValue + t * endValue
  return white.scale(1.0 - t).add(blue.scale(t));
}

(function () {
  // Image
  const ASPECT_RATIO = 16 / 9;
  const IMAGE_WIDTH = 400;
  const IMAGE_HEIGHT = Math.floor(IMAGE_WIDTH / ASPECT_RATIO);
  const MAX_COLOR = 255;

  // Camera
  const VIEWPORT_HEIGHT = 2.0;
  const VIEWPORT_WIDTH = ASPECT_RATIO * VIEWPORT_HEIGHT;
  const FOCAL_LENGTH = 1.0;

  const origin = new Point3(0, 0, 0); // where the camera is
  const vertical = new Vec3(0, VIEWPORT_HEIGHT, 0); // 0, 2, 0
  const horizontal = new Vec3(VIEWPORT_WIDTH, 0, 0); // 3.56, 0, 0

  // To get the lower left corner of the screen,
  // we subtract from the origin (which is behind the screen, at its center)
  // the focal length (thus we move forward from the camera and end up in the center of the screen)
  // half of the screen width (we end up in the middle of the left edge of the screen)
  // half of the screen height (we end up in the lower left corner of the screen).
  const lowerLeftCorner = origin
    .subtract(new Vec3(0, 0, FOCAL_LENGTH))
    .subtract(horizontal.scale(0.5))
    .subtract(vertical.scale(0.5));

  // Render
  let output = `P3\n${IMAGE_WIDTH} ${IMAGE_HEIGHT}\n${MAX_COLOR}\n`;

  for (let j = IMAGE_HEIGHT - 1; j >= 0; j--) {
    console.error(`\rScanlines remaining: ${j}`);

    for (let i = 0; i < IMAGE_WIDTH; i++) {
      const u = i / (IMAGE_WIDTH - 1); // 0 ... 1
      const v = j / (IMAGE_HEIGHT - 1); // 0 ... 1

      const ray = new Ray(
        origin,
        lowerLeftCorner
          .add(horizontal.scale(u))
          .add(vertical.scale(v))
          .subtract(origin),
      );
      const pixelColor = rayColor(ray);
      output += write(pixelColor);
    }
  }

  console.log(output);

  console.error(`\nDone.\n`);
})();
