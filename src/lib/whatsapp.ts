/** Returns null until an E.164-format WhatsApp number is configured. */
export function buildWhatsAppHref(number: string | undefined, message: string): string | null {
  if (!number || !/^[1-9]\d{7,14}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
