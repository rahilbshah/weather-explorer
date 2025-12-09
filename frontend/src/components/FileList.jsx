import React, { useEffect, useState } from "react";
import axios from "axios";

const FileList = ({ onSelect }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
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
    fetchFiles();
  }, []);

  if (loading) return <p>Loading files...</p>;

  return (
    <ul className="space-y-2">
      {files.map((file) => (
        <li
          key={file}
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={() => onSelect(file)}
        >
          {file}
        </li>
      ))}
    </ul>
  );
};

export default FileList;
