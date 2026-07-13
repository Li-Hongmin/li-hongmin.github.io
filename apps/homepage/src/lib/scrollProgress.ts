export function getLaunchProgress(scrollTop: number, viewportHeight: number) {
  if (viewportHeight <= 0) return 0;
  return Math.min(1, Math.max(0, scrollTop / viewportHeight));
}
