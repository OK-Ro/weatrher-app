import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaMapMarkerAlt, FaRegCalendarAlt, FaSearch } from "react-icons/fa";
import {
  WiDaySunny,
  WiRain,
  WiCloudy,
  WiDayCloudy,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import {
  fetchWeatherData,
  getWeatherIcon,
  formatDate,
} from "../data/WeatherApi";

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const getBackgroundGradient = (weatherCode, isDay) => {
  const opacity = 0.7;
  if (isDay) {
    switch (weatherCode) {
      case "sunny":
        return `linear-gradient(-45deg, 
          rgba(246, 211, 101, ${opacity}), 
          rgba(253, 160, 133, ${opacity}))`;
      case "partly_sunny":
        return `linear-gradient(-45deg, 
          rgba(132, 250, 176, ${opacity}), 
          rgba(143, 211, 244, ${opacity}))`;
      case "cloudy":
        return `linear-gradient(-45deg, 
          rgba(166, 192, 254, ${opacity}), 
          rgba(246, 128, 132, ${opacity}))`;
      case "rainy":
        return `linear-gradient(-45deg, 
          rgba(79, 172, 254, ${opacity}), 
          rgba(0, 242, 254, ${opacity}))`;
      case "snowy":
        return `linear-gradient(-45deg, 
          rgba(230, 233, 240, ${opacity}), 
          rgba(238, 241, 245, ${opacity}))`;
      default:
        return `linear-gradient(-45deg, 
          rgba(109, 213, 237, ${opacity}), 
          rgba(33, 147, 176, ${opacity}))`;
    }
  } else {
    return `linear-gradient(-45deg, 
      rgba(41, 46, 73, ${opacity}), 
      rgba(83, 105, 118, ${opacity}))`;
  }
};

const WeatherContainer = styled.div`
  background: ${(props) =>
    getBackgroundGradient(props.weatherType, props.isDay)};
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  border-radius: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 40rem;
  height: auto;
  min-height: 36rem;
  padding: 2rem;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 1.5rem;
  }
`;

const GlassOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  padding: 0.8rem 1.5rem;
  width: 60%;

  @media (max-width: 480px) {
    width: 100%;
    margin-bottom: 1rem;
  }

  input {
    background: transparent;
    border: none;
    color: white;
    font-size: 1rem;
    margin-left: 0.8rem;
    width: 100%;
    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
    &:focus {
      outline: none;
    }
  }
`;

const ToggleButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const MainInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-grow: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const WeatherIcon = styled.div`
  font-size: 8rem;
  color: white;
  animation: ${float} 3s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 6rem;
    margin-bottom: 1rem;
  }
`;

const TemperatureWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Temperature = styled.div`
  font-size: 8rem;
  font-weight: 900;
  margin-right: 2rem;
  color: transparent;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.3)
  );
  background-clip: text;
  -webkit-background-clip: text;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 6rem;
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const Description = styled.div`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  margin-left: 1rem;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  height: 10rem;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    writing-mode: horizontal-tb;
    transform: none;
    height: auto;
    margin-left: 0;
  }
`;

const LocationInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Location = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;

  .location-icon {
    margin-right: 0.8rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const DateTime = styled.div`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;

  .calendar-icon {
    margin-right: 0.8rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CurrentWeather = () => {
  const [unit, setUnit] = useState("C");
  const [weatherData, setWeatherData] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 52.03, lon: 5.17 }); // Initial coordinates
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationInput, setLocationInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWeatherData(coordinates.lat, coordinates.lon);
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [coordinates]);

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  const convertTemp = (temp) => {
    if (unit === "F") {
      return ((temp * 9) / 5 + 32).toFixed(0);
    }
    return temp.toFixed(0);
  };

  // Function to get coordinates from the location input using Open Meteo API
  const getCoordinatesFromLocation = async (location) => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
      );
      const data = await response.json();
      console.log("API response:", data); // Log the response for debugging
      if (data.results.length > 0) {
        const { latitude, longitude } = data.results[0];
        setCoordinates({ lat: latitude, lon: longitude });
        console.log("Coordinates set to:", { lat: latitude, lon: longitude });
      } else {
        console.error("Location not found");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (locationInput.trim()) {
      getCoordinatesFromLocation(locationInput);
      setLocationInput("");
    } else {
      console.warn("Please enter a location.");
    }
  };

  if (!weatherData) return <div>Loading...</div>;

  const currentWeather = weatherData.current_weather;
  const isDay = currentTime.getHours() >= 6 && currentTime.getHours() < 18;

  const getWeatherIconComponent = (weatherCode) => {
    const iconType = getWeatherIcon(weatherCode);
    switch (iconType) {
      case "sunny":
        return <WiDaySunny />;
      case "rainy":
        return <WiRain />;
      case "cloudy":
        return <WiCloudy />;
      case "partly_sunny":
        return <WiDayCloudy />;
      case "snowy":
        return <WiSnow />;
      case "thunderstorm":
        return <WiThunderstorm />;
      default:
        return <WiCloudy />;
    }
  };

  return (
    <WeatherContainer
      weatherType={getWeatherIcon(currentWeather.weathercode)}
      isDay={isDay}
    >
      <GlassOverlay />
      <ContentWrapper>
        <TopSection>
          <SearchBox onSubmit={handleSearch}>
            <FaSearch size={24} />
            <input
              placeholder="Search location..."
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
          </SearchBox>
          <ToggleButton onClick={toggleUnit}>
            °{unit === "C" ? "F" : "C"}
          </ToggleButton>
        </TopSection>
        <MainInfo>
          <WeatherIcon>
            {getWeatherIconComponent(currentWeather.weathercode)}
          </WeatherIcon>
          <TemperatureWrapper>
            <Temperature>
              {convertTemp(currentWeather.temperature)}°
            </Temperature>
            <Description>
              {getWeatherIcon(currentWeather.weathercode).replace("_", " ")}
            </Description>
          </TemperatureWrapper>
        </MainInfo>
        <LocationInfo>
          <Location>
            <FaMapMarkerAlt className="location-icon" size={24} /> Houten,
            Utrecht
          </Location>
          <DateTime>
            <FaRegCalendarAlt className="calendar-icon" size={20} />
            {currentTime.toLocaleTimeString()} -{" "}
            {formatDate(currentWeather.time)}
          </DateTime>
        </LocationInfo>
      </ContentWrapper>
    </WeatherContainer>
  );
};

export default CurrentWeather;
