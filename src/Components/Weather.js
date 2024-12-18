import React, { useState, useEffect, useRef } from "react";
import "./Weather.css";
import contrast from "./contrast.png";
import cloudy from "./cloudy.png";
import rain from "./rain.png";
import cloud from "./cloud.png";
import cloudcover from "./cloud cover.png";
import wind from "./wind.png";
import uv from "./uv-index.png";
import precipitation from "./precipitation.png";
import visibility from "./visibility.png";
import humidity from "./humidity.png";
const api = {
  key: "sBOgnVH48PKv7P5WvF26aQw4uSNiMuy6",
  base: "https://api.tomorrow.io/v4/weather/forecast",
};

function Weather() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const locationRef = useRef(null);
  const [fontSize, setFontSize] = useState(50); // Default font size
  const [isHovered, setIsHovered] = useState(false);

  const handleSearch = () => {
    fetch(`${api.base}?location=${search}&apikey=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result); // Log the full response to inspect the structure
        setWeather(result);
      })
      .catch((error) => {
        console.error("Error fetching the weather data:", error);
      });
  };

  useEffect(() => {
    const adjustFontSize = () => {
      if (locationRef.current) {
        const parentWidth = locationRef.current.parentElement.offsetWidth;
        let newFontSize = 50; // Start with max font size

        // Reduce the font size until it fits the container
        while (
          locationRef.current.scrollWidth > parentWidth &&
          newFontSize > 10
        ) {
          newFontSize -= 1;
          locationRef.current.style.fontSize = `${newFontSize}px`;
        }

        setFontSize(newFontSize);
      }
    };

    adjustFontSize();

    // Adjust font size on window resize
    window.addEventListener("resize", adjustFontSize);
    return () => {
      window.removeEventListener("resize", adjustFontSize);
    };
  }, [weather]);

  const getWeatherImage = (temperature) => {
    if (temperature >= 30) {
      return contrast;
    } else if (temperature >= 20 && temperature < 30) {
      return cloudy;
    } else {
      return cloud;
    }
  };

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="enter-btn" onClick={handleSearch}>
        Enter
      </button>
      <div className="left-bar"></div>
      <div className="middle-body">
        <div className="box1">
          {weather &&
            weather.timelines &&
            weather.timelines.minutely &&
            weather.timelines.minutely.length > 0 && (
              <div className="weather-info">
                <div className="middle-body-name">
                  {weather && (
                    <h1
                      ref={locationRef}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        position: "relative",
                        zIndex: isHovered ? 10 : 1,
                        transition: "z-index 0.3s",
                        width: "590px",
                      }}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      {weather?.location?.name || "Unknown Location"}
                    </h1>
                  )}
                </div>
                <h1
                  style={{
                    fontSize: "50px",
                    marginTop: "90px",
                    position: "absolute",
                  }}
                >
                  {weather.timelines.minutely[0].values.temperature}°C
                </h1>
                <img
                  className="weather-info-img"
                  src={getWeatherImage(
                    weather.timelines.minutely[0].values.temperature
                  )}
                  alt="Weather icon"
                />
              </div>
            )}
        </div>
        <div className="box">
          <div className="today-info">
            <a>TODAY'S FORECAST</a>
            <div className="today-cont">
              {weather &&
                weather.timelines &&
                weather.timelines.hourly &&
                weather.timelines.hourly.slice(0, 6).map((hour, index) => (
                  <div className="small-box" key={index}>
                    <a>
                      {new Date(hour.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </a>
                    <img
                      className="today-info-img"
                      src={getWeatherImage(hour.values.temperature)}
                      alt="Weather icon"
                    />
                    <a className="today-info-temp">
                      {hour.values.temperature}°C
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="box">
          {weather &&
            weather.timelines &&
            weather.timelines.minutely &&
            weather.timelines.minutely.length > 0 && (
              <>
                <a>AIR CONDITIONS</a>
                <div className="air-cont">
                  <div className="inner-box">
                    <div className="inner-small-box ">
                      <a>Cloud Cover</a>
                      <img className="wind-img" src={cloudcover} />
                      <div className="air-cont-details">
                        {weather.timelines.minutely[0].values.cloudCover}(oktas)
                      </div>
                    </div>
                    <div className="inner-small-box ">
                      <a>Wind Speed</a>
                      <img className="wind-img" src={wind} />
                      <div className="air-cont-details">
                        {weather.timelines.minutely[0].values.windSpeed}(m/s)
                      </div>
                    </div>
                    <div className="inner-small-box ">
                      <a>UV Index</a>
                      <img className="wind-img" src={uv} />
                      <div className="air-cont-details">
                        {weather.timelines.minutely[0].values.uvIndex}(mW/m2)
                      </div>
                    </div>
                  </div>
                  <div className="inner-box"></div>
                </div>
                <div className="air-cont">
                  <div className="inner-box">
                    <div className="inner-small-box ">
                      <a>Precipitation Chances</a>
                      <img className="wind-img" src={precipitation} />
                      <div className="air-cont-details">
                        {
                          weather.timelines.minutely[0].values
                            .precipitationProbability
                        }
                        %
                      </div>
                    </div>
                    <div className="inner-small-box ">
                      <a>Visibility</a>
                      <img className="wind-img" src={visibility} />
                      <div className="air-cont-details">
                        {weather.timelines.minutely[0].values.visibility}
                        (meters)
                      </div>
                    </div>
                    <div className="inner-small-box ">
                      <a>Humidity</a>
                      <img className="wind-img" src={humidity} />
                      <div className="air-cont-details">
                        {weather.timelines.minutely[0].values.humidity}(g/m3)
                      </div>
                    </div>
                  </div>
                  <div className="inner-box"></div>
                </div>
              </>
            )}
        </div>
      </div>
      <div className="right-body">
        {weather &&
          weather.timelines &&
          weather.timelines.daily &&
          weather.timelines.daily.length > 0 && (
            <>
              <a className="">7-DAY FORECAST</a>
              <div className="right-body-cont">
                <div className="right-body-box">
                  {weather &&
                    weather.timelines &&
                    weather.timelines.minutely &&
                    weather.timelines.minutely.length > 0 && (
                      <>
                        <a>Today</a>
                        <img
                          className="right-body-img"
                          src={getWeatherImage(
                            weather.timelines.minutely[0].values.temperature
                          )}
                        />
                      </>
                    )}
                  <a className="right-body-temp">
                    {weather.timelines.minutely[0].values.temperature}°C
                  </a>
                </div>
                <div className="right-body-box">
                  <a>Tomorrow</a>
                  <img
                    className="right-body-img"
                    src={getWeatherImage(
                      weather.timelines.daily[0].values.temperatureAvg
                    )}
                  />
                  <a className="right-body-temp">
                    {weather.timelines.daily[0].values.temperatureAvg}°C
                  </a>
                </div>
                <div className="right-body-box">
                  <a>Day After</a>
                  <img
                    className="right-body-img"
                    src={getWeatherImage(
                      weather.timelines.daily[1].values.temperatureAvg
                    )}
                  />
                  <a className="right-body-temp">
                    {weather.timelines.daily[1].values.temperatureAvg}°C
                  </a>
                </div>
                <div className="right-body-box">
                  <a>After 3 Days</a>
                  <img
                    className="right-body-img"
                    src={getWeatherImage(
                      weather.timelines.daily[2].values.temperatureAvg
                    )}
                  />
                  <a className="right-body-temp">
                    {weather.timelines.daily[2].values.temperatureAvg}°C
                  </a>
                </div>
                <div className="right-body-box">
                  <a>After 4 Days</a>
                  <img
                    className="right-body-img"
                    src={getWeatherImage(
                      weather.timelines.daily[3].values.temperatureAvg
                    )}
                  />
                  <a className="right-body-temp">
                    {weather.timelines.daily[3].values.temperatureAvg}°C
                  </a>
                </div>
                <div className="right-body-box">
                  <a>After 5 Days</a>
                  <img
                    className="right-body-img"
                    src={getWeatherImage(
                      weather.timelines.daily[4].values.temperatureAvg
                    )}
                  />
                  <a className="right-body-temp">
                    {weather.timelines.daily[4].values.temperatureAvg}°C
                  </a>
                </div>
                <div className="right-body-box">
                  <a>After 6 Days</a>
                  <img
                    className="right-body-img"
                    src={getWeatherImage(
                      weather.timelines.daily[5].values.temperatureAvg
                    )}
                  />
                  <a className="right-body-temp">
                    {weather.timelines.daily[5].values.temperatureAvg}°C
                  </a>
                </div>
              </div>
            </>
          )}
      </div>
    </>
  );
}

export default Weather;
