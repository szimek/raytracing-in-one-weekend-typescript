export function random(min = 0, max = 1): number {
  return min + (max - min) * Math.random();
}
