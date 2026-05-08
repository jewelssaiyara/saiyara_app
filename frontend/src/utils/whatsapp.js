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
