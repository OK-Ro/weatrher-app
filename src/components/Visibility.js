import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaEye } from "react-icons/fa"; // Importing an eye icon
import { fetchWeatherData } from "../data/WeatherApi";

const VisibilityContainer = styled.div`
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

const VisibilityHeader = styled.h3`
  margin: 0;
  font-size: 1.2rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const VisibilityValue = styled.p`
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

const RightNowText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Visibility = () => {
  const [visibility, setVisibility] = useState(null);
  const [hazeInfo, setHazeInfo] = useState("Haze is affecting visibility."); // Default message
  const [rightNowText, setRightNowText] = useState("Loading..."); // Default loading message
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
          // Attempt to get visibility from the hourly data or set a default message
          const currentVisibility =
            weatherData.current_weather.winddirection ||
            "Visibility data not available"; // Adjust this based on actual API response
          setVisibility(currentVisibility);

          // Check for haze information
          if (weatherData.current_weather.weathercode === 53) {
            setHazeInfo("Haze is affecting visibility.");
            setRightNowText("Visibility is affected");
          } else {
            setHazeInfo("Visibility is clear.");
            setRightNowText("Visible");
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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <VisibilityContainer>
      <LeftContainer>
        <VisibilityHeader>Visibility</VisibilityHeader>
        <VisibilityValue>
          {visibility !== null ? `${visibility} km` : "Loading..."}
        </VisibilityValue>
      </LeftContainer>
      <DewPointContainer>
        <FaEye size={24} />
        <DewPointText>{hazeInfo}</DewPointText>
        <RightNowText>{rightNowText}</RightNowText>
      </DewPointContainer>
    </VisibilityContainer>
  );
};

export default Visibility;
