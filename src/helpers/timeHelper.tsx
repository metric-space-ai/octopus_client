export function diff_minutes(until: Date, from: Date) {
  let diff = (until.getTime() - from.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}
