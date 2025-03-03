import React, { useState, useEffect } from "react";
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
import night_full_moon_clear from "../Assets/night_full_moon_clear.png";
import newyork from "../Assets/newyork.jpg";
import logo from "../Assets/logo.png";
import { MdCalendarMonth, MdAccessTime, MdOutlineSearch } from "react-icons/md";
import { WiNightAltCloudy, WiRain } from "react-icons/wi";

export const WeatherApp2 = () => {
  
  let api_key = "bc7bcc1079f62421f60e6ce473e723b7";
  const [wicon, setWicon] = useState();
  const [city, setCity] = useState("New York"); // Default city
  const search = async () => {
    const element = document.getElementsByClassName("search-input");
    if (!element[0] || element[0].value.trim() === "") {
      alert("Please enter a city name!");
      return;
    }
  
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`;
      let response = await fetch(url);
      let data = await response.json();
  
      if (data.cod !== 200) {
        alert("City not found!");
        return;
      }

      console.log(url);
  
      // Update UI elements

      //sidebar
      document.querySelector(".sidebar-temp").innerText = `${Math.floor(data.main.temp)}° C`;

      //content
      document.querySelector(".sunrise-value").innerText = `${data.sys.sunrise}`;
      document.querySelector(".sunset-value").innerText = `${data.sys.sunset}`;
      document.querySelector(".humidity-value").innerText = `${data.main.humidity} %`;
      document.querySelector(".wind-speed-value").innerText = `${data.wind.speed} Km/h`;
      document.querySelector(".wind-deg-value").innerText = `${data.wind.deg}°`;
      document.querySelector(".temprature-value").innerText = `${Math.floor(data.main.temp)}° C`;
      document.querySelector(".feels-like-value").innerText = `${Math.floor(data.main.feels_like)}° C`;
      document.querySelector(".temp-min-value").innerText = `${Math.floor(data.main.temp_min)}° C`;
      document.querySelector(".temp-max-value").innerText = `${Math.floor(data.main.temp_max)}° C`;
      document.querySelector(".visibility-value").innerText = `${data.visibility} m`;
      document.querySelector(".pressure-value").innerText = `${data.main.pressure}`;
      document.querySelector(".sea-level-value").innerText = `${data.main.sea_level}`;
      document.querySelector(".grnd-level-value").innerText = `${data.main.grnd_level}`;
      document.querySelector(".sidebar-status").innerText = `${data.weather[0].main} ,`;
      document.querySelector(".sidebar-description").innerText = data.weather[0].description;
      document.querySelector(".sidebar-city-name").innerText = `${data.name},`;
      document.querySelector(".sidebar-country").innerText = data.sys.country;
      
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
      
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      search();
    }
  };

  useEffect(() => {
    search("New York"); // Fetch New York weather on load
  });

  function updateDateTime() {
    const now = new Date();
  
    // Format date as "Mon - 23/09"
    const options = { weekday: 'short', day: '2-digit', month: '2-digit' };
    const formattedDate = now.toLocaleDateString('en-GB', options).replace(',', ' -');
  
    // Format time as "16:05:34" (24-hour format)
    const formattedTime = now.toLocaleTimeString('en-GB', { hour12: false });
  
    // Update the elements
    document.querySelector(".sidebar-day").innerText = formattedDate;
    document.querySelector(".sidebar-time").innerText = formattedTime;
  }
  
  // Update every second
  setInterval(updateDateTime, 1000);
  
  return (
    <>
      <div className="sidebar">
        <div className="d-flex justify-content-start align-items-center gap-2 mb-4">
          <img src={logo} alt="logo" className="logo" width={45} />
          <span className="sidebar-title">Weather TwoDay</span>
        </div>
        <div className="input-group has-validation gap-2 mb-5">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search for places..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <span className="input-group-text rounded" onClick={() => search()}>
          <MdOutlineSearch />
        </span>

        </div>
        <img
          src={wicon}
          alt="day-few-clouds"
          className="day-few-clouds"
        />
        <div>
          <span className="sidebar-temp">12°C</span>
        </div>
        <div className="d-flex justify-content-start align-items-center gap-4">
          <div className="d-flex justify-content-start align-items-center gap-1">
            <MdCalendarMonth color="#ffffff" size={19}/>
            <span className="sidebar-day">Mon - 23/09</span>
          </div>
          <div className="d-flex justify-content-start align-items-center gap-1">
            <MdAccessTime color="#ecc8c8" size={19}/>
            <span className="sidebar-time">16:05:34</span>
          </div>
        </div>
        <hr />
        <div className="d-flex justify-content-start align-items-center gap-2">
          <WiNightAltCloudy color="#ffffff" size={19}/>
          <span className="sidebar-status">?</span>
          <span className="sidebar-description">?</span>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-4 position-relative">
          <div className="d-flex justify-content-center align-items-center gap-2 sidebar-location">
           <span className="sidebar-city-name">?</span>
           <span className="sidebar-country">?</span>
          </div>
          <img src={newyork} alt="city-img" className="sidebar-city-img" />
        </div>
      </div>

      <div className="content">
        <span className="todays-highlights-title">Today's Highlights</span>
        <div className="row g-4 mt-1">
          <div className="col-md-4">
            <div className="card p-3 card-sunrise-sunset">
              <span className="card-title">Sunrise & Sunset</span>
              <p className="sunrise-value">?</p>
              <p className="sunset-value">?</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 card-wind">
              <span className="card-title">Wind Status</span>
              <p className="wind-speed-value">?</p>
              <p className="wind-deg-value">?</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 card-humidity">
              <span className="card-title">Humidity</span>
              <p className="humidity-value">?</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 card-temperature">
              <span className="card-title">Temperature</span>
              <span className="temprature-value">?</span>
              <span className="feels-like-value">?</span>
              <span className="temp-min-value">?</span>
              <span className="temp-max-value">?</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 card-pressure">
              <span className="card-title">Pressure</span>
              <span className="pressure-value">?</span>
              <span className="sea-level-value">?</span>
              <span className="grnd-level-value">?</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 card-visibility">
              <span className="card-title">Visibility</span>
              <span className="visibility-value">?</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
