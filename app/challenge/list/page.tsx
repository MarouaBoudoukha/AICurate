"use client";
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Link, Image, Code, Globe, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AppSubmission {
  name: string;
  description: string;
  website: string;
  github?: string;
  category: string;
  features: string[];
  pricing: string;
  mediaFiles: File[];
}

const categories = [
  'Text Generation',
  'Image Generation',
  'Code Assistant',
  'Data Analysis',
  'Chatbot',
  'Audio Processing',
  'Video Creation',
  'Other'
];

const requirements = [
  'Must be an AI-powered application',
  'Must have a working demo or website',
  'Must provide clear pricing information',
  'Must include at least 3 key features',
  'Must upload at least 2 screenshots or demo videos'
];

export default function ListAppPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submission, setSubmission] = useState<AppSubmission>({
    name: '',
    description: '',
    website: '',
    github: '',
    category: '',
    features: [''],
    pricing: '',
    mediaFiles: []
  });

  const handleInputChange = (field: keyof AppSubmission, value: string) => {
    setSubmission(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...submission.features];
    newFeatures[index] = value;
    setSubmission(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setSubmission(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setSubmission(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSubmission(prev => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files]
    }));
  };

  const handleSubmit = () => {
    // In a real app, this would submit the app to the backend
    setShowSuccessModal(true);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return submission.name && submission.description && submission.website;
      case 2:
        return submission.category && submission.features.every(f => f.trim() !== '') && submission.pricing;
      case 3:
        return submission.mediaFiles.length >= 2;
      default:
        return false;
    }
  };

  return (
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.button
        onClick={() => router.push('/challenge')}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </motion.button>

      <motion.h1
        className="text-2xl font-bold mb-2 text-indigo-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        List Your AI App
      </motion.h1>

      {/* Progress Steps */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  s === step
                    ? 'bg-indigo-500 text-white'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s < step ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-24 h-1 ${
                    s < step ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Requirements */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          Requirements
        </h2>
        <ul className="space-y-2">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5" />
              {req}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
              <input
                type="text"
                value={submission.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                placeholder="Enter your app name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={submission.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                rows={4}
                placeholder="Describe your app and its main features..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={submission.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  placeholder="https://your-app.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository (Optional)</label>
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={submission.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Features and Pricing */}
      {step === 2 && (
        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features and Pricing</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={submission.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
              {submission.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                    placeholder={`Feature ${index + 1}`}
                  />
                  {submission.features.length > 1 && (
                    <button
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addFeature}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
              >
                + Add Feature
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Information</label>
              <textarea
                value={submission.pricing}
                onChange={(e) => handleInputChange('pricing', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                rows={3}
                placeholder="Describe your pricing model, plans, and any free tiers..."
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Media Upload */}
      {step === 3 && (
        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Media Upload</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Screenshots and Demo Videos
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Media
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleMediaUpload}
                  />
                </label>
                {submission.mediaFiles.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {submission.mediaFiles.length} files selected
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Upload at least 2 screenshots or demo videos of your app
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
          >
            Previous
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!isStepValid()}
            className={`ml-auto px-6 py-2 rounded-lg transition ${
              isStepValid()
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isStepValid()}
            className={`ml-auto px-6 py-2 rounded-lg transition ${
              isStepValid()
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit App
          </button>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">App Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Your app has been submitted for review. We&apos;ll notify you once it&apos;s approved.
              </p>
              <button
                onClick={() => router.push('/challenge')}
                className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
              >
                Return to Challenges
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 