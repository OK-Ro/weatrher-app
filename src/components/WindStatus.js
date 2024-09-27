import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { fetchWeatherData, getWindData } from "../data/WeatherApi";

const WindStatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 1rem;
  color: white;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const Header = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const waveAnimation = keyframes`
  0% { transform: translateX(0) scaleY(1); }
  25% { transform: translateX(-25%) scaleY(0.8); }
  50% { transform: translateX(-50%) scaleY(1.2); }
  75% { transform: translateX(-75%) scaleY(0.9); }
  100% { transform: translateX(-100%) scaleY(1); }
`;

const WaveContainer = styled.div`
  position: relative;
  height: 40px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 30px;
  }

  @media (max-width: 480px) {
    height: 25px;
  }
`;

const Wave = styled.div`
  position: absolute;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    violet,
    indigo,
    blue,
    green,
    yellow,
    orange,
    red,
    transparent
  );
  opacity: 0.6;
  top: ${(props) => props.top}%;
  left: 0;
  animation: ${waveAnimation} ${(props) => props.duration}s linear infinite;
`;

const BarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 60px;
  margin: 1rem 0;

  @media (max-width: 768px) {
    height: 50px;
    margin: 0.8rem 0;
  }

  @media (max-width: 480px) {
    height: 40px;
    margin: 0.5rem 0;
  }
`;

const getGlowColor = (speed) => {
  if (speed < 10) return "#4facfe";
  if (speed < 20) return "#2ecc71";
  if (speed < 30) return "#f1c40f";
  if (speed < 40) return "#e67e22";
  if (speed < 50) return "#e74c3c";
  if (speed < 60) return "#8e44ad";
  if (speed < 70) return "#2980b9";
  if (speed < 80) return "#d35400";
  if (speed < 90) return "#c0392b";
  return "#7f8c8d";
};

const Bar = styled.div`
  width: 4px;
  background-color: ${(props) =>
    props.active ? getGlowColor(props.speed) : "rgba(255, 255, 255, 0.3)"};
  border-radius: 2px;
  height: ${(props) => props.height}%;
  transition: background-color 0.3s ease;

  @media (max-width: 768px) {
    width: 3px;
  }

  @media (max-width: 480px) {
    width: 2px;
  }
`;

const GlowingBar = styled(Bar)`
  box-shadow: ${(props) =>
    props.active
      ? `0 0 5px ${getGlowColor(props.speed)}, 0 0 10px ${getGlowColor(
          props.speed
        )}`
      : "none"};
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-top: 1rem;

  @media (max-width: 768px) {
    margin-top: 0.8rem;
  }

  @media (max-width: 480px) {
    margin-top: 0.5rem;
  }
`;

const WindSpeed = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const WindUnit = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #cccccc;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const WindTime = styled.div`
  font-size: 1rem;
  opacity: 0.7;
  color: #cccccc;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const WindStatus = () => {
  const [windData, setWindData] = useState({ speed: "N/A", time: "N/A" });
  const [error, setError] = useState(null);
  const barHeights = [0, 10, 20, 40, 60, 80, 100, 80, 60, 40, 20, 10, 0];

  useEffect(() => {
    const fetchData = async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const weatherData = await fetchWeatherData(latitude, longitude);
        const windInfo = getWindData(weatherData);
        setWindData(windInfo);
      } catch (error) {
        console.error("Error fetching wind data:", error);
        setError("Failed to fetch weather data. Please try again later.");
      }
    };

    const handleError = (error) => {
      console.error("Error getting geolocation:", error);
      setError(
        "Unable to get your location. Please enable location services and refresh the page."
      );
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchData, handleError);
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const numericSpeed = parseFloat(windData.speed) || 0;

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <WindStatusContainer>
      <Header>Wind Status</Header>
      <WaveContainer>
        <Wave top={0} duration={8} />
        <Wave top={30} duration={10} />
        <Wave top={60} duration={12} />
      </WaveContainer>
      <BarContainer>
        {barHeights.map((height, index) => {
          const isActive = numericSpeed >= index + 1;
          return (
            <GlowingBar
              key={index}
              height={height}
              speed={numericSpeed}
              active={isActive}
            />
          );
        })}
      </BarContainer>
      <InfoContainer>
        <WindSpeed>
          {windData.speed} <WindUnit>km/h</WindUnit>
        </WindSpeed>
        <WindTime>{windData.time}</WindTime>
      </InfoContainer>
    </WindStatusContainer>
  );
};

export default WindStatus;
