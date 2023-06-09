export function padTo2Digits(num: number): string {
  return num.toString().padStart(2, '0');
}

// 👇️ format as "YYYY-MM-DD"
export function formatDateToString(date: Date): string {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-')
  );
}

export function formatTimeToString(dateTimeString: string): string {
  const timeElements = dateTimeString.split('T')[1].split(':');
  return `${timeElements[0]}:${timeElements[1]}`;
}
