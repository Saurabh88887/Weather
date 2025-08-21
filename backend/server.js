// backend/server.js
const axios = require("axios");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "03b42c9a5d872139a39fc30cb9bf0e8d"; // 🔑 Replace with your OpenWeather key

// 🌤 Current Weather API
app.get("/api/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const { data } = await axios.get(url);

    res.json({
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    });
  } catch (error) {
    console.error("❌ Weather API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Could not fetch weather data" });
  }
});

// 📅 5-Day Forecast API
app.get("/api/forecast", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const { data } = await axios.get(url);

    // ✅ Pick one reading per day (12:00 PM)
    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    res.json(
      daily.map(item => ({
        date: item.dt_txt,
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      }))
    );
  } catch (error) {
    console.error("❌ Forecast API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Could not fetch forecast data" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
