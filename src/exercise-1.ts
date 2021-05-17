(function () {
  const WIDTH = 256;
  const HEIGHT = 256;
  const MAX_COLOR = 255;

  let output = `P3\n${WIDTH} ${HEIGHT}\n${MAX_COLOR}\n`;

  for (let j = HEIGHT - 1; j >= 0; j--) {
    console.error(`\rScanlines remaining: ${j}`);

    for (let i = 0; i < WIDTH; i++) {
      // Range 0-1
      const r = i / (WIDTH - 1);
      const g = j / (HEIGHT - 1);
      const b = 0.25;

      // Range 0-255
      const ir = Math.floor(255.999 * r);
      const ig = Math.floor(255.999 * g);
      const ib = Math.floor(255.999 * b);

      output += `${ir} ${ig} ${ib}\n`;
    }
  }

  console.log(output);

  console.error(`\nDone.\n`);
})();
