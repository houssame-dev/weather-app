import React, { useState } from "react";
import "./WeatherApp.css";
import { Button, Card, Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { WiHumidity, WiStrongWind } from "react-icons/wi";
import cloud_icon from "../Assets/cloud.png";
import clear_icon from "../Assets/clear.png";
import drizzle_icon from "../Assets/drizzle.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import logo from "../Assets/logo.png";

export const WeatherApp = () => {
  let api_key = "bc7bcc1079f62421f60e6ce473e723b7";
  const [wicon, setWicon] = useState(cloud_icon);
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
    if (data.weather[0].icon === "01d" || data.weather[0].icon === "01") {
      setWicon(clear_icon);
    } else if (
      data.weather[0].icon === "02d" ||
      data.weather[0].icon === "02"
    ) {
      setWicon(cloud_icon);
    } else if (
      data.weather[0].icon === "03d" ||
      data.weather[0].icon === "03"
    ) {
      setWicon(drizzle_icon);
    } else if (
      data.weather[0].icon === "04d" ||
      data.weather[0].icon === "04"
    ) {
      setWicon(drizzle_icon);
    } else if (
      data.weather[0].icon === "09d" ||
      data.weather[0].icon === "09"
    ) {
      setWicon(rain_icon);
    } else if (
      data.weather[0].icon === "10d" ||
      data.weather[0].icon === "10"
    ) {
      setWicon(rain_icon);
    } else if (
      data.weather[0].icon === "13d" ||
      data.weather[0].icon === "13"
    ) {
      setWicon(snow_icon);
    } else {
      setWicon(clear_icon);
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
          variant="primary"
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
