import React, { useState } from "react";
import Spinner from "./Spinner";

const InputPanel = ({ onSubmit, onSuccess }) => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = "Latitude must be between -90 and 90";
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      newErrors.longitude = "Longitude must be between -180 and 180";
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        newErrors.endDate = "End date must be after start date";
      }
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (diffDays > 31) {
        newErrors.endDate = "Date range cannot exceed 31 days";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const payload = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      start_date: startDate,
      end_date: endDate,
    };

    try {
      await onSubmit(payload);
      setLatitude("");
      setLongitude("");
      setStartDate("");
      setEndDate("");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-xl shadow-xl p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        📍 Fetch Weather Data
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="-90 to 90"
            required
            className={`w-full border ${
              errors.latitude ? "border-red-500" : "border-gray-300"
            } rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.latitude && (
            <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="-180 to 180"
            required
            className={`w-full border ${
              errors.longitude ? "border-red-500" : "border-gray-300"
            } rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.longitude && (
            <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className={`w-full border ${
              errors.endDate ? "border-red-500" : "border-gray-300"
            } rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {loading ? (
          <>
            <Spinner size="sm" />
            <span>Fetching...</span>
          </>
        ) : (
          "🌤️ Store Weather Data"
        )}
      </button>
    </form>
  );
};

export default InputPanel;
