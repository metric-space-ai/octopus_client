// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const whenDidItHappened = <T extends Record<string, any>>(
  arr: Array<T>,
  keyString: string,
): {
  defaultValue: T[];
  today: T[] | undefined;
  yesterday: T[] | undefined;
  older: T[] | undefined;
  prev7Days: T[] | undefined;
} => {
  // Ensure the keyString is a valid property on the objects in the array
  const key = keyString as keyof T;

  if (arr.every((elem) => Object.prototype.hasOwnProperty.call(elem, key))) {
    const now = new Date();
    const fromToday = now.setHours(0, 0, 0, 0);
    const fromYesterday = new Date(new Date().setDate(now.getDate() - 1)).setHours(0, 0, 0, 0);
    const fromPrev7Days = new Date(new Date().setDate(now.getDate() - 7)).setHours(0, 0, 0, 0);

    const today = arr.filter((ticket) => new Date(ticket[key]).toDateString() === new Date().toDateString());
    const yesterday = arr.filter(
      (ticket) => new Date(ticket[key]).getTime() >= fromYesterday && new Date(ticket[key]).getTime() < fromToday,
    );
    const prev7Days = arr.filter(
      (ticket) => new Date(ticket[key]).getTime() >= fromPrev7Days && new Date(ticket[key]).getTime() < fromYesterday,
    );
    const older = arr.filter((ticket) => new Date(ticket[key]).getTime() < fromPrev7Days);

    return {
      defaultValue: arr,
      today: today.length > 0 ? today : undefined,
      yesterday: yesterday.length > 0 ? yesterday : undefined,
      older: older.length > 0 ? older : undefined,
      prev7Days: prev7Days.length > 0 ? prev7Days : undefined,
    };
  } else {
    console.error(`whenDidItHappened() : the key:${key as string} isn't exist in array:${arr}`);
    return {defaultValue: arr, today: undefined, yesterday: undefined, older: undefined, prev7Days: undefined};
  }
};
