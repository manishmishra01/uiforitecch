import React, { useState } from 'react';
import { Home, DollarSign, MapPin, Users, Bed, TrendingUp } from 'lucide-react';

// Use environment variable with fallback
const API_URL = import.meta.env.VITE_API_URL;

export default function HousePricePredictor() {
  const [formData, setFormData] = useState({
    longitude: '',
    latitude: '',
    housing_median_age: '',
    median_income: '',
    rooms_per_household: '',
    bedrooms_per_room: '',
    population_per_household: '',
    households: ''
  });
  
  const [selectedCity, setSelectedCity] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const californiaCities = [
    { name: 'Los Angeles', longitude: -118.2437, latitude: 34.0522 },
    { name: 'San Francisco', longitude: -122.4194, latitude: 37.7749 },
    { name: 'San Diego', longitude: -117.1611, latitude: 32.7157 },
    { name: 'San Jose', longitude: -121.8863, latitude: 37.3382 },
    { name: 'Sacramento', longitude: -121.4944, latitude: 38.5816 },
    { name: 'Fresno', longitude: -119.7871, latitude: 36.7378 },
    { name: 'Long Beach', longitude: -118.1937, latitude: 33.7701 },
    { name: 'Oakland', longitude: -122.2711, latitude: 37.8044 },
    { name: 'Bakersfield', longitude: -119.0187, latitude: 35.3733 },
    { name: 'Anaheim', longitude: -117.9145, latitude: 33.8366 },
    { name: 'Santa Ana', longitude: -117.8678, latitude: 33.7455 },
    { name: 'Riverside', longitude: -117.3961, latitude: 33.9533 },
    { name: 'Stockton', longitude: -121.2908, latitude: 37.9577 },
    { name: 'Irvine', longitude: -117.8265, latitude: 33.6846 },
    { name: 'Chula Vista', longitude: -117.0842, latitude: 32.6401 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    
    if (cityName) {
      const city = californiaCities.find(c => c.name === cityName);
      if (city) {
        setFormData(prev => ({
          ...prev,
          longitude: city.longitude.toString(),
          latitude: city.latitude.toString()
        }));
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const numericData = {
        longitude: parseFloat(formData.longitude),
        latitude: parseFloat(formData.latitude),
        housing_median_age: parseInt(formData.housing_median_age),
        median_income: parseFloat(formData.median_income),
        rooms_per_household: parseFloat(formData.rooms_per_household),
        bedrooms_per_room: parseFloat(formData.bedrooms_per_room),
        population_per_household: parseFloat(formData.population_per_household),
        households: parseInt(formData.households)
      };

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericData)
      });

      if (!response.ok) throw new Error('Prediction failed');

      const data = await response.json();
      setPrediction(data.predicted_price);
    } catch (err) {
      setError('Failed to get prediction. Please check your inputs and try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: 'longitude', label: 'Longitude', icon: MapPin, step: '0.01', min: '-124', max: '-114', placeholder: 'e.g., -122.23' },
    { name: 'latitude', label: 'Latitude', icon: MapPin, step: '0.01', min: '32', max: '42', placeholder: 'e.g., 37.88' },
    { name: 'housing_median_age', label: 'Housing Median Age', icon: Home, step: '1', min: '1', max: '100', placeholder: 'e.g., 41' },
    { name: 'median_income', label: 'Median Income ($10k)', icon: DollarSign, step: '0.01', min: '0', placeholder: 'e.g., 8.32' },
    { name: 'rooms_per_household', label: 'Rooms per Household', icon: Home, step: '0.01', min: '0', placeholder: 'e.g., 6.98' },
    { name: 'bedrooms_per_room', label: 'Bedrooms per Room', icon: Bed, step: '0.01', min: '0', max: '1', placeholder: 'e.g., 0.15' },
    { name: 'population_per_household', label: 'Population per Household', icon: Users, step: '0.01', min: '0', placeholder: 'e.g., 2.55' },
    { name: 'households', label: 'Total Households', icon: Users, step: '1', min: '1', placeholder: 'e.g., 322' }
  ];

  return (
    <div className="max-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
              <Home className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                California House Price Predictor
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Get instant price predictions powered by LightGBM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Form */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Property Details
              </h2>

              {/* City Selector */}
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Select California City (Optional)
                </label>
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 bg-white text-sm"
                >
                  <option value="">-- Choose a city or enter coordinates manually --</option>
                  {californiaCities.map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-2">
                  💡 Select a city to auto-fill longitude and latitude
                </p>
              </div>

              {/* Input Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {inputFields.map(field => {
                  const Icon = field.icon;
                  return (
                    <div key={field.name}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {field.label}
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <input
                          type="number"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          step={field.step}
                          min={field.min}
                          max={field.max}
                          placeholder={field.placeholder}
                          required
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-400 text-gray-900 text-sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Predicting...
                  </span>
                ) : (
                  'Predict Price'
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:w-80 xl:w-96">
            <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Prediction
              </h2>

              {prediction !== null && (
                <div className="mb-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Estimated Price</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${prediction.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                    This prediction is based on historical California housing data and market trends.
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-4">
                  {error}
                </div>
              )}

              {!prediction && !error && (
                <div className="text-center py-8 text-gray-400 mb-4">
                  <Home className="w-16 h-16 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Enter property details and click predict to see the estimated price.</p>
                </div>
              )}

              {/* Info Cards */}
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3 text-xs">
                  <p className="font-semibold text-blue-900 mb-1">💡 Tip</p>
                  <p className="text-blue-700">Median income is measured in tens of thousands of dollars.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-xs">
                  <p className="font-semibold text-purple-900 mb-1">📍 Location</p>
                  <p className="text-purple-700">Longitude and latitude determine the exact location in California.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-2 text-base">About This Predictor</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            This model uses LightGBM machine learning algorithm trained on California housing data. 
            It considers factors like location, property age, household income, and housing density to 
            provide accurate price predictions. The predictions are estimates and should be used as a 
            guide alongside professional property valuations.
          </p>
        </div>
      </div>
    </div>
  );
}