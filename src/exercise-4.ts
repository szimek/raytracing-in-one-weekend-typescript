import { Color, write } from './utils/Color';
import { Ray } from './utils/Ray';
import { Point3 } from './utils/Point3';
import { Vec3 } from './utils/Vec3';

// https://raytracing.github.io/books/RayTracingInOneWeekend.html#addingasphere/ray-sphereintersection
function hasHitSphere(center: Point3, radius: number, ray: Ray): boolean {
  const oc = ray.origin.subtract(center);
  const a = ray.direction.dot(ray.direction);
  const b = 2.0 * oc.dot(ray.direction);
  const c = oc.dot(oc) - radius * radius;
  const discriminant = b * b - 4 * a * c;

  return discriminant > 0;
}

function rayColor(ray: Ray): Color {
  const sphereCenter = new Point3(0, 0, -1);
  const sphereRadius = 0.5;

  if (hasHitSphere(sphereCenter, sphereRadius, ray)) {
    return new Color(1, 0, 0);
  }

  // Scale Y to -1.0 ... 1.0
  const unitDirection = ray.direction.unit();

  // Scale Y (as t) to 0.0 ... 1.0
  const t = 0.5 * (unitDirection.y + 1.0);

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
