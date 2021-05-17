import { Color, write } from './utils/Color';
import { Point3 } from './utils/Point3';
import { HittableList } from './utils/HittableList';
import { Sphere } from './objects/Sphere';
import { Camera } from './utils/Camera';
import { random } from './utils/random';

(function () {
  // Image
  const ASPECT_RATIO = 16 / 9;
  const IMAGE_WIDTH = 400;
  const IMAGE_HEIGHT = Math.floor(IMAGE_WIDTH / ASPECT_RATIO);
  const MAX_COLOR = 255;
  const SAMPLES_PER_PIXEL = 25;

  // Scene
  const scene: HittableList = new HittableList();
  scene.add(new Sphere(new Point3(0, 0, -1), 0.5));
  scene.add(new Sphere(new Point3(0, -100.5, -1), 100));

  // Camera
  const camera = new Camera();

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
        pixelColor = pixelColor.add(ray.color(scene));
      }

      output += write(pixelColor, SAMPLES_PER_PIXEL);
    }
  }

  console.log(output);

  console.error(`\nDone.\n`);
})();
