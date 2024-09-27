import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Home from "./Pages/Home";
import Footer from "./components/Footer";

const AppWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  background-image: url("https://getwallpapers.com/wallpaper/full/6/a/9/1173035-cold-weather-wallpaper-1920x1200-1080p.jpg");

  background-size: cover;
  background-position: center;
  overflow: hidden;
  padding: 15rem;
`;

const App = () => {
  return (
    <Router>
      <AppWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </AppWrapper>
    </Router>
  );
};

export default App;
