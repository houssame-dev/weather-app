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
import wind_speed from "../Assets/wind_speed.png";
import wind_deg from "../Assets/wind_deg.png";
import wind_gust from "../Assets/wind_gust.png";
import humidity from "../Assets/humidity.png";
import temperature from "../Assets/temperature.png";
import visibility from "../Assets/visibility.png";
import pressure from "../Assets/pressure.png";
import sea from "../Assets/sea.png";
import ground from "../Assets/ground.png";
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
import citiesData from "./cities.json";

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

export const WeatherApp2 = () => {
  const api_key = "bc7bcc1079f62421f60e6ce473e723b7";
  const unsplash_access_key = "z-Fm_Q6WZCBD3IEO3p7QQ-8OD1lBxSnMFLs_5IMSJMU";
  const [wicon, setWicon] = useState(day_clear_sky);
  const [city, setCity] = useState("New York");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const timerRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const [cityImage, setCityImage] = useState("");

  useEffect(() => {
    if (city.trim() === "") {
      setFilteredCities([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = citiesData
      .filter((item) => item.city.toLowerCase().includes(city.toLowerCase()))
      .slice(0, 15);

    setFilteredCities(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [city]);

  const handleReset = () => {
    setCity("");
    setFilteredCities([]);
    setShowSuggestions(false);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  useEffect(() => {
    updateDateTime();
    timerRef.current = setInterval(updateDateTime, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    searchCity("New York");
  }, []);

  function updateDateTime() {
    const now = new Date();
    const options = { weekday: "short", day: "2-digit", month: "2-digit" };
    setDate(now.toLocaleDateString("en-GB", options).replace(",", " -"));
    setTime(now.toLocaleTimeString("en-GB", { hour12: false }));
  }

  const searchCity = async (searchTerm) => {
    if (!searchTerm?.trim()) {
      alert("Please enter a city name!");
      return;
    }

    try {
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=Metric&appid=${api_key}`;
      const currentResponse = await fetch(currentWeatherUrl);
      const currentData = await currentResponse.json();
      if (currentData.cod !== 200) throw new Error("City not found");

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&units=Metric&appid=${api_key}`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastDataResult = await forecastResponse.json();

      setWeatherData(currentData);
      setForecastData(forecastDataResult);
      setWicon(iconMap[currentData.weather[0].icon] || night_clear_sky);
      fetchCityImage(searchTerm);
      setShowSuggestions(false);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "An error occurred");
    }
  };

  const processForecastData = (data) => {
    if (!data?.list) return [];
    const dailyData = {};

    data.list.forEach((entry) => {
      const date = new Date((entry.dt + data.city.timezone) * 1000)
        .toISOString()
        .split("T")[0];
      if (!dailyData[date]) dailyData[date] = [];
      dailyData[date].push(entry);
    });

    return Object.keys(dailyData)
      .sort()
      .slice(0, 5)
      .map((date) => {
        const entries = dailyData[date];
        const temps = entries.map((e) => e.main.temp);
        return {
          date,
          minTemp: Math.min(...temps),
          maxTemp: Math.max(...temps),
          icon: entries[Math.floor(entries.length / 2)].weather[0].icon,
          dayName: getDayName(date, data.city.timezone),
        };
      });
  };

  const getDayName = (dateStr, timezone) => {
    const date = new Date(new Date(dateStr).getTime() + timezone * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.round((date - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return new Date(date).toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

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
      const url = `https://api.unsplash.com/photos/random?query=${cityName}&client_id=${unsplash_access_key}`;
      const response = await fetch(url);
      const data = await response.json();
      setCityImage(data.urls?.regular || newyork);
    } catch (error) {
      console.error("Error fetching city image:", error);
      setCityImage(newyork);
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
              >
                <path
                  d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <input
              ref={searchInputRef}
              className="input"
              placeholder="Search for places..."
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchCity(city)}
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
                  />
                </svg>
              </button>
            )}
            {showSuggestions && (
              <div ref={suggestionsRef} className="city-suggestions-div">
                {filteredCities.map((item, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => {
                      setCity(item.city);
                      searchCity(item.city);
                    }}
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
              ? `${Math.floor(weatherData.main.temp)}° C`
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
          {weatherData && getWeatherIcon(weatherData.weather[0].main)}
          <span className="sidebar-status">
            {weatherData ? `${weatherData.weather[0].main} ,` : "Loading..."}
          </span>
          <span className="sidebar-description">
            {weatherData?.weather[0].description}
          </span>
        </div>
        <div
          className="d-flex justify-content-center align-items-center mt-4 position-relative"
          id="sidebar-image"
        >
          <div className="d-flex justify-content-center align-items-center gap-2 sidebar-location">
            <span className="sidebar-city-name">
              {weatherData?.name?.length > 11
                ? `${weatherData.name.substring(0, 11)}...,`
                : `${weatherData?.name}, `}
            </span>
            <span className="sidebar-country">
              {weatherData?.sys?.country === "EH"
                ? "MA"
                : weatherData?.sys?.country}
            </span>
          </div>
          <img
            src={cityImage || newyork}
            alt="city-img"
            className="sidebar-city-img"
          />
        </div>
      </div>

      <div className="content">
        <span className="todays-highlights-title">Today's Highlights</span>
        <div className="row g-4 mt-1 mb-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="card p-3 card-sunrise-sunset">
              <span className="card-title">Sunrise & Sunset</span>
              <div className="d-flex justify-content-center align-items-center gap-5">
                <img src={sunrise} alt="sunrise_icon" width={60} />
                <span className="sunrise-value">
                  {weatherData?.sys?.sunrise
                    ? formatTimestamp(weatherData.sys.sunrise)
                    : " "}
                </span>
              </div>
              <div className="d-flex justify-content-center align-items-center gap-5">
                <img src={sunset} alt="sunset_icon" width={60} />
                <span className="sunset-value">
                  {weatherData?.sys?.sunset
                    ? formatTimestamp(weatherData.sys.sunset)
                    : " "}
                </span>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="card p-3 card-wind">
              <span className="card-title">Wind Status</span>
              <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                <img src={wind_speed} alt="wind_speed" width={70} />
                <span className="wind-speed-value">
                  {weatherData?.wind?.speed
                    ? `${weatherData.wind.speed} Km/h`
                    : " "}
                </span>
              </div>
              <div className="d-flex justify-content-around align-items-center">
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <img src={wind_deg} alt="wind_deg" width={25} />
                  <span className="wind-deg-value">
                    {weatherData?.wind?.deg ? `${weatherData.wind.deg}°` : " "}
                  </span>
                </div>
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <img src={wind_gust} alt="wind_gust" width={25} />
                  <span className="wind-gust-value">
                    {weatherData?.wind?.gust || " "}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="card p-3 card-humidity">
              <span className="card-title">Humidity</span>
              <div className="d-flex justify-content-between align-items-center">
                <span className="humidity-value">
                  {weatherData?.main?.humidity
                    ? `${weatherData.main.humidity} %`
                    : " "}
                </span>
                <img src={humidity} alt="humidity" width={70} />
              </div>
              <div>
                <span className="humidity-status">normal 👍</span>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="card p-3 card-temperature">
              <span className="card-title">Temperature</span>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <img src={temperature} alt="temperature" width={90} />
                </div>
                <div>
                  <div className="temperature-details">
                    <span className="temp-label">Current : </span>
                    <span className="temprature-value">
                      {weatherData?.main?.temp
                        ? `${Math.floor(weatherData.main.temp)}° C`
                        : " "}
                    </span>
                  </div>
                  <div className="temperature-details">
                    <span className="temp-label">Feels like : </span>
                    <span className="feels-like-value">
                      {weatherData?.main?.feels_like
                        ? `${Math.floor(weatherData.main.feels_like)}° C`
                        : " "}
                    </span>
                  </div>
                  <div className="temperature-details">
                    <span className="temp-label">Min : </span>
                    <span className="temp-min-value">
                      {weatherData?.main?.temp_min
                        ? `${Math.floor(weatherData.main.temp_min)}° C`
                        : " "}
                    </span>
                  </div>
                  <div className="temperature-details">
                    <span className="temp-label">Max : </span>
                    <span className="temp-max-value">
                      {weatherData?.main?.temp_max
                        ? `${Math.floor(weatherData.main.temp_max)}° C`
                        : " "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="card p-3 card-pressure">
              <span className="card-title">Pressure</span>
              <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                <img src={pressure} alt="pressure" width={70} />
                <span className="pressure-value">
                  {weatherData?.main?.pressure
                    ? `${weatherData.main.pressure} hPa`
                    : " "}
                </span>
              </div>
              <div className="d-flex justify-content-around align-items-center">
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <img src={sea} alt="sea" width={20} />
                  <span className="sea-level-value">
                    {weatherData?.main?.sea_level
                      ? `${weatherData.main.sea_level} hPa`
                      : " "}
                  </span>
                </div>
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <img src={ground} alt="ground" width={20} />
                  <span className="grnd-level-value">
                    {weatherData?.main?.grnd_level
                      ? `${weatherData.main.grnd_level} hPa`
                      : " "}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="card p-3 card-visibility">
              <span className="card-title">Visibility</span>
              <div className="d-flex justify-content-between align-items-center">
                <span className="visibility-value">
                  {weatherData?.visibility
                    ? `${weatherData.visibility} m`
                    : " "}
                </span>
                <img src={visibility} alt="visibility" width={70} />
              </div>
              <div>
                <span className="visibility-status">Average 😀</span>
              </div>
            </div>
          </div>
        </div>
        <span className="todays-highlights-title">Next 5 Days</span>
        <div className="row g-4 mt-1">
          {forecastData?.city &&
            processForecastData(forecastData).map((day, index) => (
              <div className="col-lg-2 col-md-6 col-sm-12" key={index}>
                <div className="card p-3 card-next-5days">
                  <span className="card-title">{day.dayName}</span>
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      src={iconMap[day.icon]}
                      alt="weather-icon"
                      className="next-5days-icon"
                      width={90}
                    />
                  </div>
                  <div className="mt-3 d-flex justify-content-center align-items-center gap-2 text-white">
                    <span className="next-5days-max-temp">
                      {Math.floor(day.maxTemp)}° C
                    </span>
                    <span>|</span>
                    <span className="next-5days-min-temp">
                      {Math.floor(day.minTemp)}° C
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
