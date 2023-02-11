export default function toIndianCurrency(num) {
  if (!num) {
    return 0;
  }
  return num.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
}
export function numFormatter(num) {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(1) + "K";
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num < 900) {
    return num;
  }
}
