import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaTint } from "react-icons/fa"; // Importing a drop icon
import { fetchWeatherData } from "../data/WeatherApi";

const HumidityContainer = styled.div`
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

const HumidityHeader = styled.h3`
  margin: 0;
  font-size: 1.2rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const HumidityValue = styled.p`
  font-size: 2rem;
  margin: 0;
  margin-top: 2rem;
  font-weight: 900;

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-top: 1rem;
  }
`;

const DewPointContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const DewPointText = styled.p`
  margin: 0;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const DewPointValue = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 900;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const RightNowText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Humidity = () => {
  const [humidity, setHumidity] = useState(null);
  const [dewPoint, setDewPoint] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const weatherData = await fetchWeatherData(latitude, longitude);

        console.log("Weather Data:", weatherData);

        if (weatherData.current_weather) {
          const currentTemperature = weatherData.current_weather.temperature;

          const currentTime = new Date(weatherData.current_weather.time);
          const currentHour = currentTime.getUTCHours();
          const currentDay = currentTime.toISOString().split("T")[0];

          const hourlyTimes = weatherData.hourly.time;
          const hourlyIndex = hourlyTimes.findIndex(
            (time) =>
              time.startsWith(currentDay) &&
              time.includes(`${currentHour.toString().padStart(2, "0")}`)
          );

          if (hourlyIndex !== -1) {
            const currentHumidity =
              weatherData.hourly.relative_humidity_2m[hourlyIndex];
            setHumidity(currentHumidity);

            if (
              currentHumidity !== undefined &&
              currentTemperature !== undefined
            ) {
              const dewPointValue = calculateDewPoint(
                currentTemperature,
                currentHumidity
              );
              setDewPoint(dewPointValue);
            } else {
              setError("Humidity or temperature data is missing.");
            }
          } else {
            setError("Hourly data not found for the current time.");
          }
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

  const calculateDewPoint = (temperature, humidity) => {
    const a = 17.27;
    const b = 237.7;
    const alpha =
      (a * temperature) / (b + temperature) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint.toFixed(2);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <HumidityContainer>
      <LeftContainer>
        <HumidityHeader>Humidity</HumidityHeader>
        <HumidityValue>
          {humidity !== null ? `${humidity}%` : "Loading..."}
        </HumidityValue>
      </LeftContainer>
      <DewPointContainer>
        <FaTint size={24} />
        <DewPointText>Dew Point is:</DewPointText>
        <DewPointValue>
          {dewPoint !== null ? `${dewPoint}°C` : "Loading..."}
        </DewPointValue>
        <RightNowText>right now</RightNowText>
      </DewPointContainer>
    </HumidityContainer>
  );
};

export default Humidity;
