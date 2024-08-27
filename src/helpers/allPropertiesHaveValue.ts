// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function allPropertiesHaveValue(obj: Record<string, any>): boolean {
  for (const key in obj) {
    const value = obj[key];
    if (value === undefined || value === null || value === '') {
      return false;
    }
  }
  return true;
}
