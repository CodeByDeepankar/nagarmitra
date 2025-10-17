// Simple date formatting utility to avoid external dependencies
export const format = (date: Date, formatStr: string): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthsFull = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const pad = (num: number) => num.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hours12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Simple format string parsing
  switch (formatStr) {
    case 'MMM dd, yyyy':
      return `${months[month]} ${pad(day)}, ${year}`;
    case 'PPP':
      return `${monthsFull[month]} ${day}, ${year}`;
    case 'PPpp':
      return `${monthsFull[month]} ${day}, ${year} at ${hours12}:${pad(minutes)} ${ampm}`;
    default:
      return date.toLocaleDateString();
  }
};
