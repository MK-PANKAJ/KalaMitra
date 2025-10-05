export type ShippingMethod = 'standard' | 'express' | 'priority';
export type ShippingZone = 'domestic' | 'international-asia' | 'international-europe' | 'international-americas' | 'international-oceania';

export interface ShippingRate {
  method: ShippingMethod;
  name: string;
  estimatedDays: string;
  cost: number; // in INR
  tracking: boolean;
  insurance: boolean;
}

export interface ShippingCalculation {
  destination: string;
  zone: ShippingZone;
  weight: number; // in kg
  rates: ShippingRate[];
  customsDuty?: number;
  estimatedTax?: number;
}

export interface ShippingAddress {
  country: string;
  state?: string;
  city?: string;
  postalCode?: string;
}

export class ShippingService {
  private baseRates: Record<ShippingZone, Record<ShippingMethod, number>> = {
    'domestic': {
      standard: 50,
      express: 150,
      priority: 300,
    },
    'international-asia': {
      standard: 500,
      express: 1200,
      priority: 2500,
    },
    'international-europe': {
      standard: 800,
      express: 2000,
      priority: 4000,
    },
    'international-americas': {
      standard: 900,
      express: 2200,
      priority: 4500,
    },
    'international-oceania': {
      standard: 850,
      express: 2100,
      priority: 4200,
    },
  };

  calculateShipping(address: ShippingAddress, weightKg: number): ShippingCalculation {
    const zone = this.determineZone(address.country);
    const rates = this.getRatesForZone(zone, weightKg);

    const calculation: ShippingCalculation = {
      destination: address.country,
      zone,
      weight: weightKg,
      rates,
    };

    // Add customs duty for international shipments
    if (zone !== 'domestic') {
      calculation.customsDuty = this.estimateCustomsDuty(address.country);
      calculation.estimatedTax = this.estimateTax(address.country);
    }

    return calculation;
  }

  private determineZone(country: string): ShippingZone {
    const normalizedCountry = country.toLowerCase();

    // Domestic
    if (normalizedCountry === 'india') {
      return 'domestic';
    }

    // Asia
    const asiaCountries = ['china', 'japan', 'singapore', 'thailand', 'malaysia', 'vietnam', 'south korea', 'indonesia', 'philippines', 'bangladesh', 'pakistan', 'nepal', 'sri lanka', 'uae', 'saudi arabia'];
    if (asiaCountries.some(c => normalizedCountry.includes(c))) {
      return 'international-asia';
    }

    // Europe
    const europeCountries = ['uk', 'united kingdom', 'france', 'germany', 'italy', 'spain', 'netherlands', 'belgium', 'switzerland', 'austria', 'sweden', 'norway', 'denmark', 'poland'];
    if (europeCountries.some(c => normalizedCountry.includes(c))) {
      return 'international-europe';
    }

    // Americas
    const americasCountries = ['usa', 'united states', 'canada', 'mexico', 'brazil', 'argentina', 'chile'];
    if (americasCountries.some(c => normalizedCountry.includes(c))) {
      return 'international-americas';
    }

    // Oceania
    const oceaniaCountries = ['australia', 'new zealand'];
    if (oceaniaCountries.some(c => normalizedCountry.includes(c))) {
      return 'international-oceania';
    }

    // Default to Asia for other countries
    return 'international-asia';
  }

  private getRatesForZone(zone: ShippingZone, weightKg: number): ShippingRate[] {
    const baseRates = this.baseRates[zone];
    const weightMultiplier = Math.max(1, Math.ceil(weightKg));

    const rates: ShippingRate[] = [];

    if (zone === 'domestic') {
      rates.push({
        method: 'standard',
        name: 'India Post Standard',
        estimatedDays: '5-7 days',
        cost: baseRates.standard * weightMultiplier,
        tracking: true,
        insurance: false,
      });
      rates.push({
        method: 'express',
        name: 'BlueDart Express',
        estimatedDays: '2-3 days',
        cost: baseRates.express * weightMultiplier,
        tracking: true,
        insurance: true,
      });
      rates.push({
        method: 'priority',
        name: 'DHL Priority',
        estimatedDays: '1-2 days',
        cost: baseRates.priority * weightMultiplier,
        tracking: true,
        insurance: true,
      });
    } else {
      rates.push({
        method: 'standard',
        name: 'International Standard',
        estimatedDays: '15-21 days',
        cost: baseRates.standard * weightMultiplier,
        tracking: true,
        insurance: false,
      });
      rates.push({
        method: 'express',
        name: 'DHL Express International',
        estimatedDays: '5-7 days',
        cost: baseRates.express * weightMultiplier,
        tracking: true,
        insurance: true,
      });
      rates.push({
        method: 'priority',
        name: 'FedEx Priority International',
        estimatedDays: '3-4 days',
        cost: baseRates.priority * weightMultiplier,
        tracking: true,
        insurance: true,
      });
    }

    return rates;
  }

  private estimateCustomsDuty(country: string): number {
    // Simplified customs duty estimation
    // In production, use actual customs API
    const dutyRates: Record<string, number> = {
      'usa': 6.5, // Percentage
      'uk': 2.5,
      'canada': 8.0,
      'australia': 5.0,
      'uae': 0.0, // Free trade agreement
      'default': 10.0,
    };

    const rate = dutyRates[country.toLowerCase()] ?? dutyRates['default'];
    return rate;
  }

  private estimateTax(country: string): number {
    // VAT/GST estimation
    const taxRates: Record<string, number> = {
      'usa': 0, // Varies by state
      'uk': 20,
      'germany': 19,
      'france': 20,
      'canada': 13,
      'australia': 10,
      'uae': 5,
      'default': 15,
    };

    return taxRates[country.toLowerCase()] ?? taxRates['default'];
  }

  // Estimate package weight from product
  estimateWeight(productCategory: string, quantity: number = 1): number {
    const categoryWeights: Record<string, number> = {
      pottery: 1.5,
      textile: 0.5,
      jewelry: 0.2,
      woodwork: 2.0,
      metalwork: 3.0,
      painting: 0.8,
      handloom: 1.0,
      general: 1.0,
    };

    const baseWeight = categoryWeights[productCategory.toLowerCase()] ?? categoryWeights.general;
    return baseWeight * quantity;
  }

  // Get list of countries we ship to
  getShippableCountries(): string[] {
    return [
      // Domestic
      'India',
      // Asia
      'United Arab Emirates',
      'Singapore',
      'Japan',
      'South Korea',
      'Thailand',
      'Malaysia',
      'Vietnam',
      'Indonesia',
      'Philippines',
      'China',
      'Hong Kong',
      'Saudi Arabia',
      'Qatar',
      // Europe
      'United Kingdom',
      'France',
      'Germany',
      'Italy',
      'Spain',
      'Netherlands',
      'Belgium',
      'Switzerland',
      'Austria',
      'Sweden',
      'Norway',
      'Denmark',
      // Americas
      'United States',
      'Canada',
      'Mexico',
      'Brazil',
      // Oceania
      'Australia',
      'New Zealand',
    ];
  }

  // Check if we can ship to a country
  canShipTo(country: string): boolean {
    return this.getShippableCountries().some(
      c => c.toLowerCase() === country.toLowerCase()
    );
  }

  // Generate shipping label (mock)
  async generateShippingLabel(orderId: string, address: ShippingAddress, method: ShippingMethod): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In production, integrate with shipping provider API
    console.log('Generating shipping label:', { orderId, address, method });
    
    return `data:application/pdf;base64,mock-shipping-label-${orderId}`;
  }

  // Track shipment (mock)
  async trackShipment(trackingNumber: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock tracking data
    return {
      trackingNumber,
      status: 'In Transit',
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      events: [
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Picked up', location: 'Jaipur, India' },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'In transit', location: 'Delhi Hub' },
        { date: new Date().toISOString(), status: 'International departure', location: 'Mumbai Airport' },
      ],
    };
  }
}

export const shippingService = new ShippingService();
