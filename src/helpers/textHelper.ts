export const isLongTextWithoutSpaces = (text: string, length = 30): boolean => {
  const words = text.split(/\s+/);
  return words.every((word) => word.length > length);
};
