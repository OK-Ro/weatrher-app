import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import {
  FaChevronDown,
  FaWind,
  FaTint,
  FaPlus,
  FaMinus,
  FaBars,
  FaCube,
  FaSatellite,
  FaMap,
} from "react-icons/fa";
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from "react-icons/wi";
import { GiCompass } from "react-icons/gi";
import { HiSquare3Stack3D } from "react-icons/hi2";

const WeatherMapContainer = styled.div`
  background-color: #1e213a;
  border-radius: 2rem;
  padding: 1.5rem;
  color: white;
  height: 42vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    height: 35vh;
  }

  @media (max-width: 480px) {
    height: 30vh;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;
const TimeChanger = styled.div`
  display: flex;
  align-items: center;
`;

const FormatToggle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.3rem 0.5rem;
  }
`;

const FormatText = styled.span`
  margin-right: 0.5rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Arrow = styled(FaChevronDown)`
  transition: transform 0.3s ease;
  transform: ${(props) => (props.isExpanded ? "rotate(180deg)" : "rotate(0)")};
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const PrecipitationLegend = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  background-color: rgba(30, 33, 58, 0.85);
  padding: 1rem;
  width: 7.5vw;
  border-radius: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 10vw;
    padding: 0.8rem;
  }

  @media (max-width: 480px) {
    width: 12vw;
    padding: 0.5rem;
  }
`;

const LegendTitle = styled.h3`
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const LegendBar = styled.div`
  height: 8px;
  width: 220px;
  background: linear-gradient(to right, #87ceeb, #4682b4, #0000ff, #8b0000);
  border-radius: 4px;
  position: relative;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    width: 180px;
  }

  @media (max-width: 480px) {
    width: 150px;
  }
`;

const LegendLabel = styled.span`
  position: absolute;
  top: 12px;
  font-size: 0.7rem;
  transform: translateX(-50%);
  color: #e7e7eb;
  font-weight: 500;
  margin-left: 0.8rem;

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

const MapContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 2rem;
  overflow: hidden;
`;

const StyledLeafletContainer = styled(LeafletMapContainer)`
  height: 100%;
  width: 100%;
  z-index: 0;
`;

const CityGrid = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: calc(100% - 2rem);
  max-width: 600px;
  z-index: 1;
  background-color: rgba(30, 33, 58, 0.9);
  padding: 1rem;
  border-radius: 1rem;
`;

const CityCard = styled.div`
  background-color: ${(props) => props.bgColor};
  padding: 0.75rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  border: ${(props) => (props.isCurrentCity ? "2px solid #FFD700" : "none")};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CityName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-align: center;
`;

const WeatherIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.25rem;
`;

const Temperature = styled.span`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const WeatherDetails = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.25rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const WeatherDetail = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

const DetailIcon = styled.span`
  margin-right: 0.25rem;
`;

const MapControls = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1;
`;

const ControlButton = styled.button`
  background-color: rgba(
    50,
    50,
    50,
    0.9
  ); // Darker background for better visibility
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3); // Slightly lighter on hover
  }
`;

const DynamicContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 4rem;
  background-color: rgba(30, 33, 58, 0.95);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 250px; // Fixed width
  height: 300px; // Fixed height
  overflow-y: auto;
  display: ${(props) => (props.isVisible ? "block" : "none")};
  color: white;
`;
const CityListContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
`;

const DynamicTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #e7e7eb;
`;

const SearchInput = styled.input`
  width: 94%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const CityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CityButton = styled.button`
  background-color: rgba(255, 255, 255, 0.4);
  border: none;
  border-radius: 0.5rem;
  padding: 1rem;
  color: white;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const MapViewOption = styled(CityButton)`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
  background-color: ${(props) =>
    props.isActive ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"};
`;

const CompassContainer = styled.div`
  position: absolute;
  right: 5rem;
  bottom: 7rem;
  width: 140px;
  height: 140px;
  background-color: rgba(50, 50, 50, 0.9);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const CompassNeedle = styled.div`
  width: 4px;
  height: 50px;
  background-color: red;
  position: relative;
  transform-origin: bottom center;
  transform: ${(props) => `rotate(${props.rotation}deg)`};

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 10px solid red;
  }
`;

const CompassDirections = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: white;
`;

const DirectionLabel = styled.span`
  position: absolute;
  font-size: 12px;
`;

const Compass = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleOrientation = (event) => {
      let angle = event.webkitCompassHeading || Math.abs(event.alpha - 360);
      setRotation(angle);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <CompassContainer>
      <CompassDirections>
        <DirectionLabel style={{ top: "5px" }}>N</DirectionLabel>
        <DirectionLabel style={{ right: "5px" }}>E</DirectionLabel>
        <DirectionLabel style={{ bottom: "5px" }}>S</DirectionLabel>
        <DirectionLabel style={{ left: "5px" }}>W</DirectionLabel>
      </CompassDirections>
      <CompassNeedle rotation={rotation} />
    </CompassContainer>
  );
};

const WeatherConditionMap = () => {
  const cities = [
    {
      name: "California, US",
      icon: <WiDaySunny />,
      temp: "17°C",
      windSpeed: "5 km/h",
      humidity: "45%",
      feelsLike: "18°C",
      rainChance: "10%",
      bgColor: "rgba(255, 165, 0, 0.3)",
      position: [36.7783, -119.4179],
    },
    {
      name: "Texas, US",
      icon: <WiCloudy />,
      temp: "16°C",
      windSpeed: "8 km/h",
      humidity: "60%",
      feelsLike: "15°C",
      rainChance: "30%",
      bgColor: "rgba(119, 136, 153, 0.3)",
      position: [31.9686, -99.9018],
    },
    {
      name: "New York, US",
      icon: <WiRain />,
      temp: "15°C",
      windSpeed: "12 km/h",
      humidity: "80%",
      feelsLike: "13°C",
      rainChance: "70%",
      bgColor: "rgba(112, 128, 144, 0.3)",
      position: [40.7128, -74.006],
    },
    {
      name: "Washington, D.C., US",
      icon: <WiDaySunny />,
      temp: "19°C",
      windSpeed: "6 km/h",
      humidity: "50%",
      feelsLike: "20°C",
      rainChance: "5%",
      bgColor: "rgba(135, 206, 250, 0.3)",
      position: [38.9072, -77.0369],
    },
    {
      name: "Ottawa, Canada",
      icon: <WiSnow />,
      temp: "10°C",
      windSpeed: "15 km/h",
      humidity: "70%",
      feelsLike: "8°C",
      rainChance: "20%",
      bgColor: "rgba(173, 216, 230, 0.3)",
      position: [45.4215, -75.6972],
    },
    {
      name: "London, UK",
      icon: <WiRain />,
      temp: "14°C",
      windSpeed: "10 km/h",
      humidity: "75%",
      feelsLike: "12°C",
      rainChance: "60%",
      bgColor: "rgba(200, 200, 200, 0.3)",
      position: [51.5074, -0.1278],
    },
    {
      name: "Berlin, Germany",
      icon: <WiCloudy />,
      temp: "13°C",
      windSpeed: "7 km/h",
      humidity: "65%",
      feelsLike: "11°C",
      rainChance: "30%",
      bgColor: "rgba(169, 169, 169, 0.3)",
      position: [52.52, 13.405],
    },
    {
      name: "Tokyo, Japan",
      icon: <WiDaySunny />,
      temp: "22°C",
      windSpeed: "9 km/h",
      humidity: "55%",
      feelsLike: "23°C",
      rainChance: "15%",
      bgColor: "rgba(255, 192, 203, 0.3)",
      position: [35.6762, 139.6503],
    },
    {
      name: "Canberra, Australia",
      icon: <WiDaySunny />,
      temp: "25°C",
      windSpeed: "4 km/h",
      humidity: "40%",
      feelsLike: "26°C",
      rainChance: "5%",
      bgColor: "rgba(255, 228, 196, 0.3)",
      position: [-35.2809, 149.13],
    },
    {
      name: "Brasília, Brazil",
      icon: <WiDaySunny />,
      temp: "27°C",
      windSpeed: "5 km/h",
      humidity: "30%",
      feelsLike: "28°C",
      rainChance: "10%",
      bgColor: "rgba(255, 250, 205, 0.3)",
      position: [-15.7942, -47.9292],
    },
  ];

  const [selectedCities, setSelectedCities] = useState(cities.slice(0, 3)); // Initialize with the first three cities

  const [is24Hour, setIs24Hour] = useState(true);
  const [activeControl, setActiveControl] = useState(null);
  const [mapView, setMapView] = useState("default");
  const [currentCity, setCurrentCity] = useState(cities[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const mapRef = useRef(null);

  const toggleFormat = () => {
    setIs24Hour((prev) => !prev);
  };

  const handleControlClick = (control) => {
    setActiveControl((prev) => (prev === control ? null : control));
  };

  const handleMapViewChange = (view) => {
    setMapView(view);
    setActiveControl(null);
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleCitySelect = (city) => {
    setCurrentCity(city);
    setSelectedCities((prev) => {
      // Check if the city is already in the selectedCities
      if (prev.some((c) => c.name === city.name)) {
        return prev;
      }

      return [...prev.slice(1), city];
    });
  };

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  const WeatherIconWithTemp = ({ icon, temp, size = 30 }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: `${size}px`,
        fontWeight: "bold",
      }}
    >
      {icon}
      <div style={{ fontSize: `${size * 0.5}px` }}>{temp}</div>
    </div>
  );

  const renderDynamicContent = () => {
    switch (activeControl) {
      case "compass":
        return (
          <>
            <DynamicTitle>Compass </DynamicTitle>
            <Compass />
          </>
        );
      case "menu":
        const filteredCities = cities.filter((city) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <>
            <DynamicTitle>Select City</DynamicTitle>
            <SearchInput
              type="text"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <CityListContainer>
              <CityList>
                {searchTerm ? ( // Only show results if searchTerm is not empty
                  filteredCities.length > 0 ? (
                    filteredCities.map((city, index) => (
                      <CityButton
                        key={index}
                        onClick={() => handleCitySelect(city)}
                      >
                        {city.name}
                      </CityButton>
                    ))
                  ) : (
                    <CityButton disabled>No cities found</CityButton>
                  )
                ) : (
                  <CityButton disabled>Enter city name...</CityButton>
                )}
              </CityList>
            </CityListContainer>
          </>
        );
      case "view":
        return (
          <>
            <DynamicTitle>Map View Options</DynamicTitle>
            <MapViewOption
              isActive={mapView === "default"}
              onClick={() => handleMapViewChange("default")}
            >
              <FaMap /> Default
            </MapViewOption>
            <MapViewOption
              isActive={mapView === "satellite"}
              onClick={() => handleMapViewChange("satellite")}
            >
              <FaSatellite /> Satellite
            </MapViewOption>
            <MapViewOption
              isActive={mapView === "3D"}
              onClick={() => handleMapViewChange("3D")}
            >
              <FaCube /> 3D
            </MapViewOption>
          </>
        );
      default:
        return null;
    }
  };

  // Custom component to change the map view
  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
  };

  return (
    <WeatherMapContainer>
      <Header>
        <Title>Weather Condition Map</Title>
        <TimeChanger>
          <FormatToggle onClick={toggleFormat}>
            <FormatText>{is24Hour ? "24h" : "12h"}</FormatText>
            <Arrow isExpanded={!is24Hour} />
          </FormatToggle>
        </TimeChanger>
      </Header>
      <ContentWrapper>
        <MapContent>
          <StyledLeafletContainer
            center={currentCity.position}
            zoom={8}
            zoomControl={false}
            ref={mapRef}
          >
            <ChangeView center={currentCity.position} zoom={8} />
            <TileLayer
              url={
                mapView === "satellite"
                  ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  : mapView === "3D"
                  ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
              attribution={
                mapView === "satellite"
                  ? "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                  : mapView === "3D"
                  ? "Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)"
                  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
            />
            <Circle
              center={currentCity.position}
              pathOptions={{
                fillColor: "orange",
                fillOpacity: 0.3,
                color: "orange",
              }}
              radius={50000}
            />
            {cities.map((city, index) => {
              const isCurrentCity = city.name === currentCity.name;
              const iconSize = isCurrentCity ? 60 : 40;
              const cityIcon = L.divIcon({
                className: "custom-div-icon",
                html: ReactDOMServer.renderToString(
                  <WeatherIconWithTemp
                    icon={city.icon}
                    temp={city.temp}
                    size={iconSize}
                  />
                ),
                iconSize: [iconSize, iconSize],
                iconAnchor: [iconSize / 2, iconSize / 2],
              });

              return (
                <Marker key={index} position={city.position} icon={cityIcon}>
                  <Popup>
                    <strong>{city.name}</strong>
                    <br />
                    Temperature: {city.temp}
                    <br />
                    Wind: {city.windSpeed}
                    <br />
                    Humidity: {city.humidity}
                    <br />
                    Chance of Rain: {city.rainChance}
                  </Popup>
                </Marker>
              );
            })}
          </StyledLeafletContainer>
          <MapControls>
            <ControlButton onClick={handleZoomIn}>
              <FaPlus />
            </ControlButton>
            <ControlButton onClick={handleZoomOut}>
              <FaMinus />
            </ControlButton>
            <ControlButton onClick={() => handleControlClick("compass")}>
              <GiCompass />
            </ControlButton>
            <ControlButton onClick={() => handleControlClick("menu")}>
              <FaBars />
            </ControlButton>
            <ControlButton onClick={() => handleControlClick("view")}>
              <HiSquare3Stack3D />
            </ControlButton>
          </MapControls>
          <DynamicContainer isVisible={activeControl !== null}>
            {renderDynamicContent()}
          </DynamicContainer>
          <CityGrid>
            {selectedCities.map((city, index) => (
              <CityCard
                key={index}
                bgColor={city.bgColor}
                isCurrentCity={city.name === currentCity.name}
                onClick={() => handleCitySelect(city)} // Update city selection
              >
                <CityName>{city.name}</CityName>
                <WeatherIcon>{city.icon}</WeatherIcon>
                <Temperature>{city.temp}</Temperature>
                <WeatherDetails>
                  <WeatherDetail>
                    <DetailIcon>
                      <FaWind />
                    </DetailIcon>
                    {city.windSpeed}
                  </WeatherDetail>
                  <WeatherDetail>
                    <DetailIcon>
                      <FaTint />
                    </DetailIcon>
                    {city.humidity}
                  </WeatherDetail>
                  <WeatherDetail>
                    <DetailIcon>
                      <WiRain />
                    </DetailIcon>
                    {city.rainChance}
                  </WeatherDetail>
                </WeatherDetails>
              </CityCard>
            ))}
          </CityGrid>
        </MapContent>
        <PrecipitationLegend>
          <LegendTitle>Precipitation</LegendTitle>
          <LegendBar>
            <LegendLabel style={{ left: "0%" }}>Light</LegendLabel>
            <LegendLabel style={{ left: "28%" }}>Moderate</LegendLabel>
            <LegendLabel style={{ left: "57%" }}>Heavy</LegendLabel>
            <LegendLabel style={{ left: "85%" }}>Extreme</LegendLabel>
          </LegendBar>
        </PrecipitationLegend>
      </ContentWrapper>
    </WeatherMapContainer>
  );
};

export default WeatherConditionMap;
