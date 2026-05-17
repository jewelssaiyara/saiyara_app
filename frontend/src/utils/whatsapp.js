/** Same destination as product detail "Chat on WhatsApp". */
const WHATSAPP_PHONE = "919995206988";
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_PHONE}`;

const isIosDevice = () =>
  /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
  (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

export function buildProductInterestWhatsAppUrl(productPageUrl) {
  const text = `Hi! I'm interested in this product: ${productPageUrl}`;
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;
}

export function openProductInterestWhatsAppOnIos(event, productPageUrl) {
  if (!isIosDevice()) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const text = `Hi! I'm interested in this product: ${productPageUrl}`;
  window.location.href = `whatsapp://send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(text)}`;
}

function buildCartCheckoutMessage(items) {
  const lines = items.map((item, index) => {
    const qty =
      item.quantity > 1 ? ` (Qty: ${item.quantity})` : "";
    return `${index + 1}. ${item.name}${qty}\n${item.pageUrl}`;
  });
  return `Hi! I'd like to checkout the following items:\n\n${lines.join("\n\n")}`;
}

export function buildCartCheckoutWhatsAppUrl(items) {
  const text = buildCartCheckoutMessage(items);
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;
}

export function openCartCheckoutWhatsAppOnIos(event, items) {
  if (!isIosDevice()) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const text = buildCartCheckoutMessage(items);
  window.location.href = `whatsapp://send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(text)}`;
}
