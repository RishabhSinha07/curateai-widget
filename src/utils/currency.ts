/**
 * Format price with appropriate currency symbol
 */
export function formatPrice(price: number, currency: string): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    INR: '\u20B9',
    EUR: '\u20AC',
    GBP: '\u00A3',
    CAD: 'CA$',
    AUD: 'A$',
    JPY: '\u00A5',
    CNY: '\u00A5',
    KRW: '\u20A9',
  };

  const symbol = currencySymbols[currency.toUpperCase()] || currency;

  if (['JPY', 'KRW'].includes(currency.toUpperCase())) {
    return `${symbol}${price.toFixed(0)}`;
  }

  return `${symbol}${price.toFixed(2)}`;
}
