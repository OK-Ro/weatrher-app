import React from "react";
import styled from "styled-components";
import CurrentWeather from "./CurrentWeather";
import WeatherForecast from "./WeatherForecast";
import TodaysHighlights from "./TodaysHighlights";
import WeatherConditionMap from "./WeatherContainerMap";

const MainContentContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 1fr;
  gap: 2rem;
  padding-left: 2rem;
  border-radius: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    gap: 1.5rem;
    padding-left: 1rem;
  }

  @media (max-width: 480px) {
    padding-left: 0.5rem;
    gap: 1rem;
    border-radius: 1.5rem;
  }
`;

const BaseSection = styled.div`
  border-radius: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  h2 {
    color: white;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    border-radius: 1rem;
  }

  @media (max-width: 480px) {
    border-radius: 0.5rem;
  }
`;

const WeatherSection = styled(BaseSection)`
  grid-column: 1;
  grid-row: 1;
  background-color: rgba(52, 152, 219, 0.8);
  color: white;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: auto;
  }
`;

const ForecastSection = styled(BaseSection)`
  grid-column: 1;
  grid-row: 2;

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: auto;
  }
`;

const RightTopSection = styled(BaseSection)`
  grid-column: 2;
  grid-row: 1;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: auto;
  }
`;

const RightBottomSection = styled(BaseSection)`
  grid-column: 2;
  grid-row: 2;

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: auto;
  }
`;

const MainContent = () => {
  return (
    <MainContentContainer>
      <WeatherSection>
        <CurrentWeather />
      </WeatherSection>
      <RightTopSection>
        <TodaysHighlights />
      </RightTopSection>
      <ForecastSection>
        <WeatherForecast />
      </ForecastSection>
      <RightBottomSection>
        <WeatherConditionMap />
      </RightBottomSection>
    </MainContentContainer>
  );
};

export default MainContent;
