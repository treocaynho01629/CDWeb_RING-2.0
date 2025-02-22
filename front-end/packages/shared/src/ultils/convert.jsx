export function idFormatter(id) {
  return "#" + ("00000" + id).slice(-5);
}

export function dateFormatter(date) {
  return date.toLocaleDateString("en-GB");
}

export function timeFormatter(date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const numFormat = new Intl.NumberFormat("vi-VN", {
  notation: "compact",
  compactDisplay: "short",
});

export const currencyFormat = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  currencyDisplay: "narrowSymbol",
});
