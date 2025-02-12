export function idFormatter(id) {
  return "#" + ("00000" + id).slice(-5);
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
