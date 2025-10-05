import React, { useState } from 'react';
import { Camera, CheckCircle2, XCircle, Upload } from 'lucide-react';
import { QualityCheck } from '../types';

interface QualityCheckFormProps {
  onComplete: (qc: QualityCheck) => void;
  onCancel: () => void;
}

export const QualityCheckForm: React.FC<QualityCheckFormProps> = ({ onComplete, onCancel }) => {
  const [checks, setChecks] = useState({
    materialQuality: false,
    craftmanship: false,
    dimensions: false,
    finishing: false,
    packaging: false,
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState('');

  const checkItems = [
    { key: 'materialQuality', label: 'Material Quality', description: 'Raw materials meet standards' },
    { key: 'craftmanship', label: 'Craftsmanship', description: 'Skilled work, no defects' },
    { key: 'dimensions', label: 'Dimensions', description: 'Size matches specifications' },
    { key: 'finishing', label: 'Finishing', description: 'Polish, edges, details complete' },
    { key: 'packaging', label: 'Packaging', description: 'Secure, presentable packaging' },
  ];

  const handleToggle = (key: string) => {
    setChecks({ ...checks, [key]: !checks[key as keyof typeof checks] });
  };

  const handleAddPhoto = () => {
    if (photoInput.trim()) {
      // In production, this would handle actual file upload
      // For demo, we'll use placeholder images or URLs
      const photoUrl = photoInput.startsWith('http') 
        ? photoInput 
        : `https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&sig=${Date.now()}`;
      setPhotos([...photos, photoUrl]);
      setPhotoInput('');
    }
  };

  const handleSubmit = () => {
    if (Object.values(checks).every(v => v) && photos.length > 0) {
      const qc: QualityCheck = {
        ...checks,
        photos,
        checkedBy: 'Coordinator',
        checkedAt: new Date().toISOString(),
      };
      onComplete(qc);
    }
  };

  const allChecked = Object.values(checks).every(v => v);
  const hasPhotos = photos.length > 0;
  const canSubmit = allChecked && hasPhotos;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-deepblue-800 mb-6 flex items-center gap-2">
        <CheckCircle2 className="text-terracotta-500" />
        Quality Control Checklist
      </h2>

      <div className="space-y-4 mb-6">
        {checkItems.map(({ key, label, description }) => (
          <div
            key={key}
            onClick={() => handleToggle(key)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              checks[key as keyof typeof checks]
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white hover:border-terracotta-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {checks[key as keyof typeof checks] ? (
                  <CheckCircle2 className="text-green-600" size={24} />
                ) : (
                  <XCircle className="text-gray-400" size={24} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{label}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Camera size={20} />
          Upload Quality Photos (Required)
        </h3>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={photoInput}
            onChange={(e) => setPhotoInput(e.target.value)}
            placeholder="Enter image URL or click Upload"
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
          />
          <button
            onClick={handleAddPhoto}
            className="px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors flex items-center gap-2"
          >
            <Upload size={18} />
            Add
          </button>
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {photos.map((photo, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={photo}
                  alt={`QC Photo ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XCircle size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
            canSubmit
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {!allChecked
            ? 'Complete All Checks'
            : !hasPhotos
            ? 'Add Photos'
            : 'Submit & Get Badge'}
        </button>
      </div>
    </div>
  );
};
