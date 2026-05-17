export function getProductStockLimit(product) {
  if (!product || product.soldOut) {
    return 0;
  }
  const raw = product.stock;
  const n =
    raw === undefined || raw === null || raw === ""
      ? 1
      : Math.max(0, Math.floor(Number(raw)));
  return Number.isFinite(n) ? n : 0;
}

export function canAddProductToCart(product) {
  return getProductStockLimit(product) > 0;
}
