/**
 * Format a price stored in pence to a GBP string
 * e.g. formatPrice(1050) → "£10.50"
 */
export function formatPrice(pence: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(pence / 100);
  }
  
  /**
   * Convert pounds (from Sanity) to pence (for Stripe and DB)
   * e.g. poundsToPence(10.5) → 1050
   */
  export function poundsToPence(pounds: number): number {
    return Math.round(pounds * 100);
  }