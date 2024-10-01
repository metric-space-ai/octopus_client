import {useEffect, useState} from 'react';

const useCustomCronDescription = (schedule: string) => {
  const [description, setDescription] = useState<string>('Unknown schedule');

  const parseCron = (cron: string) => {
    const parts = cron.split(' ');

    // Check if it's a 5-part or 6-part cron expression
    if (parts.length !== 5 && parts.length !== 6) {
      return 'Invalid schedule format';
    }

    // If the cron has 6 parts, skip the first (which is the seconds)
    const [_, minute, hour, dayOfMonth, month, dayOfWeek] = parts.length === 6 ? parts : ['0', ...parts];

    // Define description parts based on different fields
    const descParts: string[] = [];

    // Minute
    if (minute === '*' || minute === '0') {
      descParts.push('At the start of each hour');
    } else if (minute.includes('/')) {
      descParts.push(`Every ${minute.split('/')[1]} min`);
    } else {
      descParts.push(`At minute ${minute}`);
    }

    // Hour
    if (hour === '*') {
      descParts.push('Every hour');
    } else if (hour.includes('/')) {
      descParts.push(`Every ${hour.split('/')[1]} hours`);
    } else {
      descParts.push(`At hour ${hour}`);
    }

    // Day of Month
    if (dayOfMonth === '*') {
      descParts.push('Every day');
    } else if (dayOfMonth.includes(',')) {
      descParts.push(`On days ${dayOfMonth}`);
    } else {
      descParts.push(`On ${dayOfMonth}th`);
    }

    // Month
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (month === '*') {
      descParts.push('Every month');
    } else if (month.includes(',')) {
      const monthNumbers = month.split(',').map((m) => monthNames[parseInt(m, 10) - 1]);
      descParts.push(`In ${monthNumbers.join(', ')}`);
    } else {
      descParts.push(`In ${monthNames[parseInt(month, 10) - 1]}`);
    }

    // Day of Week
    if (dayOfWeek === '*') {
      descParts.push('Every day of the week');
    } else if (dayOfWeek.includes(',')) {
      descParts.push(`On days ${dayOfWeek}`);
    } else if (dayOfWeek === '1-5') {
      descParts.push('On weekdays');
    } else if (dayOfWeek === '0') {
      descParts.push('On Sunday');
    }

    return descParts.join(', ');
  };

  useEffect(() => {
    setDescription(parseCron(schedule));
  }, [schedule]);

  return description;
};

export default useCustomCronDescription;
