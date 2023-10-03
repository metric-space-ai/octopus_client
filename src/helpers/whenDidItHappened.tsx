export const whenDidItHappened = <T extends {}>(
  arr: Array<T>,
  keyString: string,
): {
  defaultValue: T[];
  today: T[] | undefined;
  yesterday: T[] | undefined;
  older: T[] | undefined;
  prev7Days: T[] | undefined;
} => {
  const key = keyString as never;
  if (arr.every((elem) => elem.hasOwnProperty(key))) {
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
      today: today ? today : undefined,
      yesterday: yesterday ? yesterday : undefined,
      older: older ? older : undefined,
      prev7Days: prev7Days ? prev7Days : undefined,
    };
  } else {
    console.error(`whenDidItHappened() : the key:${key} isn't exist in array:${arr}`);
    return {defaultValue: arr, today: undefined, yesterday: undefined, older: undefined, prev7Days: undefined};
  }
};
