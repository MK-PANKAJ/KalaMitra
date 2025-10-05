import React, { useState } from 'react';
import { Building2, FileText, CheckCircle, Clock, ExternalLink, Download } from 'lucide-react';

interface GovernmentScheme {
  id: string;
  name: string;
  ministry: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  applicationLink: string;
  deadline?: string;
  category: 'finance' | 'training' | 'marketing' | 'export';
  status: 'active' | 'upcoming' | 'closed';
}

export const GovernmentSchemesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const schemes: GovernmentScheme[] = [
    {
      id: 'scheme-1',
      name: 'PM Vishwakarma Scheme',
      ministry: 'Ministry of Micro, Small and Medium Enterprises',
      description: 'Comprehensive support for traditional artisans and craftspeople with financial assistance, skill upgradation and modern equipment.',
      benefits: [
        'Financial support up to ₹3 lakhs',
        'Skill development training',
        'Modern tools and equipment',
        'Marketing support',
      ],
      eligibility: [
        'Traditional artisan/craftsperson',
        'Age 18-60 years',
        'Indian citizen',
        'Not beneficiary of similar scheme',
      ],
      applicationLink: 'https://pmvishwakarma.gov.in',
      deadline: '2025-12-31',
      category: 'finance',
      status: 'active',
    },
    {
      id: 'scheme-2',
      name: 'One District One Product (ODOP)',
      ministry: 'Ministry of Commerce and Industry',
      description: 'Promotes unique products from each district to boost local economy and preserve traditional crafts.',
      benefits: [
        'Marketing and branding support',
        'Quality certification',
        'E-commerce facilitation',
        'Export promotion',
      ],
      eligibility: [
        'Artisan from registered district',
        'Product matches ODOP category',
        'Quality standards met',
      ],
      applicationLink: 'https://odop.gov.in',
      category: 'marketing',
      status: 'active',
    },
    {
      id: 'scheme-3',
      name: 'Scheme of Fund for Regeneration of Traditional Industries (SFURTI)',
      ministry: 'Ministry of MSME',
      description: 'Organizes traditional industries into clusters for economic development and competitiveness.',
      benefits: [
        'Cluster development support',
        'Common facility centers',
        'Technology upgradation',
        'Skill enhancement',
      ],
      eligibility: [
        'Part of artisan cluster',
        'Traditional craft practice',
        'Minimum 500 artisans in cluster',
      ],
      applicationLink: 'https://sfurti.msme.gov.in',
      category: 'training',
      status: 'active',
    },
    {
      id: 'scheme-4',
      name: 'Export Promotion Capital Goods (EPCG) Scheme',
      ministry: 'Directorate General of Foreign Trade',
      description: 'Allows import of capital goods at zero customs duty for export production.',
      benefits: [
        'Zero customs duty on imports',
        'Export obligation fulfillment',
        'Technology upgradation',
      ],
      eligibility: [
        'Export-oriented business',
        'Valid IEC (Import Export Code)',
        'Export commitment capability',
      ],
      applicationLink: 'https://dgft.gov.in',
      category: 'export',
      status: 'active',
    },
    {
      id: 'scheme-5',
      name: 'National Handicraft Development Programme',
      ministry: 'Ministry of Textiles - Office of Development Commissioner (Handicrafts)',
      description: 'Comprehensive support for design, technology, training, and marketing of handicrafts.',
      benefits: [
        'Design and product development',
        'Marketing support',
        'Exhibition participation',
        'Financial assistance',
      ],
      eligibility: [
        'Registered handicraft artisan',
        'Active craft practice',
        'Quality product standards',
      ],
      applicationLink: 'https://handicrafts.nic.in',
      category: 'marketing',
      status: 'active',
    },
    {
      id: 'scheme-6',
      name: 'Mudra Yojana',
      ministry: 'Ministry of Finance',
      description: 'Provides loans up to ₹10 lakhs to micro and small enterprises.',
      benefits: [
        'Loans up to ₹10 lakhs',
        'Low interest rates',
        'No collateral required',
        'Easy application process',
      ],
      eligibility: [
        'Micro/small enterprise',
        'Indian citizen',
        'Age 18+ years',
        'Business plan required',
      ],
      applicationLink: 'https://www.mudra.org.in',
      deadline: 'Rolling basis',
      category: 'finance',
      status: 'active',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Schemes', icon: '📋' },
    { value: 'finance', label: 'Financial Support', icon: '💰' },
    { value: 'training', label: 'Training & Skills', icon: '📚' },
    { value: 'marketing', label: 'Marketing Support', icon: '📢' },
    { value: 'export', label: 'Export Promotion', icon: '🌍' },
  ];

  const filteredSchemes = selectedCategory === 'all'
    ? schemes
    : schemes.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Building2 size={32} />
          Government Schemes & Support
        </h1>
        <p className="text-orange-50">Access financial aid, training, and growth opportunities</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-orange-600" size={24} />
            <span className="font-semibold">Available Schemes</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">{schemes.filter(s => s.status === 'active').length}</p>
          <p className="text-xs text-gray-500">Currently accepting applications</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-600" size={24} />
            <span className="font-semibold">Your Applications</span>
          </div>
          <p className="text-3xl font-bold text-green-600">0</p>
          <p className="text-xs text-gray-500">Submitted applications</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-blue-600" size={24} />
            <span className="font-semibold">Deadlines Soon</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">2</p>
          <p className="text-xs text-gray-500">Applications closing soon</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === cat.value
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filteredSchemes.map(scheme => (
          <div key={scheme.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-deepblue-800">{scheme.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      scheme.status === 'active' ? 'bg-green-100 text-green-700' :
                      scheme.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {scheme.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{scheme.ministry}</p>
                  <p className="text-gray-700 leading-relaxed">{scheme.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle size={18} />
                    Benefits
                  </h4>
                  <ul className="space-y-1">
                    {scheme.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Eligibility Criteria</h4>
                  <ul className="space-y-1">
                    {scheme.eligibility.map((criterion, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {scheme.deadline && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Application Deadline:</strong> {new Date(scheme.deadline).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <a
                  href={scheme.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <ExternalLink size={18} />
                  Apply Online
                </a>
                <button className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center gap-2">
                  <Download size={18} />
                  Download Form
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl text-gray-600 mb-2">No schemes found</p>
          <p className="text-gray-500">Try selecting a different category</p>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 className="text-xl font-bold text-deepblue-800 mb-3">Need Help with Applications?</h3>
        <p className="text-gray-700 mb-4">
          Our support team can help you understand eligibility criteria, fill forms, and submit applications.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
          Contact Support Team
        </button>
      </div>
    </div>
  );
};
