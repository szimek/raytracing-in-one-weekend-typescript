import { Color, write } from './utils/Color';
import { Point3 } from './utils/Point3';
import { HittableList } from './utils/HittableList';
import { Sphere } from './objects/Sphere';
import { Camera } from './utils/Camera';
import { random } from './utils/random';
import { Lambertian } from './materials/Lambertian';
import { Metal } from './materials/Metal';
import { Dielectric } from './materials/Dielectric';
import { Vec3 } from './utils/Vec3';

function randomScene(): HittableList {
  const scene = new HittableList();

  // Ground
  const groundMaterial = new Lambertian(new Color(0.5, 0.5, 0.5));
  const ground = new Sphere(new Point3(0, -1000, 0), 1000, groundMaterial);
  scene.add(ground);

  for (let a = -11; a < 11; a++) {
    for (let b = -11; b < 11; b++) {
      const chooseMaterial = random();
      const center = new Point3(a + 0.9 * random(), 0.2, b + 0.9 * random());

      if (center.subtract(new Point3(4, 0.2, 0)).length() > 0.9) {
        if (chooseMaterial < 0.8) {
          // Diffuse
          const albedo = Color.random().multiply(Color.random());
          const sphereMaterial = new Lambertian(albedo);
          scene.add(new Sphere(center, 0.2, sphereMaterial));
        } else if (chooseMaterial < 0.95) {
          // Metal
          const albedo = Color.random(0.5, 1);
          const fuzziness = random(0, 0.5);
          const sphereMaterial = new Metal(albedo, fuzziness);
          scene.add(new Sphere(center, 0.2, sphereMaterial));
        } else {
          // Glass
          const sphereMaterial = new Dielectric(1.5);
          scene.add(new Sphere(center, 0.2, sphereMaterial));
        }
      }
    }
  }

  const material1 = new Dielectric(1.5);
  scene.add(new Sphere(new Point3(0, 1, 0), 1.0, material1));

  const material2 = new Lambertian(new Color(0.4, 0.2, 0.1));
  scene.add(new Sphere(new Point3(-4, 1, 0), 1.0, material2));

  const material3 = new Metal(new Color(0.7, 0.6, 0.5), 0.0);
  scene.add(new Sphere(new Point3(4, 1, 0), 1.0, material3));

  return scene;
}

(function () {
  // Image
  const ASPECT_RATIO = 16 / 9;
  const IMAGE_WIDTH = 256;
  const IMAGE_HEIGHT = Math.floor(IMAGE_WIDTH / ASPECT_RATIO);
  const MAX_COLOR = 255;
  const SAMPLES_PER_PIXEL = 100;
  const MAX_BOUNCES = 50;

  // Scene
  const scene = randomScene();

  // Camera
  const lookFrom = new Point3(13, 2, 3);
  const lookAt = new Point3(0, 0, 0);
  const viewUp = new Vec3(0, 1, 0);
  const focusDistance = 10;
  const aperture = 0.1;
  const fov = 20;
  const aspectRatio = ASPECT_RATIO;
  const camera = new Camera(
    lookFrom,
    lookAt,
    viewUp,
    fov,
    aspectRatio,
    aperture,
    focusDistance,
  );

  // Render
  let output = `P3\n${IMAGE_WIDTH} ${IMAGE_HEIGHT}\n${MAX_COLOR}\n`;

  for (let j = IMAGE_HEIGHT - 1; j >= 0; j--) {
    console.error(`\rScanlines remaining: ${j}`);

    for (let i = 0; i < IMAGE_WIDTH; i++) {
      let pixelColor = new Color(0, 0, 0);

      for (let s = 0; s < SAMPLES_PER_PIXEL; s++) {
        const u = (i + random()) / (IMAGE_WIDTH - 1); // 0 ... 1
        const v = (j + random()) / (IMAGE_HEIGHT - 1); // 0 ... 1

        const ray = camera.rayTo(u, v);
        pixelColor = pixelColor.add(ray.color(scene, MAX_BOUNCES));
      }

      output += write(pixelColor, SAMPLES_PER_PIXEL);
    }
  }

  console.log(output);

  console.error(`\nDone.\n`);
})();
