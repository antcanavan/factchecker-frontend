import React, { useState } from "react";
import axios from "axios";

export default function FactCheckerApp() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://factchecker-backend.onrender.com/factcheck",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(response.data);
    } catch (err) {
      console.error("Error:", err);
      setResult({ fact_check: "Something went wrong." });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Screenshot Fact-Checker</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <button
        onClick={handleSubmit}
        disabled={loading || !file}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {loading ? "Checking..." : "Upload & Fact Check"}
      </button>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Extracted Text:</h2>
          <p>{result.extracted_text}</p>

          <h2>Fact-Check Result:</h2>
          <p>{result.fact_check}</p>

          {result.citations?.length > 0 && (
            <>
              <h3>Sources:</h3>
              <ul>
                {result.citations.map((url, idx) => (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
