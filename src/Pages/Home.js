import React from "react";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";

const HomeContainer = styled.div`
  display: flex;
  height: 90vh;
  padding: 3rem;
  border-radius: 4rem;

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 2rem;
    flex-direction: column;
    height: auto;
    with: 100%;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 1rem;
  }

  @media (max-width: 320px) {
    padding: 0.5rem;
    border-radius: 0.5rem;
  }
`;

const Home = () => {
  return (
    <HomeContainer>
      <Sidebar />
      <MainContent />
    </HomeContainer>
  );
};

export default Home;
