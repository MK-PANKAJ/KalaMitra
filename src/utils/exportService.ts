import { Product } from '../types';
import { CurrencyCode, currencyConverter } from './currencyService';

export type ExportFormat = 'pdf' | 'excel' | 'csv';

export interface CatalogConfig {
  title: string;
  artisanName: string;
  businessName?: string;
  contactEmail?: string;
  contactPhone?: string;
  logo?: string;
  currency: CurrencyCode;
  includePhotos: boolean;
  includeStories: boolean;
  includePricing: boolean;
}

export class ExportService {
  async generatePDFCatalog(products: Product[], config: CatalogConfig): Promise<string> {
    // In production, use jsPDF or similar library
    // For now, simulate generation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const catalogData = this.prepareCatalogData(products, config);
    
    // Simulate PDF generation
    console.log('Generating PDF Catalog:', catalogData);
    
    // Return mock download URL
    return 'data:application/pdf;base64,mock-pdf-data';
  }

  async generateExcelCatalog(products: Product[], config: CatalogConfig): Promise<string> {
    // In production, use SheetJS (xlsx) library
    await new Promise(resolve => setTimeout(resolve, 800));

    const rows = products.map((product, index) => ({
      'S.No': index + 1,
      'Product Name': product.name,
      'Category': product.category,
      'Region': product.region,
      'Materials': product.materials.join(', '),
      'Price': currencyConverter.formatPrice(product.price, config.currency),
      'QC Verified': product.hasQualityBadge ? 'Yes' : 'No',
      'Story': config.includeStories ? product.story : '',
    }));

    console.log('Generating Excel Catalog:', rows);
    
    // Return mock download URL
    return 'data:application/vnd.ms-excel;base64,mock-excel-data';
  }

  async generateCSVCatalog(products: Product[], config: CatalogConfig): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate CSV content
    const headers = [
      'Product Name',
      'Category',
      'Region',
      'Materials',
      'Price',
      'QC Verified',
      'Description',
    ];

    const csvRows = products.map(product => [
      product.name,
      product.category,
      product.region,
      product.materials.join('; '),
      currencyConverter.convertPrice(product.price, config.currency).toFixed(2),
      product.hasQualityBadge ? 'Yes' : 'No',
      config.includeStories ? `"${product.story.replace(/"/g, '""')}"` : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(',')),
    ].join('\n');

    // Convert to data URL
    const blob = new Blob([csvContent], { type: 'text/csv' });
    return URL.createObjectURL(blob);
  }

  async generatePricelist(products: Product[], currency: CurrencyCode): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const pricelistContent = products.map((product, index) => {
      const price = currencyConverter.formatPrice(product.price, currency);
      return `${index + 1}. ${product.name} - ${price}`;
    }).join('\n');

    const blob = new Blob([pricelistContent], { type: 'text/plain' });
    return URL.createObjectURL(blob);
  }

  private prepareCatalogData(products: Product[], config: CatalogConfig) {
    return {
      metadata: {
        title: config.title,
        artisan: config.artisanName,
        business: config.businessName,
        contact: {
          email: config.contactEmail,
          phone: config.contactPhone,
        },
        currency: config.currency,
        generatedDate: new Date().toISOString(),
        totalProducts: products.length,
      },
      products: products.map(product => ({
        name: product.name,
        category: product.category,
        region: product.region,
        materials: product.materials,
        price: currencyConverter.formatPrice(product.price, config.currency),
        story: config.includeStories ? product.story : undefined,
        photos: config.includePhotos ? product.photos : undefined,
        qcVerified: product.hasQualityBadge,
      })),
    };
  }

  // Generate shareable product link
  generateShareableLink(productId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/product/${productId}`;
  }

  // Generate QR code for product (mock)
  async generateProductQR(productId: string): Promise<string> {
    // In production, use qrcode library
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const url = this.generateShareableLink(productId);
    // Return mock QR code data URL
    return `data:image/png;base64,mock-qr-code-${productId}`;
  }

  // Generate wholesale inquiry template
  generateWholesaleTemplate(products: Product[], artisanEmail: string): string {
    const productList = products.map((p, i) => 
      `${i + 1}. ${p.name} - ${p.category} (${p.region})`
    ).join('\n');

    return `Subject: Wholesale Inquiry for Indian Handcrafted Products

Dear ${artisanEmail},

I am interested in placing a wholesale order for the following products:

${productList}

Please provide:
- Bulk pricing for quantities of 10, 25, 50, and 100 units
- Lead time for production
- Shipping options and costs
- Payment terms
- Minimum order quantity

Looking forward to your response.

Best regards,`;
  }
}

export const exportService = new ExportService();
