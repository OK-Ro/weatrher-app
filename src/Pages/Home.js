import React from "react";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";

const HomeContainer = styled.div`
  display: flex;
  height: 90vh;

  padding: 3rem;
  border-radius: 4rem;
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
