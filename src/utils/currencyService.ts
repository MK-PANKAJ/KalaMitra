export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'SGD' | 'AED';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  country: string;
  exchangeRate: number; // Rate relative to INR
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    country: 'India',
    exchangeRate: 1.0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    country: 'United States',
    exchangeRate: 0.012, // 1 INR = 0.012 USD (approx)
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    country: 'European Union',
    exchangeRate: 0.011, // 1 INR = 0.011 EUR (approx)
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    country: 'United Kingdom',
    exchangeRate: 0.0095, // 1 INR = 0.0095 GBP (approx)
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    country: 'Australia',
    exchangeRate: 0.018, // 1 INR = 0.018 AUD (approx)
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    country: 'Canada',
    exchangeRate: 0.016, // 1 INR = 0.016 CAD (approx)
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    country: 'Singapore',
    exchangeRate: 0.016, // 1 INR = 0.016 SGD (approx)
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    country: 'UAE',
    exchangeRate: 0.044, // 1 INR = 0.044 AED (approx)
  },
};

export class CurrencyConverter {
  private baseCurrency: CurrencyCode = 'INR';

  convertPrice(amountInINR: number, targetCurrency: CurrencyCode): number {
    const currency = CURRENCIES[targetCurrency];
    return amountInINR * currency.exchangeRate;
  }

  formatPrice(amount: number, currency: CurrencyCode): string {
    const curr = CURRENCIES[currency];
    const converted = currency === 'INR' ? amount : this.convertPrice(amount, currency);
    
    // Format based on currency
    switch (currency) {
      case 'INR':
        return `${curr.symbol}${converted.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
      default:
        return `${curr.symbol}${converted.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`;
    }
  }

  getPriceWithBothCurrencies(amountInINR: number, targetCurrency: CurrencyCode): string {
    if (targetCurrency === 'INR') {
      return this.formatPrice(amountInINR, 'INR');
    }
    
    const inrPrice = this.formatPrice(amountInINR, 'INR');
    const convertedPrice = this.formatPrice(amountInINR, targetCurrency);
    return `${convertedPrice} (${inrPrice})`;
  }

  // Simulated API call for real-time rates
  async fetchLiveRates(): Promise<Record<CurrencyCode, number>> {
    // In production, this would call a real exchange rate API
    // For now, return static rates
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      INR: 1.0,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      AUD: 0.018,
      CAD: 0.016,
      SGD: 0.016,
      AED: 0.044,
    };
  }

  detectUserCurrency(): CurrencyCode {
    // Try to detect from browser locale/timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    if (timezone.includes('America/New_York') || timezone.includes('America/Los_Angeles')) {
      return 'USD';
    }
    if (timezone.includes('Europe/London')) {
      return 'GBP';
    }
    if (timezone.includes('Europe/')) {
      return 'EUR';
    }
    if (timezone.includes('Australia/')) {
      return 'AUD';
    }
    if (timezone.includes('Asia/Singapore')) {
      return 'SGD';
    }
    if (timezone.includes('Asia/Dubai')) {
      return 'AED';
    }
    
    // Default to INR
    return 'INR';
  }

  getCurrencyByCountry(country: string): CurrencyCode {
    const countryMap: Record<string, CurrencyCode> = {
      'United States': 'USD',
      'USA': 'USD',
      'United Kingdom': 'GBP',
      'UK': 'GBP',
      'Australia': 'AUD',
      'Canada': 'CAD',
      'Singapore': 'SGD',
      'UAE': 'AED',
      'India': 'INR',
    };

    return countryMap[country] || 'INR';
  }
}

export const currencyConverter = new CurrencyConverter();
