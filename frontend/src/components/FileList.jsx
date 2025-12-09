import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";

const FileList = ({ onSelect, refreshTrigger }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_API_URL}/list-weather-files`
      );
      setFiles(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const handleSelect = (file) => {
    setSelectedFile(file.filename);
    onSelect(file.filename);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📁 Stored Files
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
        <h2 className="text-lg font-semibold text-gray-800">📁 Stored Files</h2>
        <button
          onClick={fetchFiles}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">📭</p>
          <p>No files stored yet</p>
        </div>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {files.map((file) => (
            <li
              key={file.filename}
              onClick={() => handleSelect(file)}
              className={`cursor-pointer p-3 rounded-lg transition-all ${
                selectedFile === file.filename
                  ? "bg-blue-100 border-l-4 border-blue-600"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                  {file.filename}
                </span>
                <span className="text-xs text-gray-500">
                  {formatSize(file.size)}
                </span>
              </div>
              {file.last_modified && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(file.last_modified)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
