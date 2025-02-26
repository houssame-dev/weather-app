import React, { useState } from "react";
import "./WeatherApp2.css";
import { Button, Card, Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { WiHumidity, WiStrongWind } from "react-icons/wi";
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
import { CiCloudOn } from "react-icons/ci";
import { LuCloudRainWind } from "react-icons/lu";
import { RxCalendar } from "react-icons/rx";
import { WiTime4 } from "react-icons/wi";

export const WeatherApp2 = () => {
  let api_key = "bc7bcc1079f62421f60e6ce473e723b7";
  const [wicon, setWicon] = useState(day_clear_sky);
  const search = async () => {
    const element = document.getElementsByClassName("search-input");
    if (element[0].value === "") {
      return 0;
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`;
    let response = await fetch(url);
    let data = await response.json();

    const humidity = document.getElementsByClassName("humidity");
    const wind = document.getElementsByClassName("wind");
    const temprature = document.getElementsByClassName("temprature");
    const location = document.getElementsByClassName("location");
    const country = document.getElementsByClassName("country");

    humidity[0].innerHTML = Math.floor(data.main.humidity) + " %";
    wind[0].innerHTML = Math.floor(data.wind.speed) + " Km/h";
    temprature[0].innerHTML = Math.floor(data.main.temp) + "° C";
    location[0].innerHTML = data.name + ", ";
    country[0].innerHTML = data.sys.country;
    if (data.weather[0].icon === "01d") {
      setWicon(day_clear_sky);
    } else if (data.weather[0].icon === "02d") {
      setWicon(day_few_clouds);
    } else if (data.weather[0].icon === "03d") {
      setWicon(day_scattered_clouds);
    } else if (data.weather[0].icon === "04d") {
      setWicon(day_broken_clouds);
    } else if (data.weather[0].icon === "09d") {
      setWicon(day_shower_rain);
    } else if (data.weather[0].icon === "10d") {
      setWicon(day_rain);
    } else if (data.weather[0].icon === "11d") {
      setWicon(day_thunderstorm);
    } else if (data.weather[0].icon === "13d") {
      setWicon(day_snow);
    } else if (data.weather[0].icon === "50d") {
      setWicon(day_mist);
    } else if (data.weather[0].icon === "01n") {
      setWicon(night_clear_sky);
    } else if (data.weather[0].icon === "02n") {
      setWicon(night_few_clouds);
    } else if (data.weather[0].icon === "03n") {
      setWicon(night_scattered_clouds);
    } else if (data.weather[0].icon === "04n") {
      setWicon(night_broken_clouds);
    } else if (data.weather[0].icon === "09n") {
      setWicon(night_shower_rain);
    } else if (data.weather[0].icon === "10n") {
      setWicon(night_rain);
    } else if (data.weather[0].icon === "11n") {
      setWicon(night_thunderstorm);
    } else if (data.weather[0].icon === "13n") {
      setWicon(night_snow);
    } else if (data.weather[0].icon === "50n") {
      setWicon(night_mist);
    } else {
      setWicon(night_full_moon_clear);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      search();
    }
  };
  return (
    <>
      <div class="sidebar">
        <div className="d-flex justify-content-start align-items-center gap-2 mb-4">
          <img src={logo} alt="logo" className="logo" width={45} />
          <span className="sidebar-title">Weather TwoDay</span>
        </div>
        <input
          type="text"
          class="form-control mb-4"
          placeholder="Search for places..."
        />
        <img
          src={day_few_clouds}
          alt="day-few-clouds"
          className="day-few-clouds"
        />
        <div>
          <span className="sidebar-temp">12°C</span>
        </div>
        <div className="d-flex justify-content-start align-items-center gap-4">
          <div className="d-flex justify-content-start align-items-center gap-1">
            <RxCalendar color="#ffffff" />
            <span className="sidebar-day">Monday,</span>
          </div>
          <div className="d-flex justify-content-start align-items-center gap-1">
            <WiTime4 color="#ecc8c8" />
            <span className="sidebar-time">16:05:34</span>
          </div>
        </div>
        <hr />
        <div className="d-flex justify-content-start align-items-center gap-2">
          <CiCloudOn color="#ffffff" />
          <span className="sidebar-status">Mostly Cloudy</span>
        </div>
        <div className="d-flex justify-content-start align-items-center gap-2">
          <LuCloudRainWind color="#ffffff" />
          <span className="sidebar-rain">Rain - 30%</span>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-4 position-relative">
          <span className="sidebar-city-name">New York</span>
          <img src={newyork} alt="city-img" className="sidebar-city-img" />
        </div>
      </div>

      <div class="content">
        <h2>Today's Highlights</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card p-3">
              <h5>UV Index</h5>
              <p>5</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card p-3">
              <h5>Wind Status</h5>
              <p>7.70 km/h</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card p-3">
              <h5>Humidity</h5>
              <p>12%</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card p-3">
              <h5>UV Index</h5>
              <p>5</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card p-3">
              <h5>Wind Status</h5>
              <p>7.70 km/h</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card p-3">
              <h5>Humidity</h5>
              <p>12%</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
