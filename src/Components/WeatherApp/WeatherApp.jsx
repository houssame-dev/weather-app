import React, { useState } from "react";
import "./WeatherApp.css";
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
import logo from "../Assets/logo.png";

export const WeatherApp = () => {
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
    <div className="weather-app">
      <Form className="form">
        <a href="/">
          <img src={logo} alt="logo" className="logo" />
        </a>
        <Form.Control
          type="search"
          placeholder="Enter your city ..."
          className="search-input"
          aria-label="Search"
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="info"
          className="btn-search"
          onClick={() => {
            search();
          }}
        >
          <div className="btn-div">
            <FaSearch size={20} /> <span>Search</span>
          </div>
        </Button>
      </Form>
      <Card className="card">
        <Card.Body>
          <Card.Title className="image">
            <img src={wicon} alt="icon" />
          </Card.Title>
          <Card.Title className="temprature"></Card.Title>
          <Card.Title>
            <span className="location"></span> <span className="country"></span>
          </Card.Title>
          <div className="humidity-wind">
            <Card.Title>
              <div className="humidity-div">
                <WiHumidity size={30} /> <span className="humidity"></span>
              </div>
              humidity
            </Card.Title>
            <Card.Title>
              <div className="wind-div">
                <WiStrongWind size={30} /> <span className="wind"></span>
              </div>
              wind
            </Card.Title>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
