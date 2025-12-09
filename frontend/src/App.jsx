import React, { useState, useEffect } from "react";
import InputPanel from "./components/InputPanel";
import FileList from "./components/FileList";
import FileViewer from "./components/FileViewer";
import Chart from "./components/Chart";
import Table from "./components/Table";
import { ToastProvider, useToast } from "./components/Toast";
import axios from "axios";

const AppContent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const toast = useToast();

  // Transform weather data for chart/table display
  useEffect(() => {
    if (!selectedFile) {
      setChartData([]);
      return;
    }

    const fetchAndTransform = async () => {
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_API_URL}/weather-file-content/${selectedFile}`
        );
        const data = resp.data;

        // Open-Meteo returns daily data in nested structure
        if (data.daily && data.daily.time) {
          const transformed = data.daily.time.map((date, idx) => ({
            date,
            temp_max: data.daily.temperature_2m_max?.[idx],
            temp_min: data.daily.temperature_2m_min?.[idx],
            apparent_max: data.daily.apparent_temperature_max?.[idx],
            apparent_min: data.daily.apparent_temperature_min?.[idx],
          }));
          setChartData(transformed);
        } else if (Array.isArray(data)) {
          const chart = data.map((item) => ({
            date: item.date || item.time || "",
            temp_max: item.temperature_2m_max,
            temp_min: item.temperature_2m_min,
          }));
          setChartData(chart);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load file data");
        setChartData([]);
      }
    };

    fetchAndTransform();
  }, [selectedFile]);

  const handleStoreWeather = async (payload) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/store-weather-data`,
        payload
      );
      toast.success("Weather data stored successfully!");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Error storing weather data:", err);
      toast.error(err.response?.data?.detail || "Failed to store weather data");
      throw err;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
          🌤️ Weather Explorer
        </h1>
        <p className="text-white/80 text-lg">
          Fetch, store, and visualize historical weather data
        </p>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <InputPanel onSubmit={handleStoreWeather} />
          <FileList
            onSelect={setSelectedFile}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <FileViewer fileName={selectedFile} />
          <Chart data={chartData} />
          <Table data={chartData} />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 text-white/60 text-sm">
        <p>Built for inRisk Interview Case Study • Powered by Open-Meteo API</p>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
