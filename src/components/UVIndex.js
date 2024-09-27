import React, { useEffect, useState } from "react";
import styled from "styled-components";
const UVIndexContainer = styled.div`
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
  font-family: "Arial", sans-serif;

  @media (max-width: 768px) {
    width: 80%;
    height: 25vh;
  }
`;

const Header = styled.h3`
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const HalfCircleContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 120px;
  }

  @media (max-width: 480px) {
    height: 100px;
  }
`;

const HalfCircle = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const UVIndicator = styled.path`
  fill: rgba(173, 216, 230, 1);
  transition: d 0.5s ease;
`;

const ValueText = styled.p`
  font-size: 2rem;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const UVLabel = styled.p`
  font-size: 1rem;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Mark = styled.text`
  font-size: 1rem;
  fill: white;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const UVIndex = () => {
  const [uvIndex, setUvIndex] = useState(0);

  useEffect(() => {
    const fetchUVIndex = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=52.09&longitude=5.12&daily=uv_index_max&timezone=Europe/Amsterdam`
        );
        const data = await response.json();
        const uvIndexValue = data.daily.uv_index_max[0]; // Extract UV index for today
        setUvIndex(uvIndexValue);
      } catch (error) {
        console.error("Error fetching UV index:", error);
      }
    };

    fetchUVIndex();
  }, []);

  const angle = (uvIndex / 12) * Math.PI;
  const radius = 100;
  const uvX = radius + radius * Math.cos(angle);
  const uvY = 100 - radius * Math.sin(angle);

  const fillPath = `M 0,100 A 100,100 0 0,1 ${uvX},${uvY} L ${uvX},100 Z`;

  return (
    <UVIndexContainer>
      <Header>UV Index</Header>
      <HalfCircleContainer>
        <HalfCircle viewBox="0 0 200 100">
          <path
            d="M 0,100 A 100,100 0 0,1 200,100"
            fill="white"
            stroke="white"
            strokeWidth="3"
          />
          <UVIndicator d={fillPath} />
          {[0, 2, 4, 6, 8, 10, 12].map((value, index) => {
            const markAngle = (value / 12) * Math.PI;
            const markX = 100 + 80 * Math.cos(markAngle);
            const markY = 100 - 80 * Math.sin(markAngle);
            return (
              <Mark key={index} x={markX} y={markY} textAnchor="middle">
                {value}
              </Mark>
            );
          })}
        </HalfCircle>
      </HalfCircleContainer>
      <ValueText>{uvIndex}</ValueText>
      <UVLabel>UV Index Level</UVLabel>
    </UVIndexContainer>
  );
};

export default UVIndex;
