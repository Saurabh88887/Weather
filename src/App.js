import React, { useState } from "react";
import { motion } from "framer-motion"; // ✨ animations

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    setLoading(true);

    try {
      const res1 = await fetch(`http://localhost:5000/api/weather?city=${city}`);
      const data1 = await res1.json();

      const res2 = await fetch(`http://localhost:5000/api/forecast?city=${city}`);
      const data2 = await res2.json();

      if (data1.error || data2.error) {
        setError(data1.error || data2.error);
        setWeather(null);
        setForecast([]);
      } else {
        setWeather(data1);
        setForecast(data2);
        setError("");
      }
    } catch (err) {
      setError("Backend not responding");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic background
  const getBackground = () => {
    if (!weather) return "linear-gradient(to bottom, #87CEFA, #f0f8ff)";

    const desc = weather.description.toLowerCase();
    if (desc.includes("sun")) return "linear-gradient(to bottom, #FFD700, #FF8C00)";
    if (desc.includes("cloud")) return "linear-gradient(to bottom, #d3d3d3, #808080)";
    if (desc.includes("rain")) return "linear-gradient(to bottom, #00c6ff, #0072ff)";
    if (desc.includes("snow")) return "linear-gradient(to bottom, #E0FFFF, #AFEEEE)";
    if (desc.includes("storm")) return "linear-gradient(to bottom, #232526, #414345)";
    return "linear-gradient(to bottom, #87CEFA, #f0f8ff)";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background: getBackground(),
        color: "#222",
        padding: "20px",
        transition: "background 1s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "#fff", textShadow: "2px 2px 5px rgba(0,0,0,0.4)" }}>
        🌤 Weather App
      </h1>

      {/* Input & Button */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "8px",
            width: "200px",
          }}
        />
        <button
          onClick={getWeather}
          style={{
            padding: "10px 18px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Get Weather
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              border: "6px solid rgba(255,255,255,0.3)",
              borderTop: "6px solid #fff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>
            {`@keyframes spin { 
                0% { transform: rotate(0deg); } 
                100% { transform: rotate(360deg); } 
              }`}
          </style>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Current weather */}
      {weather && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            marginTop: "10px",
            padding: "20px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            color: "#fff",
            width: "280px",
          }}
        >
          <h2>
            {weather.city}, {weather.country}
          </h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="icon"
          />
          <p>🌡️ Temp: {weather.temp}°C (feels {weather.feels_like}°C)</p>
          <p>
            📉 Min: {weather.temp_min}°C | 📈 Max: {weather.temp_max}°C
          </p>
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>🌬️ Wind: {weather.wind_speed} m/s</p>
          <p>☁️ Condition: {weather.description}</p>
        </motion.div>
      )}

      {/* 5-day forecast */}
      {forecast.length > 0 && !loading && (
        <div style={{ marginTop: "30px", width: "90%" }}>
          <h3
            style={{
              color: "#fff",
              textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            📅 5-Day Forecast
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "20px",
              justifyItems: "center",
            }}
          >
            {forecast.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                style={{
                  padding: "15px",
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: "12px",
                  width: "140px",
                  textAlign: "center",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  color: "#bc3a3a",
                  backdropFilter: "blur(6px)",
                }}
              >
                <p style={{ fontWeight: "bold" }}>
                  {new Date(day.date).toLocaleDateString()}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt="forecast-icon"
                />
                <p style={{ margin: "5px 0" }}>{day.temp}°C</p>
                <p style={{ fontSize: "14px" }}>{day.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
