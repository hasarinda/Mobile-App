//@flow

export function timestampToString(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

export function getSeconds(timestamp: number): string {
  const date = new Date(timestamp);
  return ("0" + date.getSeconds().toString()).slice(-2);
}

export function getMinutes(timestamp: number): string {
  const date = new Date(timestamp);
  return ("0" + date.getMinutes().toString()).slice(-2);
}
