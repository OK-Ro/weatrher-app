import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TbSunset2 } from "react-icons/tb";
import { GiSunrise } from "react-icons/gi";
import { fetchWeatherData } from "../data/WeatherApi"; // Import the fetchWeatherData function

const SunriseSunsetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: rgba(30, 33, 58, 0.95);
  border-radius: 1rem;
  color: white;
  width: 12.7vw;
  height: 16vh;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin: 1rem auto;
  font-family: "Arial", sans-serif; /* Modern font */
`;

const Header = styled.h3`
  margin: 0;
  font-size: 1.8rem; /* Increased font size */
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Shadow for depth */
`;

const SemicircleContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
`;

const Semicircle = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const SunPosition = styled.circle`
  fill: rgba(255, 255, 0, 1); /* Solid bright yellow */
  transition: transform 0.5s ease; /* Smooth transition for sun movement */
  filter: drop-shadow(0 0 30px rgba(255, 255, 0, 1)); /* Enhanced glow effect */
`;

const TimeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`;

const TimeText = styled.p`
  margin: 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column; /* Stack icon and text vertically */
  text-align: center; /* Center align text */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Shadow for depth */
`;

const Icon = styled.div`
  margin-bottom: 0.1rem; /* Space between icon and text */
  color: yellow; /* Icon color */
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7)); /* Glow effect */
`;

const SunriseSunset = ({ latitude, longitude }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sunriseTime, setSunriseTime] = useState("");
  const [sunsetTime, setSunsetTime] = useState("");

  useEffect(() => {
    const fetchSunTimes = async () => {
      try {
        const weatherData = await fetchWeatherData(latitude, longitude);
        const { sunrise, sunset } = weatherData.daily; // Adjust based on the API response structure
        setSunriseTime(new Date(sunrise[0]).toLocaleTimeString());
        setSunsetTime(new Date(sunset[0]).toLocaleTimeString());
      } catch (error) {
        console.error("Error fetching sunrise and sunset times:", error);
      }
    };

    fetchSunTimes();

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [latitude, longitude]);

  // Calculate the sun's position based on the current time
  const sunriseDate = new Date(`1970-01-01T${sunriseTime}:00Z`);
  const sunsetDate = new Date(`1970-01-01T${sunsetTime}:00Z`);

  // Calculate the sun's position as a percentage of the day
  const totalDayTime = sunsetDate - sunriseDate;
  const currentDayTime = currentTime - sunriseDate;
  const sunPosition = Math.min(Math.max(currentDayTime / totalDayTime, 0), 1); // Clamp between 0 and 1

  // Calculate the angle for the sun's position
  const angle = sunPosition * Math.PI; // 0 to π (180 degrees)
  const radius = 100; // Radius of the semicircle
  const sunX = radius + radius * Math.cos(angle); // X position
  const sunY = 100 - 10; // Y position fixed just above the dotted line

  return (
    <SunriseSunsetContainer>
      <Header>Sunrise & Sunset</Header>
      <SemicircleContainer>
        <Semicircle viewBox="0 0 200 100">
          {/* Dotted semicircle line */}
          <path
            d="M 0,100 A 100,100 0 0,1 200,100"
            fill="none"
            stroke="rgba(255, 255, 0, 0.5)"
            strokeWidth="3" // Increased stroke width
            strokeDasharray="5,5" // Dotted line
          />
          {/* Sun position */}
          <SunPosition cx={sunX} cy={sunY} r="12" />{" "}
          {/* Increased radius for visibility */}
          {/* Highlighted segment */}
          <path
            d={`M 0,100 A 100,100 0 0,1 ${sunX},${sunY}`} // Highlighted segment up to the sun's position
            fill="none"
            stroke="rgba(255, 255, 0, 1)" // Bright yellow for the current level
            strokeWidth="3"
          />
        </Semicircle>
      </SemicircleContainer>
      <TimeContainer>
        <TimeText>
          <Icon>
            <GiSunrise size={24} />
          </Icon>
          <span>Sunrise</span>
          <span>{sunriseTime}</span>
        </TimeText>
        <TimeText>
          <Icon>
            <TbSunset2 size={24} />
          </Icon>
          <span>Sunset</span>
          <span>{sunsetTime}</span>
        </TimeText>
      </TimeContainer>
    </SunriseSunsetContainer>
  );
};

export default SunriseSunset;
