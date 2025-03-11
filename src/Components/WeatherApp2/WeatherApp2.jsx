import React, { useState, useEffect, useRef } from "react";
import "./WeatherApp2.css";
import day_clear_sky from "../Assets/day_clear_sky.png";
import day_few_clouds from "../Assets/day_few_clouds.png";
import day_scattered_clouds from "../Assets/day_scattered_clouds.png";
import day_broken_clouds from "../Assets/day_broken_clouds.png";
import day_shower_rain from "../Assets/day_shower_rain.png";
import day_rain from "../Assets/day_rain.png";
import day_thunderstorm from "../Assets/day_thunderstorm.png";
import day_snow from "../Assets/day_snow.png";
import day_mist from "../Assets/day_mist.png";
import night_clear_sky from "../Assets/day_clear_sky.png";
import night_few_clouds from "../Assets/night_few_clouds.png";
import night_scattered_clouds from "../Assets/night_scattered_clouds.png";
import night_broken_clouds from "../Assets/night_broken_clouds.png";
import night_shower_rain from "../Assets/night_shower_rain.png";
import night_rain from "../Assets/night_rain.png";
import night_thunderstorm from "../Assets/night_thunderstorm.png";
import night_snow from "../Assets/night_snow.png";
import night_mist from "../Assets/night_mist.png";
import newyork from "../Assets/newyork.jpg";
import logo from "../Assets/logo.png";
import sunrise from "../Assets/sunrise.png";
import sunset from "../Assets/sunset.png";
import { MdCalendarMonth, MdAccessTime, MdStorm } from "react-icons/md";
import { RiFoggyLine, RiMistLine } from "react-icons/ri";
import {
  WiDaySunny,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiSprinkle,
  WiSmoke,
  WiDayHaze,
  WiDust,
  WiSandstorm,
  WiFire,
  WiTornado,
  WiCloudy,
} from "react-icons/wi";
// Import city data - update the path to your actual JSON file location
import citiesData from "./cities.json";

export const WeatherApp2 = () => {
  const api_key = "bc7bcc1079f62421f60e6ce473e723b7";
  const unsplash_access_key = "z-Fm_Q6WZCBD3IEO3p7QQ-8OD1lBxSnMFLs_5IMSJMU";
  const [wicon, setWicon] = useState(day_clear_sky); // Set default icon
  const [city, setCity] = useState("New York"); // Default city
  const [weatherData, setWeatherData] = useState(null);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const timerRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const [cityImage, setCityImage] = useState("");

  // Filter cities when search term changes
  useEffect(() => {
    if (city.trim() === "") {
      setFilteredCities([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = citiesData
      .filter((item) => item.city.toLowerCase().includes(city.toLowerCase()))
      .slice(0, 15); // Limit to 15 suggestions

    setFilteredCities(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [city]);

  // Handle clicking reset button
  const handleReset = () => {
    setCity("");
    setFilteredCities([]);
    setShowSuggestions(false);

    // Focus the input after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle losing focus - hide suggestions after a short delay
  const handleBlur = () => {
    // Slight delay to allow click on suggestions before hiding
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Update date and time
  useEffect(() => {
    updateDateTime();

    // Set interval for updating time
    timerRef.current = setInterval(updateDateTime, 1000);

    // Cleanup interval on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Load default city on mount (only once)
  useEffect(() => {
    searchCity("New York");
  }, []);

  function updateDateTime() {
    const now = new Date();

    // Format date as "Mon - 23/09"
    const options = { weekday: "short", day: "2-digit", month: "2-digit" };
    const formattedDate = now
      .toLocaleDateString("en-GB", options)
      .replace(",", " -");

    // Format time as "16:05:34" (24-hour format)
    const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false });

    setDate(formattedDate);
    setTime(formattedTime);
  }

  const searchCity = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
      alert("Please enter a city name!");
      return;
    }

    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=Metric&appid=${api_key}`;
      let response = await fetch(url);
      let data = await response.json();

      if (data.cod !== 200) {
        alert("City not found!");
        return;
      }

      // Store the entire weather data
      setWeatherData(data);

      // Weather Icon Mapping
      const iconMap = {
        "01d": day_clear_sky,
        "02d": day_few_clouds,
        "03d": day_scattered_clouds,
        "04d": day_broken_clouds,
        "09d": day_shower_rain,
        "10d": day_rain,
        "11d": day_thunderstorm,
        "13d": day_snow,
        "50d": day_mist,
        "01n": night_clear_sky,
        "02n": night_few_clouds,
        "03n": night_scattered_clouds,
        "04n": night_broken_clouds,
        "09n": night_shower_rain,
        "10n": night_rain,
        "11n": night_thunderstorm,
        "13n": night_snow,
        "50n": night_mist,
      };

      // Set Weather Icon
      setWicon(iconMap[data.weather[0].icon] || night_clear_sky);

      fetchCityImage(searchTerm);

      // Hide suggestions after search
      setShowSuggestions(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchCity(city);
    } else if (event.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Handle city selection from dropdown
  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    searchCity(selectedCity);
    setShowSuggestions(false);
  };

  // Convert Unix timestamp to a readable time format (HH:MM)
  function formatTimestamp(timestamp) {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case "Thunderstorm":
        return <WiThunderstorm color="#ffffff" size={19} />;
      case "Drizzle":
        return <WiSprinkle color="#ffffff" size={19} />;
      case "Rain":
        return <WiRain color="#ffffff" size={19} />;
      case "Snow":
        return <WiSnow color="#ffffff" size={19} />;
      case "Mist":
        return <RiMistLine color="#ffffff" size={19} />;
      case "Smoke":
        return <WiSmoke color="#ffffff" size={19} />;
      case "Haze":
        return <WiDayHaze color="#ffffff" size={19} />;
      case "Dust":
        return <WiDust color="#ffffff" size={19} />;
      case "Fog":
        return <RiFoggyLine color="#ffffff" size={19} />;
      case "Sand":
        return <WiSandstorm color="#ffffff" size={19} />;
      case "Ash":
        return <WiFire color="#ffffff" size={19} />;
      case "Squall":
        return <MdStorm color="#ffffff" size={19} />;
      case "Tornado":
        return <WiTornado color="#ffffff" size={19} />;
      case "Clear":
        return <WiDaySunny color="#ffffff" size={19} />;
      case "Clouds":
        return <WiCloudy color="#ffffff" size={19} />;
      default:
        return "?";
    }
  };

  const fetchCityImage = async (cityName) => {
    try {
      let url = `https://api.unsplash.com/photos/random?query=${cityName}&client_id=${unsplash_access_key}`;
      let response = await fetch(url);
      let data = await response.json();
      setCityImage(data.urls.regular);
    } catch (error) {
      console.error("Error fetching city image:", error);
    }
  };

  return (
    <>
      <div className="sidebar">
        <div className="d-flex justify-content-start align-items-center gap-2 mb-4">
          <img src={logo} alt="logo" className="logo" width={45} />
          <span className="sidebar-title">Weather TwoDay</span>
        </div>

        <div className="input-group position-relative mb-3">
          <div className="form w-100">
            <button onClick={() => searchCity(city)}>
              <svg
                width="17"
                height="16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="search"
              >
                <path
                  d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
            <input
              ref={searchInputRef}
              className="input"
              placeholder="Search for places..."
              required=""
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => city !== "" && setShowSuggestions(true)}
              onBlur={handleBlur}
            />
            {city && (
              <button className="reset" type="reset" onClick={handleReset}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            )}

            {showSuggestions && (
              <div ref={suggestionsRef} className="city-suggestions-div">
                {filteredCities.map((item, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleCitySelect(item.city)}
                  >
                    <span className="suggestion-city">{item.city}</span>
                    <span className="suggestion-country">{item.iso3}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <img src={wicon} alt="weather-icon" className="day-few-clouds" />
        <div className="mt-3">
          <span className="sidebar-temp">
            {weatherData
              ? `${Math.floor(weatherData.main.temp)} °C`
              : "Loading..."}
          </span>
        </div>
        <div className="d-flex justify-content-start align-items-center gap-4">
          <div className="d-flex justify-content-start align-items-center gap-1">
            <MdCalendarMonth color="#ffffff" size={19} />
            <span className="sidebar-day">{date}</span>
          </div>
          <div className="d-flex justify-content-start align-items-center gap-1">
            <MdAccessTime color="#ecc8c8" size={19} />
            <span className="sidebar-time">{time}</span>
          </div>
        </div>
        <hr />
        <div className="d-flex justify-content-start align-items-center gap-2">
          {weatherData ? getWeatherIcon(weatherData.weather[0].main) : ""}
          <span className="sidebar-status">
            {weatherData ? `${weatherData.weather[0].main} ,` : "Loading..."}
          </span>
          <span className="sidebar-description">
            {weatherData ? weatherData.weather[0].description : ""}
          </span>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-4 position-relative">
          <div className="d-flex justify-content-center align-items-center gap-2 sidebar-location">
            <span className="sidebar-city-name">
              {weatherData
                ? weatherData.name.length > 11
                  ? `${weatherData.name.substring(0, 11)}...,`
                  : `${weatherData.name}, `
                : "Loading..."}
            </span>
            <span className="sidebar-country">
              {weatherData
                ? weatherData.sys.country === "EH"
                  ? "MA"
                  : weatherData.sys.country
                : ""}
            </span>
          </div>
          <img
            src={cityImage || newyork} // Use a default image if none is found
            alt="city-img"
            className="sidebar-city-img"
          />
        </div>
      </div>

      <div className="content">
        <span className="todays-highlights-title">Today's Highlights</span>
        <div className="row g-4 mt-1">
          <div className="col-md-4">
            <div className="card p-3 card-sunrise-sunset">
              <span className="card-title mb-0">Sunrise & Sunset</span>
              <div className="d-flex justify-content-start align-items-center gap-2">
                <img src={sunrise} alt="sunrise_icon" width={50} />
                <span className="sunrise-value">
                  {weatherData?.sys?.sunrise != null
                    ? formatTimestamp(weatherData.sys.sunrise)
                    : " "} 
                </span>
              </div>
              <div className="d-flex justify-content-start align-items-center gap-2">
                <img src={sunset} alt="sunset_icon" width={50} />
                <span className="sunset-value">
                  {weatherData?.sys?.sunset != null
                    ? formatTimestamp(weatherData.sys.sunset)
                    : " "}
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 card-wind">
              <span className="card-title">Wind Status</span>
              <p className="wind-speed-value">
                {weatherData?.wind?.speed != null
                  ? `${weatherData.wind.speed} Km/h`
                  : " "}
              </p>
              <p className="wind-deg-value">
                {weatherData?.wind?.deg != null
                  ? `${weatherData.wind.deg}°`
                  : " "}
              </p>

              <p className="wind-deg-value">{weatherData?.wind?.gust ?? " "}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 card-humidity">
              <span className="card-title">Humidity</span>
              <p className="humidity-value">
                {weatherData?.main?.humidity != null
                  ? `${weatherData.main.humidity} %`
                  : " "}
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 card-temperature">
              <span className="card-title">Temperature</span>
              <div className="temperature-details">
                <span className="temp-label">Current:</span>
                <span className="temprature-value">
                  {weatherData?.main?.temp != null
                    ? `${Math.floor(weatherData.main.temp)}° C`
                    : " "}
                </span>
              </div>
              <div className="temperature-details">
                <span className="temp-label">Feels like:</span>
                <span className="feels-like-value">
                  {weatherData?.main?.feels_like != null
                    ? `${Math.floor(weatherData.main.feels_like)}° C`
                    : " "}
                </span>
              </div>
              <div className="temperature-details">
                <span className="temp-label">Min:</span>
                <span className="temp-min-value">
                  {weatherData?.main?.temp_min != null
                    ? `${Math.floor(weatherData.main.temp_min)}° C`
                    : " "}
                </span>
              </div>
              <div className="temperature-details">
                <span className="temp-label">Max:</span>
                <span className="temp-max-value">
                  {weatherData?.main?.temp_max != null
                    ? `${Math.floor(weatherData.main.temp_max)}° C`
                    : " "}
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 card-pressure">
              <span className="card-title">Pressure</span>
              <div className="pressure-details">
                <span className="pressure-label">Pressure:</span>
                <span className="pressure-value">
                  {weatherData?.main?.pressure != null
                    ? `${weatherData.main.pressure} hPa`
                    : " "}
                </span>
              </div>
              <div className="pressure-details">
                <span className="pressure-label">Sea level:</span>
                <span className="sea-level-value">
                  {weatherData?.main?.sea_level != null
                    ? `${weatherData.main.sea_level} hPa`
                    : " "}
                </span>
              </div>
              <div className="pressure-details">
                <span className="pressure-label">Ground level:</span>
                <span className="grnd-level-value">
                  {weatherData?.main?.grnd_level != null
                    ? `${weatherData.main.grnd_level} hPa`
                    : " "}
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 card-visibility">
              <span className="card-title">Visibility</span>
              <span className="visibility-value">
                {weatherData?.visibility != null
                    ? `${weatherData.visibility} m`
                    : " "}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
