import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./whatsAppChatAnalyzer.css";
import { app } from "../config";

export default function WhatsAppChatAnalyzer() {
  const [chartData, setChartData] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    setFileName(file.name);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${app.backendURL}/upload/file`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setChartData(result.result || []);
      setActiveUsers(result.active4Days || []);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weekly-container">
      <h2 className="weekly-title">WhatsAppChatAnalyzer</h2>

      <label className="file-upload">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          disabled={loading}
        />
        <span>{fileName ? fileName : "Choose WhatsApp .txt file"}</span>
      </label>

      {loading && <p className="processing-text">Processing file...</p>}

      {chartData.length > 0 && (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="active" name="Active Users" fill="#2563eb" />
              <Bar dataKey="joined" name="New Users Joined" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="active-users-card">
        <h3 className="card-title">Users Active for 4 Days in Last 7 Days</h3>
        {activeUsers.length > 0 && (
          <ul className="users-list">
            {activeUsers.map((user) => (
              <li key={user}>{user}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
