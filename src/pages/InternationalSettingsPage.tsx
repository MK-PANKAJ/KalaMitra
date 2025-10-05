import React, { useState } from 'react';
import { Globe, DollarSign, Languages, MapPin, Truck, Download, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CurrencyCode, CURRENCIES, currencyConverter } from '../utils/currencyService';
import { LanguageCode, LANGUAGES, translationService } from '../utils/translationService';
import { shippingService, ShippingAddress } from '../utils/shippingService';
import { exportService, CatalogConfig, ExportFormat } from '../utils/exportService';

export const InternationalSettingsPage: React.FC = () => {
  const { state } = useApp();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('INR');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    country: 'India',
    state: '',
    city: '',
    postalCode: '',
  });
  const [activeTab, setActiveTab] = useState<'currency' | 'language' | 'shipping' | 'export'>('currency');

  // Export Catalog State
  const [catalogConfig, setCatalogConfig] = useState<CatalogConfig>({
    title: `${state.user?.name} Product Catalog`,
    artisanName: state.user?.name || '',
    currency: selectedCurrency,
    includePhotos: true,
    includeStories: true,
    includePricing: true,
  });
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCatalog = async () => {
    setIsExporting(true);
    try {
      const artisanProducts = state.products.filter(p => p.artisanId === state.user?.id && p.isActive);
      
      let url: string;
      switch (exportFormat) {
        case 'pdf':
          url = await exportService.generatePDFCatalog(artisanProducts, catalogConfig);
          break;
        case 'excel':
          url = await exportService.generateExcelCatalog(artisanProducts, catalogConfig);
          break;
        case 'csv':
          url = await exportService.generateCSVCatalog(artisanProducts, catalogConfig);
          break;
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `catalog-${Date.now()}.${exportFormat}`;
      link.click();

      alert(`Catalog exported successfully as ${exportFormat.toUpperCase()}!`);
    } catch (error) {
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const shippingCalculation = shippingService.calculateShipping(
    shippingAddress,
    1.5 // Sample weight
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Globe size={32} />
          International Settings
        </h1>
        <p className="text-blue-50">Configure your global marketplace preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab('currency')}
          className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'currency'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <DollarSign size={18} />
          Currency
        </button>
        <button
          onClick={() => setActiveTab('language')}
          className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'language'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Languages size={18} />
          Language
        </button>
        <button
          onClick={() => setActiveTab('shipping')}
          className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'shipping'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Truck size={18} />
          Shipping
        </button>
        {state.user?.role === 'artisan' && (
          <button
            onClick={() => setActiveTab('export')}
            className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'export'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Download size={18} />
            Export Catalog
          </button>
        )}
      </div>

      {/* Currency Tab */}
      {activeTab === 'currency' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-deepblue-800 mb-4">Currency Preferences</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Display Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-400 outline-none"
              >
                {Object.values(CURRENCIES).map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Prices will be displayed in {CURRENCIES[selectedCurrency].name}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Price Conversion Example</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">₹1,500 INR =</span>
                  <span className="font-semibold">
                    {currencyConverter.formatPrice(1500, selectedCurrency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">₹5,000 INR =</span>
                  <span className="font-semibold">
                    {currencyConverter.formatPrice(5000, selectedCurrency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">₹10,000 INR =</span>
                  <span className="font-semibold">
                    {currencyConverter.formatPrice(10000, selectedCurrency)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * Exchange rates updated daily
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Language Tab */}
      {activeTab === 'language' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-deepblue-800 mb-4">Language Preferences</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {Object.values(LANGUAGES).map(language => (
              <button
                key={language.code}
                onClick={() => setSelectedLanguage(language.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedLanguage === language.code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-2">{language.nativeName}</div>
                <div className="text-sm text-gray-600">{language.name}</div>
                {selectedLanguage === language.code && (
                  <div className="mt-2 text-xs text-blue-600 font-semibold">✓ Selected</div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Auto-Translation Enabled</h3>
            <p className="text-sm text-gray-700">
              Product stories and descriptions will be automatically translated to {LANGUAGES[selectedLanguage].name} for international buyers.
            </p>
          </div>
        </div>
      )}

      {/* Shipping Tab */}
      {activeTab === 'shipping' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-deepblue-800 mb-4">Shipping Calculator</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
              <select
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-400 outline-none"
              >
                {shippingService.getShippableCountries().map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                placeholder="Enter city"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-400 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Available Shipping Methods</h3>
            {shippingCalculation.rates.map((rate) => (
              <div key={rate.method} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-deepblue-800">{rate.name}</h4>
                  <span className="text-2xl font-bold text-terracotta-600">
                    ₹{rate.cost.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>📦 {rate.estimatedDays}</span>
                  {rate.tracking && <span>✓ Tracking</span>}
                  {rate.insurance && <span>✓ Insurance</span>}
                </div>
              </div>
            ))}
          </div>

          {shippingCalculation.customsDuty !== undefined && (
            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">International Shipping Notice</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• Estimated customs duty: ~{shippingCalculation.customsDuty}%</p>
                <p>• Estimated tax: ~{shippingCalculation.estimatedTax}%</p>
                <p>• Total additional costs may apply at destination</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export Catalog Tab */}
      {activeTab === 'export' && state.user?.role === 'artisan' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-deepblue-800 mb-4">Export Product Catalog</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Catalog Title</label>
              <input
                type="text"
                value={catalogConfig.title}
                onChange={(e) => setCatalogConfig({...catalogConfig, title: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Export Format</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-400 outline-none"
              >
                <option value="pdf">PDF (Professional Catalog)</option>
                <option value="excel">Excel (Spreadsheet)</option>
                <option value="csv">CSV (Data Export)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={catalogConfig.includePhotos}
                onChange={(e) => setCatalogConfig({...catalogConfig, includePhotos: e.target.checked})}
                className="w-5 h-5"
              />
              <span className="font-semibold">Include product photos</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={catalogConfig.includeStories}
                onChange={(e) => setCatalogConfig({...catalogConfig, includeStories: e.target.checked})}
                className="w-5 h-5"
              />
              <span className="font-semibold">Include product stories</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={catalogConfig.includePricing}
                onChange={(e) => setCatalogConfig({...catalogConfig, includePricing: e.target.checked})}
                className="w-5 h-5"
              />
              <span className="font-semibold">Include pricing information</span>
            </label>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200 mb-6">
            <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <FileText size={20} />
              Catalog Preview
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Total Products: {state.products.filter(p => p.artisanId === state.user?.id && p.isActive).length}</p>
              <p>• Currency: {CURRENCIES[catalogConfig.currency].name}</p>
              <p>• Format: {exportFormat.toUpperCase()}</p>
            </div>
          </div>

          <button
            onClick={handleExportCatalog}
            disabled={isExporting}
            className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${
              isExporting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Download size={24} />
            {isExporting ? 'Generating Catalog...' : `Export as ${exportFormat.toUpperCase()}`}
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Perfect for trade shows, wholesale buyers, and business presentations
          </p>
        </div>
      )}
    </div>
  );
};
