import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaChevronDown } from "react-icons/fa";
import {
  WiDaySunny,
  WiRain,
  WiCloudy,
  WiDayCloudy,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import { fetchWeatherData, getWeatherIcon } from "../data/WeatherApi";

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

const ForecastContainer = styled.div`
  background: linear-gradient(
    -45deg,
    rgba(74, 144, 226, 0.9),
    rgba(99, 179, 237, 0.9),
    rgba(72, 187, 120, 0.9),
    rgba(56, 178, 172, 0.9)
  );
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  border-radius: 2rem;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 1rem;
  }
`;

const ForecastHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ForecastTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const ForecastToggle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
    transform: ${(props) =>
      props.isExpanded ? "rotate(180deg)" : "rotate(0)"};
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.8rem;
  }
`;

const TimelineContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 1rem 0;
  margin-bottom: 0.4rem;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TimelineItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 2rem;
  min-width: 60px;

  @media (max-width: 768px) {
    min-width: 50px;
  }

  @media (max-width: 480px) {
    min-width: 40px;
  }
`;

const TimelineTime = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const TimelineIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const TimelineTemp = styled.div`
  font-size: 1.1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const DailyForecastsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 400px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DailyForecastItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
  }
`;

const WeatherIcon = styled.div`
  font-size: 2.5rem;
  margin-right: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Temperature = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  margin-right: 10rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-right: 5rem;
  }
`;

const WeatherInfo = styled.div`
  flex: 1;
`;

const WeatherDescription = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
  text-transform: capitalize;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Date = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const DayOfWeek = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-left: auto;
  padding-left: 1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 1rem;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;
const WeatherForecast = () => {
  const [forecastDays, setForecastDays] = useState(7);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (position) => {
      try {
        setLoading(true);
        const { latitude, longitude } = position.coords;
        const data = await fetchWeatherData(latitude, longitude);
        setWeatherData(data);
        console.log("Weather Data:", data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to fetch weather data");
        setLoading(false);
      }
    };

    const handleError = (error) => {
      console.error("Error getting geolocation:", error);
      setError(
        "Unable to get your location. Please enable location services and refresh the page."
      );
      setLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchData, handleError);
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const toggleForecastDays = () => {
    setForecastDays(forecastDays === 7 ? 14 : 7);
  };

  const getWeatherIconComponent = (weatherCode) => {
    const iconName = getWeatherIcon(weatherCode);
    switch (iconName) {
      case "sunny":
        return <WiDaySunny />;
      case "partly_sunny":
        return <WiDayCloudy />;
      case "cloudy":
        return <WiCloudy />;
      case "rainy":
        return <WiRain />;
      case "snowy":
        return <WiSnow />;
      case "thunderstorm":
        return <WiThunderstorm />;
      default:
        return <WiCloudy />;
    }
  };

  const formatDate = (dateString) => {
    const [, month, day] = dateString.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${parseInt(day)} ${months[parseInt(month) - 1]}`;
  };

  const getDayOfWeek = (dateString, index) => {
    if (index === 0) return "Today";

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const [y, m, d] = dateString.split("-").map(Number);
    const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
    const monthIndex = m - 1;
    const adjustedYear = monthIndex < 2 ? y - 1 : y;
    const dayOfWeek =
      (adjustedYear +
        Math.floor(adjustedYear / 4) -
        Math.floor(adjustedYear / 100) +
        Math.floor(adjustedYear / 400) +
        t[monthIndex] +
        d) %
      7;
    return days[dayOfWeek];
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!weatherData) return null;

  // Get the current time from the API data
  const currentTimeString = weatherData.current_weather.time;

  // Find the index of the current hour in the hourly data
  const currentHourIndex = weatherData.hourly.time.findIndex(
    (time) => time === currentTimeString
  );

  // Determine the next hour index
  const offsetHours = 1; // Adjust this value as needed
  const nextHourIndex = currentHourIndex + offsetHours;

  const timelineData = [
    {
      time: "Now",
      temp: Math.round(weatherData.current_weather.temperature),
      weatherCode: weatherData.current_weather.weathercode,
    },
    ...weatherData.hourly.time
      .slice(nextHourIndex, nextHourIndex + 23)
      .map((time, index) => ({
        time: time.split("T")[1].slice(0, 5),
        temp: Math.round(
          weatherData.hourly.temperature_2m[nextHourIndex + index]
        ),
        weatherCode: weatherData.hourly.weathercode[nextHourIndex + index],
      })),
  ];

  const dailyForecastData = weatherData.daily.time.map((date, index) => ({
    date,
    temp: Math.round(
      (weatherData.daily.temperature_2m_max[index] +
        weatherData.daily.temperature_2m_min[index]) /
        2
    ),
    weatherCode: weatherData.daily.weathercode[index],
  }));

  return (
    <ForecastContainer>
      <ForecastHeader>
        <ForecastTitle>{forecastDays} Day Forecast</ForecastTitle>
        <ForecastToggle
          onClick={toggleForecastDays}
          isExpanded={forecastDays === 14}
        >
          {forecastDays === 7 ? "14 Days" : "7 Days"}
          <FaChevronDown size={14} />
        </ForecastToggle>
      </ForecastHeader>

      <TimelineContainer>
        {timelineData.slice(0, 8).map((item, index) => (
          <TimelineItem key={index}>
            <TimelineTime>{index === 0 ? "Now" : item.time}</TimelineTime>
            <TimelineIcon>
              {getWeatherIconComponent(item.weatherCode)}
            </TimelineIcon>
            <TimelineTemp>{item.temp}°C</TimelineTemp>
          </TimelineItem>
        ))}
      </TimelineContainer>

      <DailyForecastsContainer>
        {dailyForecastData.slice(0, forecastDays).map((day, index) => (
          <DailyForecastItem key={day.date}>
            <WeatherIcon>
              {getWeatherIconComponent(day.weatherCode)}
            </WeatherIcon>
            <Temperature>{day.temp}°C</Temperature>
            <WeatherInfo>
              <WeatherDescription>
                {getWeatherIcon(day.weatherCode).replace("_", " ")}
              </WeatherDescription>
              <Date>{formatDate(day.date)}</Date>
            </WeatherInfo>
            <DayOfWeek>{getDayOfWeek(day.date, index)}</DayOfWeek>
          </DailyForecastItem>
        ))}
      </DailyForecastsContainer>
    </ForecastContainer>
  );
};

export default WeatherForecast;
