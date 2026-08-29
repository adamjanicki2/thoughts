export function idify(str: string, maxLength: number | undefined) {
  return str
    .replace(/(\s+|%20)+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase()
    .split("-")
    .slice(0, maxLength)
    .join("-");
}

export function formatDate(created: string) {
  const date = new Date(created);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    year: "numeric",
  });
}
