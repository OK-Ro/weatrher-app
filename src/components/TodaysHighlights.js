import React from "react";
import styled from "styled-components";
import WindStatus from "./WindStatus";
import Humidity from "./Humidity";
import Visibility from "./Visibility";
import Temperature from "./Temperature";
import SunriseSunset from "./SunriseSunset";
import UVIndex from "./UVIndex";

const HighlightsContainer = styled.div`
  width: 46.1vw;
  height: 100%;
  background: linear-gradient(
    -45deg,
    rgba(74, 144, 226, 0.9),
    rgba(99, 179, 237, 0.9),
    rgba(72, 187, 120, 0.9),
    rgba(56, 178, 172, 0.9)
  );
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  border-radius: 2rem;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @media (max-width: 768px) {
    width: 100vw;
    padding: 1rem;
    border-radius: 3rem;
  }
`;

const HighlightsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    text-align: center;
  }
`;

const LargeCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0;
    margin-bottom: 0.9rem;
  }

  // @media (max-width: 480px) {
  //   grid-template-columns: 1fr;
  //   gap: 0.5rem;
  // }
`;

const LargeHighlightCard = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  height: 20vh;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    height: 16rem;
    padding: 1rem;
  }
`;

const SmallCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  height: 10vh;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    height: auto;
    padding: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const SmallHighlightCard = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const TodaysHighlights = () => {
  return (
    <HighlightsContainer>
      <HighlightsTitle>Today's Highlights</HighlightsTitle>
      <LargeCardsContainer>
        <LargeHighlightCard>
          <WindStatus />
        </LargeHighlightCard>
        <LargeHighlightCard>
          <UVIndex />
        </LargeHighlightCard>
        <LargeHighlightCard>
          <SunriseSunset />
        </LargeHighlightCard>
      </LargeCardsContainer>
      <SmallCardsContainer>
        <SmallHighlightCard>
          <Humidity />
        </SmallHighlightCard>
        <SmallHighlightCard>
          <Visibility />
        </SmallHighlightCard>
        <SmallHighlightCard>
          <Temperature />
        </SmallHighlightCard>
      </SmallCardsContainer>
    </HighlightsContainer>
  );
};

export default TodaysHighlights;
