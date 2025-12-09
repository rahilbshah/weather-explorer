import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";

const FileViewer = ({ fileName }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!fileName) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_API_URL}/weather-file-content/${fileName}`
        );
        setData(resp.data);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fileName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!fileName) {
    return (
      <div className="glass-card rounded-xl shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📄 File Content
        </h2>
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">👆</p>
          <p>Select a file to view its content</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-card rounded-xl shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📄 File Content
        </h2>
        <div className="flex items-center justify-center py-8">
          <Spinner size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">📄 File Content</h2>
        <button
          onClick={handleCopy}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg font-medium transition-colors"
        >
          {copied ? "✅ Copied!" : "📋 Copy"}
        </button>
      </div>
      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-64">
        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FileViewer;
