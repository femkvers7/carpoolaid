// utils/formatDate.ts
export function formatTimestamp(timestamp: string | number | Date): string {
  const date = new Date(timestamp);

  // Helper function to add leading zeros to single digit numbers
  const pad = (n: number) => (n < 10 ? "0" + n : n);

  // Get parts of the date
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  // Format the date as "YYYY-MM-DD HH:MM:SS"
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
