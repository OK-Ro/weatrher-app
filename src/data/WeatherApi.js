import axios from "axios";

const BASE_URL = "https://api.open-meteo.com/v1";

export const fetchWeatherData = async (latitude, longitude) => {
  // Validate latitude and longitude
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    throw new Error("Latitude and longitude must be numbers");
  }

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        latitude,
        longitude,
        current_weather: true,
        hourly:
          "temperature_2m,relative_humidity_2m,windspeed_10m,weathercode,precipitation",
        daily:
          "weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max,precipitation_sum",
        timezone: "auto",
        forecast_days: 14, // Get forecast for 14 days
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data. Please try again later.");
  }
};

export const getWeatherIcon = (weatherCode) => {
  const weatherIcons = {
    0: "sunny",
    1: "partly_sunny",
    2: "partly_sunny",
    3: "partly_sunny",
    51: "rainy",
    52: "rainy",
    53: "rainy",
    54: "rainy",
    55: "rainy",
    56: "rainy",
    57: "rainy",
    61: "rainy",
    62: "rainy",
    63: "rainy",
    64: "rainy",
    65: "rainy",
    66: "snowy",
    67: "snowy",
    71: "snowy",
    72: "snowy",
    73: "snowy",
    74: "snowy",
    75: "snowy",
    76: "snowy",
    80: "rainy",
    81: "rainy",
    82: "rainy",
    95: "thunderstorm",
    // Add more codes as necessary
  };

  return weatherIcons[weatherCode] || "cloudy";
};

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const getWindData = (weatherData) => {
  if (!weatherData || !weatherData.current_weather) {
    return { speed: "N/A", time: "N/A" };
  }

  const { windspeed, time } = weatherData.current_weather;

  // Format the time
  const formattedTime = new Date(time).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return {
    speed: windspeed.toFixed(1), // Round to one decimal place
    time: formattedTime,
  };
};
