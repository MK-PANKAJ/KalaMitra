export interface SustainabilityMetrics {
  productId: string;
  carbonFootprint: number; // kg CO2
  ecoScore: number; // 0-100
  materials: {
    recycled: number; // percentage
    organic: number; // percentage
    local: number; // percentage
    renewable: number; // percentage
  };
  packaging: {
    recyclable: boolean;
    biodegradable: boolean;
    plasticFree: boolean;
    plastic: number; // grams
  };
  production: {
    waterUsage: number; // liters
    energySource: 'renewable' | 'mixed' | 'grid';
    wasteGenerated: number; // kg
    localSourcing: boolean;
  };
  transportation: {
    distance: number; // km
    method: 'road' | 'rail' | 'air' | 'sea';
    emissions: number; // kg CO2
  };
  certifications: string[];
  impactScore: {
    environmental: number; // 0-100
    social: number; // 0-100
    economic: number; // 0-100
    overall: number; // 0-100
  };
}

export interface EcoLabel {
  type: 'organic' | 'fair-trade' | 'carbon-neutral' | 'recycled' | 'handmade' | 'local';
  name: string;
  icon: string;
  description: string;
  criteria: string[];
}

export const ECO_LABELS: Record<string, EcoLabel> = {
  organic: {
    type: 'organic',
    name: 'Organic Materials',
    icon: '🌱',
    description: 'Made with certified organic materials',
    criteria: ['70%+ organic materials', 'No synthetic chemicals', 'Certified suppliers'],
  },
  fairTrade: {
    type: 'fair-trade',
    name: 'Fair Trade Certified',
    icon: '🤝',
    description: 'Fair wages and ethical production',
    criteria: ['Fair artisan wages', 'Safe working conditions', 'Community development'],
  },
  carbonNeutral: {
    type: 'carbon-neutral',
    name: 'Carbon Neutral',
    icon: '🌍',
    description: 'Net-zero carbon emissions',
    criteria: ['Carbon offset purchased', 'Renewable energy used', 'Low-emission transport'],
  },
  recycled: {
    type: 'recycled',
    name: 'Recycled Materials',
    icon: '♻️',
    description: 'Made from recycled materials',
    criteria: ['50%+ recycled content', 'Waste reduction', 'Circular economy'],
  },
  handmade: {
    type: 'handmade',
    name: 'Handcrafted',
    icon: '🎨',
    description: 'Traditionally handcrafted',
    criteria: ['No mass production', 'Traditional techniques', 'Artisan-made'],
  },
  local: {
    type: 'local',
    name: 'Locally Sourced',
    icon: '📍',
    description: 'Materials sourced locally',
    criteria: ['Local materials', 'Reduced transport', 'Community support'],
  },
};

export class SustainabilityService {
  calculateCarbonFootprint(
    productWeight: number, // kg
    transportDistance: number, // km
    productionEnergy: 'renewable' | 'mixed' | 'grid'
  ): number {
    // Carbon footprint calculation (simplified)
    const transportEmissions = (transportDistance / 1000) * 0.12; // kg CO2 per ton-km
    const productionEmissions = {
      renewable: 0.1,
      mixed: 0.5,
      grid: 1.0,
    }[productionEnergy];

    return (transportEmissions + productionEmissions) * productWeight;
  }

  calculateEcoScore(metrics: Partial<SustainabilityMetrics>): number {
    let score = 0;
    let factors = 0;

    // Material score (0-25 points)
    if (metrics.materials) {
      const materialScore = (
        (metrics.materials.recycled || 0) * 0.3 +
        (metrics.materials.organic || 0) * 0.3 +
        (metrics.materials.local || 0) * 0.2 +
        (metrics.materials.renewable || 0) * 0.2
      ) / 4;
      score += materialScore * 25;
      factors++;
    }

    // Packaging score (0-20 points)
    if (metrics.packaging) {
      let packagingScore = 0;
      if (metrics.packaging.recyclable) packagingScore += 7;
      if (metrics.packaging.biodegradable) packagingScore += 7;
      if (metrics.packaging.plasticFree) packagingScore += 6;
      score += packagingScore;
      factors++;
    }

    // Production score (0-25 points)
    if (metrics.production) {
      let prodScore = 0;
      if (metrics.production.energySource === 'renewable') prodScore += 10;
      else if (metrics.production.energySource === 'mixed') prodScore += 5;
      if (metrics.production.localSourcing) prodScore += 8;
      if (metrics.production.waterUsage < 50) prodScore += 7;
      score += prodScore;
      factors++;
    }

    // Transportation score (0-15 points)
    if (metrics.transportation) {
      let transportScore = 15;
      if (metrics.transportation.distance > 1000) transportScore -= 5;
      if (metrics.transportation.distance > 5000) transportScore -= 5;
      if (metrics.transportation.method === 'air') transportScore -= 5;
      score += Math.max(0, transportScore);
      factors++;
    }

    // Certifications (0-15 points)
    if (metrics.certifications) {
      score += Math.min(metrics.certifications.length * 5, 15);
      factors++;
    }

    return Math.min(100, Math.round(score));
  }

  getApplicableLabels(metrics: SustainabilityMetrics): EcoLabel[] {
    const labels: EcoLabel[] = [];

    // Organic
    if (metrics.materials.organic >= 70) {
      labels.push(ECO_LABELS.organic);
    }

    // Fair Trade (always true for KalaMitra artisans)
    labels.push(ECO_LABELS.fairTrade);

    // Carbon Neutral
    if (metrics.carbonFootprint < 2 && metrics.production.energySource === 'renewable') {
      labels.push(ECO_LABELS.carbonNeutral);
    }

    // Recycled
    if (metrics.materials.recycled >= 50) {
      labels.push(ECO_LABELS.recycled);
    }

    // Handmade (always true for KalaMitra)
    labels.push(ECO_LABELS.handmade);

    // Local
    if (metrics.materials.local >= 80) {
      labels.push(ECO_LABELS.local);
    }

    return labels;
  }

  generateSustainabilityReport(metrics: SustainabilityMetrics): {
    summary: string;
    strengths: string[];
    improvements: string[];
    comparison: string;
  } {
    const labels = this.getApplicableLabels(metrics);
    
    return {
      summary: `This product has an eco-score of ${metrics.ecoScore}/100 with a carbon footprint of ${metrics.carbonFootprint.toFixed(2)} kg CO2. It qualifies for ${labels.length} sustainability certifications.`,
      strengths: [
        metrics.materials.recycled > 50 ? `${metrics.materials.recycled}% recycled materials` : null,
        metrics.materials.organic > 70 ? `${metrics.materials.organic}% organic materials` : null,
        metrics.packaging.plasticFree ? 'Plastic-free packaging' : null,
        metrics.production.energySource === 'renewable' ? 'Renewable energy production' : null,
        metrics.materials.local > 80 ? 'Locally sourced materials' : null,
      ].filter(Boolean) as string[],
      improvements: [
        metrics.materials.recycled < 30 ? 'Consider using more recycled materials' : null,
        metrics.packaging.plastic > 10 ? 'Reduce plastic packaging' : null,
        metrics.production.energySource === 'grid' ? 'Switch to renewable energy sources' : null,
        metrics.transportation.distance > 1000 ? 'Optimize supply chain to reduce transport distance' : null,
      ].filter(Boolean) as string[],
      comparison: `This product performs ${metrics.ecoScore > 70 ? 'better' : metrics.ecoScore > 50 ? 'average' : 'below average'} compared to similar products.`,
    };
  }

  estimateProductMetrics(
    category: string,
    materials: string[],
    region: string
  ): SustainabilityMetrics {
    // Mock estimation based on category
    const categoryDefaults: Record<string, Partial<SustainabilityMetrics>> = {
      pottery: {
        carbonFootprint: 1.2,
        ecoScore: 75,
        materials: { recycled: 10, organic: 80, local: 90, renewable: 85 },
        packaging: { recyclable: true, biodegradable: true, plasticFree: true, plastic: 0 },
        production: { waterUsage: 30, energySource: 'mixed', wasteGenerated: 0.5, localSourcing: true },
      },
      textile: {
        carbonFootprint: 2.5,
        ecoScore: 65,
        materials: { recycled: 30, organic: 60, local: 70, renewable: 75 },
        packaging: { recyclable: true, biodegradable: false, plasticFree: false, plastic: 5 },
        production: { waterUsage: 80, energySource: 'mixed', wasteGenerated: 1.2, localSourcing: true },
      },
      jewelry: {
        carbonFootprint: 0.8,
        ecoScore: 70,
        materials: { recycled: 40, organic: 20, local: 85, renewable: 60 },
        packaging: { recyclable: true, biodegradable: true, plasticFree: true, plastic: 0 },
        production: { waterUsage: 10, energySource: 'renewable', wasteGenerated: 0.2, localSourcing: true },
      },
      woodwork: {
        carbonFootprint: 1.8,
        ecoScore: 80,
        materials: { recycled: 20, organic: 90, local: 95, renewable: 95 },
        packaging: { recyclable: true, biodegradable: true, plasticFree: true, plastic: 0 },
        production: { waterUsage: 15, energySource: 'mixed', wasteGenerated: 2.0, localSourcing: true },
      },
    };

    const defaults = categoryDefaults[category.toLowerCase()] || categoryDefaults.pottery;

    return {
      productId: '',
      carbonFootprint: defaults.carbonFootprint || 1.5,
      ecoScore: defaults.ecoScore || 70,
      materials: defaults.materials!,
      packaging: defaults.packaging!,
      production: defaults.production!,
      transportation: {
        distance: 500,
        method: 'road',
        emissions: 0.3,
      },
      certifications: ['Handmade', 'Fair Trade'],
      impactScore: {
        environmental: defaults.ecoScore || 70,
        social: 85,
        economic: 80,
        overall: 78,
      },
    };
  }

  calculateCarbonOffset(carbonFootprint: number): {
    cost: number; // in INR
    trees: number;
    description: string;
  } {
    // Carbon offset pricing (approximate)
    const costPerKg = 8; // ₹8 per kg CO2
    const treesNeeded = Math.ceil(carbonFootprint / 20); // 1 tree absorbs ~20kg CO2/year

    return {
      cost: carbonFootprint * costPerKg,
      trees: treesNeeded,
      description: `Plant ${treesNeeded} tree${treesNeeded > 1 ? 's' : ''} to offset ${carbonFootprint.toFixed(2)} kg CO2`,
    };
  }
}

export const sustainabilityService = new SustainabilityService();
