import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

// Keyframes for the loading animation
const animate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled components for the UV index meter
const MeterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 200px; /* Height for the half-circle */
  width: 200px; /* Width for the half-circle */
`;

const Loader = styled.div`
  position: relative;
  width: 160px; /* Inner circle width */
  height: 80px; /* Half-circle height */
  overflow: hidden;
`;

const LoaderInner = styled.div`
  position: absolute;
  bottom: 0; /* Align to bottom to form a half-circle */
  left: 0;
  right: 0;
  height: 100px; /* Full height for inner circle */
  background: #212121; /* Inner circle color */
  border-radius: 80px 80px 0 0; /* Half-circle shape */
  box-shadow: inset -2px -2px 5px rgba(255, 255, 255, 0.2),
    inset 3px 3px 5px rgba(0, 0, 0, 0.5);
`;

const MeterSpan = styled.span`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 80px 80px 0 0; /* Half-circle shape */
  background-image: linear-gradient(
    -225deg,
    #ff7402 0%,
    #ffe700 50%,
    #fff55e 100%
  ); /* Gradient color */
  filter: blur(20px);
  z-index: -1;
  animation: ${animate} 2s linear infinite; /* Infinite rotation animation */
  transform-origin: bottom; /* Rotate from the bottom */
`;

const UVValue = styled.div`
  font-size: 1.8em; /* Larger font size */
  color: #333; /* Darker color for readability */
  font-weight: bold;
  margin-top: 15px; /* Increased spacing below the meter */
`;

const UVIndex = () => {
  const [uvIndex, setUvIndex] = useState(null);

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

  return (
    <MeterWrapper>
      <Loader>
        <LoaderInner />
        <MeterSpan />
      </Loader>
      <UVValue>{uvIndex !== null ? `UV: ${uvIndex}` : "Loading..."}</UVValue>
    </MeterWrapper>
  );
};

export default UVIndex;
