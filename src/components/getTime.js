export function getModifiedTime(date) {
  return new Date(date).toLocaleTimeString(
    [],
    {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}