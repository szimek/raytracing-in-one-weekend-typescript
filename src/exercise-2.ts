import { Color, write } from './utils/Color';

(function () {
  const WIDTH = 256;
  const HEIGHT = 256;
  const MAX_COLOR = 255;

  let output = `P3\n${WIDTH} ${HEIGHT}\n${MAX_COLOR}\n`;

  for (let j = HEIGHT - 1; j >= 0; j--) {
    console.error(`\rScanlines remaining: ${j}`);

    for (let i = 0; i < WIDTH; i++) {
      output += write(new Color(i / (WIDTH - 1), j / (HEIGHT - 1), 0.25));
    }
  }

  console.log(output);

  console.error(`\nDone.\n`);
})();
