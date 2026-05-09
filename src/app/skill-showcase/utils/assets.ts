export function publicAsset(path: string): string {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `/skill-showcase/${normalizedPath}`;
}
