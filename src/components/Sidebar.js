import React, { useState } from "react";
import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";
import { CiMap } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { IoCalendarOutline, IoSettingsOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { VscBell, VscBellDot } from "react-icons/vsc";
import { TiWeatherStormy } from "react-icons/ti";

const SidebarContainer = styled.div`
  width: 150px;
  background: linear-gradient(180deg, #2c3e50 0%, #1a2533 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  border-radius: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 900;
  color: #ffcc00;

  .icon {
    font-size: 3rem;
    margin-bottom: 0.6rem;
  }
`;

const Separator = styled.div`
  width: 80%;
  height: 3px;
  background-color: #34495e;
  margin: 1rem 0;
`;

const NavItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  .icon {
    font-size: 2.5rem;
    transition: all 0.3s ease;
  }

  &:hover {
    .icon {
      color: #ffcc00;
      transform: scale(1.1);
    }

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      height: 100%;
      width: 5px;
      background: linear-gradient(180deg, #ff6b6b, #f06595, #d55a8c);
      transform: translateY(-50%) scaleY(1);
      transition: transform 0.3s ease;
    }
  }
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const NotificationButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  .icon {
    font-size: 2.5rem;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(255, 204, 0, 0.5);
  }
`;

const ProfileIcon = styled(FaUserCircle)`
  font-size: 4rem;
  color: white;
`;

const Sidebar = () => {
  const [hasNotifications, setHasNotifications] = useState(false);

  return (
    <SidebarContainer>
      <Logo>
        <TiWeatherStormy className="icon" />
        <span>Weazai</span>
      </Logo>
      <Separator />
      <NavItem>
        <RxDashboard className="icon" />
      </NavItem>
      <NavItem>
        <CiMap className="icon" />
      </NavItem>
      <NavItem>
        <FiMapPin className="icon" />
      </NavItem>
      <NavItem>
        <IoCalendarOutline className="icon" />
      </NavItem>
      <NavItem>
        <IoSettingsOutline className="icon" />
      </NavItem>
      <Spacer />
      <NotificationButton
        onClick={() => setHasNotifications(!hasNotifications)}
      >
        {hasNotifications ? (
          <VscBellDot className="icon" />
        ) : (
          <VscBell className="icon" />
        )}
      </NotificationButton>
      <ProfileIcon />
    </SidebarContainer>
  );
};

export default Sidebar;
