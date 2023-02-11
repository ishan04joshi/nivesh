export function capsFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function debounce(limit, callback) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(callback, limit, args);
  };
}
export function percentage(x, y) {
  return 100 / (y / x);
}
export function toIndianCurrency(num) {
  if (!num) {
    return 0;
  }
  return num.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
}
