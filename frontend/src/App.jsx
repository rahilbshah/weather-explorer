import React, { useState, useEffect } from "react";
import InputPanel from "./components/InputPanel";
import FileList from "./components/FileList";
import FileViewer from "./components/FileViewer";
import Chart from "./components/Chart";
import Table from "./components/Table";
import axios from "axios";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Fetch file content when a file is selected
  useEffect(() => {
    if (!selectedFile) return;
    const fetchContent = async () => {
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_API_URL}/weather-file-content/${selectedFile}`
        );
        setFileContent(resp.data);
        // Transform to chart data if temperature fields exist
        if (Array.isArray(resp.data)) {
          // assume each item has date, temperature_2m_max, temperature_2m_min
          const chart = resp.data.map((item) => ({
            date: item.date || item.time || "",
            temp_max: item.temperature_2m_max,
            temp_min: item.temperature_2m_min,
          }));
          setChartData(chart);
        } else if (resp.data && typeof resp.data === "object") {
          // single day data
          const { date, temperature_2m_max, temperature_2m_min } = resp.data;
          setChartData([
            {
              date,
              temp_max: temperature_2m_max,
              temp_min: temperature_2m_min,
            },
          ]);
        }
      } catch (err) {
        console.error(err);
        setFileContent(null);
        setChartData([]);
      }
    };
    fetchContent();
  }, [selectedFile]);

  const handleStoreWeather = async (payload) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/store-weather-data`,
        payload
      );
      // Optionally trigger a refresh of file list (could be done via context or event)
    } catch (err) {
      console.error("Error storing weather data:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Weather Explorer</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <InputPanel onSubmit={handleStoreWeather} />
          <FileList onSelect={setSelectedFile} />
        </div>
        <div className="space-y-4">
          <FileViewer fileName={selectedFile} />
          <Chart data={chartData} />
          <Table data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default App;
