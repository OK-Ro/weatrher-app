import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  FaSun,
  FaCloudSun,
  FaCloud,
  FaCloudRain,
  FaSmog,
} from "react-icons/fa"; // Importing weather icons
import { fetchWeatherData } from "../data/WeatherApi";

const TemperatureContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgba(30, 33, 58, 0.95);
  border-radius: 1rem;
  color: white;
  width: 90%;
  height: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    width: 95%;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const TemperatureHeader = styled.h3`
  margin: 0;
  font-size: 1.2rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const TemperatureValue = styled.p`
  font-size: 2rem;
  margin: 0;
  margin-top: 2rem;
  font-weight: 900;

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-top: 1rem;
  }
`;

const WeatherCondition = styled.p`
  margin: 0;
  font-size: 1rem;
  display: flex;
  align-items: center;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const MinMaxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const MinMaxText = styled.p`
  margin: 0;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const WeatherIcon = styled.div`
  margin-right: 0.5rem; // Space between icon and text
`;

const Temperature = () => {
  const [currentTemp, setCurrentTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [minTemp, setMinTemp] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState("");
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const weatherData = await fetchWeatherData(latitude, longitude);

        // Log the entire weather data response
        console.log("Weather Data:", weatherData);

        // Check if current weather data exists
        if (weatherData.current_weather) {
          setCurrentTemp(weatherData.current_weather.temperature);
          const weatherCode = weatherData.current_weather.weathercode;
          setWeatherCondition(getWeatherCondition(weatherCode));
          setWeatherIcon(getWeatherIcon(weatherCode));

          // Assuming daily temperature data is available
          setMaxTemp(weatherData.daily.temperature_2m_max[0]); // Today's max temperature
          setMinTemp(weatherData.daily.temperature_2m_min[0]); // Today's min temperature
        } else {
          setError("Current weather data is not available.");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to fetch weather data.");
      }
    };

    const handleError = (error) => {
      console.error("Error getting geolocation:", error);
      setError("Unable to get your location.");
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchData, handleError);
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const getWeatherCondition = (weatherCode) => {
    // Map weather codes to conditions (this is a simplified example)
    const weatherConditions = {
      0: "Clear",
      1: "Partly Cloudy",
      2: "Cloudy",
      3: "Overcast",
      51: "Fog",
      53: "Haze",
      // Add more weather codes as needed
    };
    return weatherConditions[weatherCode] || "Unknown";
  };

  const getWeatherIcon = (weatherCode) => {
    // Map weather codes to icons
    switch (weatherCode) {
      case 0:
        return <FaSun size={24} />;
      case 1:
        return <FaCloudSun size={24} />;
      case 2:
        return <FaCloud size={24} />;
      case 3:
        return <FaCloudRain size={24} />;
      case 51:
        return <FaSmog size={24} />;
      case 53:
        return <FaSmog size={24} />;
      default:
        return null; // No icon for unknown weather codes
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <TemperatureContainer>
      <LeftContainer>
        <TemperatureHeader>Temperature</TemperatureHeader>
        <TemperatureValue>
          {currentTemp !== null ? `${currentTemp}°C` : "Loading..."}
        </TemperatureValue>
        <WeatherCondition>
          <WeatherIcon>{weatherIcon}</WeatherIcon>
          {weatherCondition}
        </WeatherCondition>
        <MinMaxContainer>
          <MinMaxText>
            Max: {maxTemp !== null ? `${maxTemp}°C` : "Loading..."}
          </MinMaxText>
          <MinMaxText>
            Min: {minTemp !== null ? `${minTemp}°C` : "Loading..."}
          </MinMaxText>
        </MinMaxContainer>
      </LeftContainer>
    </TemperatureContainer>
  );
};

export default Temperature;
