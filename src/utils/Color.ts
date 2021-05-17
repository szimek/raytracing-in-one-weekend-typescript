import { Vec3 } from './Vec3';

function clamp(x: number, min: number, max: number): number {
  if (x < min) return min;
  if (x > max) return max;
  return x;
}

function normalize(value: number): number {
  return Math.floor(256 * clamp(value, 0.0, 0.999));
}

// Alias for Vec3
export class Color extends Vec3 {}

export function write(color: Color, samplesPerPixelCount = 1): string {
  const { x, y, z } = color.scale(1 / samplesPerPixelCount);

  // Output translated [0,255] value of each color component.
  return `${normalize(x)} ${normalize(y)} ${normalize(z)}\n`;
}
