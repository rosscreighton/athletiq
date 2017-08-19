/*
 * z = SQRT(r^2 - (x -h)^2) + k
 * solve the above circle equation for z given:
 * center of circle (h, k),
 * position (x) on diameter line of circle,
 * radius (r) of circle
 */
export function calcCircleZ(h, k, r, x) {
  return Math.sqrt(Math.pow(r, 2) - Math.pow(x - h, 2)) + k;
}
