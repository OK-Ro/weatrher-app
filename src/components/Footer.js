import React from "react";
import styled from "styled-components";

const FooterContainer = styled.div`
  width: 60vh;
  height: 6vh;
  background-color: #2c3e50;
  color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem 0;
  border-radius: 3rem;
  position: absolute;
  margin-top: 1vh;
  margin-bottom: 2vh;
  left: 35%;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 40vh;
    height: 5vh;
    left: 40%;
  }

  @media (max-width: 480px) {
    width: 80vw;
    height: 7vh;
    left: 10%;
    padding: 0.5rem 0;
    border-radius: 2rem;
  }

  @media (max-width: 320px) {
    width: 90vw;
    height: 7vh;
    left: 5%;
  }
`;

const FooterItem = styled.div`
  font-size: 1rem;
  margin: 0 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin: 0 0.5rem;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterItem>
        © {new Date().getFullYear()} Robert. All rights reserved.
      </FooterItem>
    </FooterContainer>
  );
};

export default Footer;
