import { Color, write } from './utils/Color';
import { Point3 } from './utils/Point3';
import { HittableList } from './utils/HittableList';
import { Sphere } from './objects/Sphere';
import { Camera } from './utils/Camera';
import { random } from './utils/random';
import { Lambertian } from './materials/Lambertian';
import { Metal } from './materials/Metal';
import { Dielectric } from './materials/Dielectric';

(function () {
  // Image
  const ASPECT_RATIO = 16 / 9;
  const IMAGE_WIDTH = 400;
  const IMAGE_HEIGHT = Math.floor(IMAGE_WIDTH / ASPECT_RATIO);
  const MAX_COLOR = 255;
  const SAMPLES_PER_PIXEL = 25;
  const MAX_BOUNCES = 50;

  // Scene
  const scene: HittableList = new HittableList();

  const materialGround = new Lambertian(new Color(0.8, 0.8, 0.0));
  const materialCenter = new Lambertian(new Color(0.1, 0.2, 0.5));
  const materialLeft = new Dielectric(1.5);
  const materialRight = new Metal(new Color(0.8, 0.6, 0.2), 0.0);

  scene.add(new Sphere(new Point3(0.0, -100.5, -1.0), 100.0, materialGround));
  scene.add(new Sphere(new Point3(0.0, 0.0, -1.0), 0.5, materialCenter));
  scene.add(new Sphere(new Point3(-1.0, 0.0, -1.0), 0.5, materialLeft));
  scene.add(new Sphere(new Point3(-1.0, 0.0, -1.0), -0.4, materialLeft));
  scene.add(new Sphere(new Point3(1.0, 0.0, -1.0), 0.5, materialRight));

  // Camera
  const fov = 45;
  const aspectRatio = 16 / 9;
  const camera = new Camera(fov, aspectRatio);

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
