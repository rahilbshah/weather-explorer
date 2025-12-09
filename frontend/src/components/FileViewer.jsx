import React, { useEffect, useState } from "react";
import axios from "axios";

const FileViewer = ({ fileName }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fileName) return;
    const fetchData = async () => {
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_API_URL}/weather-file-content/${fileName}`
        );
        setData(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fileName]);

  if (!fileName) return <p>Select a file to view.</p>;
  if (loading) return <p>Loading file...</p>;
  return (
    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default FileViewer;
