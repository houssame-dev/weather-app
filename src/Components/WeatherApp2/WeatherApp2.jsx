import React, { useState, useEffect, useRef, useCallback } from "react";
import "./WeatherApp2.css";
import { Toast } from "./Toast";
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
import { MdCalendarMonth, MdAccessTime, MdStorm, MdFavorite, MdFavoriteBorder, MdHistory, MdStar } from "react-icons/md";
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
  const [isLoading, setIsLoading] = useState(false);
  const [cityTimezone, setCityTimezone] = useState(null);
  const [toast, setToast] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("weatherFavorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("weatherRecentSearches");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchCache, setSearchCache] = useState({});
  const timerRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const suppressSuggestionsRef = useRef(false);
  const [cityImage, setCityImage] = useState("");

  // Debounced search function
  const debouncedSearch = useCallback((searchValue) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      // Don't show suggestions if suppressed (e.g., when clicking favorites/recent)
      if (suppressSuggestionsRef.current) {
        suppressSuggestionsRef.current = false;
        setFilteredCities([]);
        setShowSuggestions(false);
        return;
      }

      if (searchValue.trim() === "") {
        setFilteredCities([]);
        setShowSuggestions(false);
        return;
      }

      const filtered = citiesData
        .filter((item) => item.city.toLowerCase().includes(searchValue.toLowerCase()))
        .slice(0, 15);

      setFilteredCities(filtered);
      setShowSuggestions(filtered.length > 0);
    }, 300);
  }, []);

  useEffect(() => {
    debouncedSearch(city);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [city, debouncedSearch]);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const addToFavorites = (cityName, country) => {
    const newFavorite = { city: cityName, country, timestamp: Date.now() };
    const updated = [...favorites.filter(f => f.city !== cityName), newFavorite].slice(0, 5);
    setFavorites(updated);
    localStorage.setItem("weatherFavorites", JSON.stringify(updated));
    showToast(`${cityName} added to favorites!`, "success");
  };

  const removeFromFavorites = (cityName) => {
    const updated = favorites.filter(f => f.city !== cityName);
    setFavorites(updated);
    localStorage.setItem("weatherFavorites", JSON.stringify(updated));
    showToast(`${cityName} removed from favorites`, "info");
  };

  const addToRecent = (cityName, country) => {
    const newRecent = { city: cityName, country, timestamp: Date.now() };
    const updated = [newRecent, ...recentSearches.filter(r => r.city !== cityName)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("weatherRecentSearches", JSON.stringify(updated));
  };

  const isFavorite = (cityName) => {
    return favorites.some(f => f.city === cityName);
  };

  const handleReset = () => {
    setCity("");
    setFilteredCities([]);
    setShowSuggestions(false);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    // Escape to close suggestions
    if (e.key === "Escape") {
      setShowSuggestions(false);
      if (searchInputRef.current) searchInputRef.current.blur();
    }
    // Arrow down/up for navigation (can be enhanced later)
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  useEffect(() => {
    const updateTimer = () => updateDateTime();
    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityTimezone]);

  useEffect(() => {
    searchCity("New York");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateDateTime(timezoneOverride = null) {
    const timezoneToUse = timezoneOverride !== null ? timezoneOverride : cityTimezone;
    
    // Get current UTC time in milliseconds
    const utcNow = new Date();
    const utcTime = utcNow.getTime();
    
    let cityDate;
    
    // If we have city timezone, calculate city's local time
    if (timezoneToUse !== null && timezoneToUse !== undefined) {
      // Calculate city time: UTC + city timezone offset (in milliseconds)
      // timezone is in seconds offset from UTC, so multiply by 1000 to get milliseconds
      const cityTimeMs = utcTime + (timezoneToUse * 1000);
      cityDate = new Date(cityTimeMs);
    } else {
      // Fallback to local time if no city timezone available
      cityDate = new Date();
    }
    
    // Extract date components using UTC methods (since cityDate already has timezone applied)
    const month = String(cityDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(cityDate.getUTCDate()).padStart(2, '0');
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekday = weekdayNames[cityDate.getUTCDay()];
    
    // Extract time components using UTC methods
    const hours = String(cityDate.getUTCHours()).padStart(2, '0');
    const minutes = String(cityDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(cityDate.getUTCSeconds()).padStart(2, '0');
    
    setDate(`${weekday} - ${day}/${month}`);
    setTime(`${hours}:${minutes}:${seconds}`);
  }

  const searchCity = async (searchTerm, skipCache = false) => {
    if (!searchTerm?.trim()) {
      showToast("Please enter a city name!", "error");
      return;
    }

    // Check cache first
    const cacheKey = searchTerm.toLowerCase().trim();
    if (!skipCache && searchCache[cacheKey]) {
      const cached = searchCache[cacheKey];
      const cacheAge = Date.now() - cached.timestamp;
      // Use cache if less than 5 minutes old
      if (cacheAge < 300000) {
        setWeatherData(cached.weatherData);
        setForecastData(cached.forecastData);
        setWicon(iconMap[cached.weatherData.weather[0].icon] || night_clear_sky);
        const timezone = cached.weatherData.timezone || (cached.forecastData?.city?.timezone || 0);
        setCityTimezone(timezone);
        updateDateTime(timezone);
        setCity(searchTerm);
        fetchCityImage(searchTerm);
        addToRecent(searchTerm, cached.weatherData.sys.country);
        setShowSuggestions(false);
        setFilteredCities([]);
        return;
      }
    }

    setIsLoading(true);
    try {
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=Metric&appid=${api_key}`;
      const currentResponse = await fetch(currentWeatherUrl);
      const currentData = await currentResponse.json();
      
      if (currentData.cod !== 200) {
        throw new Error(currentData.message || "City not found");
      }

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&units=Metric&appid=${api_key}`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastDataResult = await forecastResponse.json();

      // Small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 300));

      // Extract timezone from API response (currentData.timezone is in seconds)
      const timezone = currentData.timezone || (forecastDataResult?.city?.timezone || 0);
      setCityTimezone(timezone);

      // Cache the results
      setSearchCache(prev => ({
        ...prev,
        [cacheKey]: {
          weatherData: currentData,
          forecastData: forecastDataResult,
          timestamp: Date.now()
        }
      }));

      setWeatherData(currentData);
      setForecastData(forecastDataResult);
      setWicon(iconMap[currentData.weather[0].icon] || night_clear_sky);
      fetchCityImage(searchTerm);
      setShowSuggestions(false);
      setFilteredCities([]);
      setCity(searchTerm);
      
      // Add to recent searches
      addToRecent(currentData.name, currentData.sys.country);
      
      // Immediately update date/time with new timezone (pass timezone directly)
      updateDateTime(timezone);
      
      showToast(`Weather data loaded for ${currentData.name}!`, "success");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.message || "An error occurred. Please try again.";
      showToast(errorMessage, "error");
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setIsLoading(false);
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
            <button 
              onClick={() => searchCity(city)} 
              className={isLoading ? 'search-loading' : ''}
              disabled={isLoading}
              style={{ transition: 'opacity 0.3s ease' }}
            >
              {isLoading ? (
                <div className="sidebar-spinner"></div>
              ) : (
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
              )}
            </button>
            <input
              ref={searchInputRef}
              className="input"
              placeholder="Search for places..."
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  searchCity(city);
                } else {
                  handleKeyDown(e);
                }
              }}
              onFocus={() => city !== "" && setShowSuggestions(true)}
              onBlur={handleBlur}
              disabled={isLoading}
              aria-label="Search for a city"
              aria-describedby="search-help"
              style={{ opacity: isLoading ? 0.7 : 1, transition: 'opacity 0.3s ease' }}
            />
            <span id="search-help" className="sr-only">Type to search for a city and press Enter to search</span>
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
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setCity(item.city);
                        searchCity(item.city);
                      }
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

        <div className="sidebar-weather-icon-container position-relative">
          {isLoading && <div className="sidebar-skeleton-shimmer"></div>}
          <img 
            src={wicon} 
            alt="weather-icon" 
            className={`day-few-clouds ${isLoading ? 'loading-opacity' : ''}`}
            style={{ transition: 'opacity 0.3s ease' }}
          />
        </div>
        <div className="mt-3 position-relative">
          {isLoading && <div className="sidebar-skeleton-temp"></div>}
          <span className={`sidebar-temp ${isLoading ? 'loading-opacity' : ''}`} style={{ transition: 'opacity 0.3s ease' }}>
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
        <div className="d-flex justify-content-start align-items-center gap-2 position-relative">
          {isLoading && <div className="sidebar-skeleton-status"></div>}
          <div className={isLoading ? 'loading-opacity' : ''} style={{ transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            {weatherData && getWeatherIcon(weatherData.weather[0].main)}
            <span className="sidebar-status">
              {weatherData ? `${weatherData.weather[0].main} ,` : "Loading..."}
            </span>
            <span className="sidebar-description">
              {weatherData?.weather[0].description}
            </span>
          </div>
        </div>
        <div
          className="d-flex justify-content-center align-items-center mt-4 position-relative"
          id="sidebar-image"
        >
          {isLoading && <div className="sidebar-skeleton-image"></div>}
          <div className={`d-flex justify-content-center align-items-center gap-2 sidebar-location ${isLoading ? 'loading-opacity' : ''}`} style={{ transition: 'opacity 0.3s ease' }}>
            <span className="sidebar-city-name">
              {weatherData?.name?.length > 11
                ? `${weatherData.name.substring(0, 11)}...,`
                : `${weatherData?.name || "Loading..."}, `}
            </span>
            <span className="sidebar-country">
              {weatherData?.sys?.country === "EH"
                ? "MA"
                : weatherData?.sys?.country || "..."}
            </span>
            {weatherData && (
              <button
                className="sidebar-favorite-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isFavorite(weatherData.name)) {
                    removeFromFavorites(weatherData.name);
                  } else {
                    addToFavorites(weatherData.name, weatherData.sys.country);
                  }
                }}
                aria-label={isFavorite(weatherData.name) ? `Remove ${weatherData.name} from favorites` : `Add ${weatherData.name} to favorites`}
                title={isFavorite(weatherData.name) ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite(weatherData.name) ? (
                  <MdFavorite color="#ffc107" size={20} />
                ) : (
                  <MdFavoriteBorder color="#ffffff" size={20} />
                )}
              </button>
            )}
          </div>
          <img
            src={cityImage || newyork}
            alt="city-img"
            className={`sidebar-city-img ${isLoading ? 'loading-opacity' : ''}`}
            style={{ transition: 'opacity 0.3s ease' }}
          />
        </div>

        {/* Favorites and Recent Searches - Moved to bottom */}
        {(favorites.length > 0 || recentSearches.length > 0) && (
          <div className="sidebar-quick-access">
            {favorites.length > 0 && (
              <div className="quick-access-section">
                <div className="quick-access-title">
                  <MdStar color="#ffc107" size={16} />
                  <span>Favorites</span>
                </div>
                {favorites.map((fav, idx) => (
                  <div
                    key={idx}
                    className="quick-access-item"
                    onClick={() => {
                      suppressSuggestionsRef.current = true;
                      setShowSuggestions(false);
                      setFilteredCities([]);
                      if (searchInputRef.current) searchInputRef.current.blur();
                      if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current);
                      }
                      searchCity(fav.city);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        suppressSuggestionsRef.current = true;
                        setShowSuggestions(false);
                        setFilteredCities([]);
                        if (searchInputRef.current) searchInputRef.current.blur();
                        if (debounceTimerRef.current) {
                          clearTimeout(debounceTimerRef.current);
                        }
                        searchCity(fav.city);
                      }
                    }}
                  >
                    <span>{fav.city}</span>
                    <button
                      className="quick-access-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavorites(fav.city);
                      }}
                      aria-label={`Remove ${fav.city} from favorites`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {recentSearches.length > 0 && (
              <div className="quick-access-section">
                <div className="quick-access-title">
                  <MdHistory color="#09f" size={16} />
                  <span>Recent</span>
                </div>
                {recentSearches.map((recent, idx) => (
                  <div
                    key={idx}
                    className="quick-access-item"
                    onClick={() => {
                      suppressSuggestionsRef.current = true;
                      setShowSuggestions(false);
                      setFilteredCities([]);
                      if (searchInputRef.current) searchInputRef.current.blur();
                      if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current);
                      }
                      searchCity(recent.city);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        suppressSuggestionsRef.current = true;
                        setShowSuggestions(false);
                        setFilteredCities([]);
                        if (searchInputRef.current) searchInputRef.current.blur();
                        if (debounceTimerRef.current) {
                          clearTimeout(debounceTimerRef.current);
                        }
                        searchCity(recent.city);
                      }
                    }}
                  >
                    <span>{recent.city}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="content">
        {weatherData ? (
          <>
            <h2 className="todays-highlights-title">Today's Highlights</h2>
            <div className="row g-4 mb-5">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className={`card card-sunrise-sunset ${isLoading ? 'loading' : ''}`}>
              {isLoading && <div className="skeleton-shimmer skeleton-loader"></div>}
              <span className="card-title">Sunrise & Sunset</span>
              <div className="d-flex justify-content-center align-items-center gap-5" style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                <img src={sunrise} alt="sunrise_icon" width={60} />
                <span className="sunrise-value">
                  {weatherData?.sys?.sunrise
                    ? formatTimestamp(weatherData.sys.sunrise)
                    : " "}
                </span>
              </div>
              <div className="d-flex justify-content-center align-items-center gap-5" style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
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
            <div className={`card card-wind ${isLoading ? 'loading' : ''}`}>
              {isLoading && <div className="skeleton-shimmer skeleton-loader"></div>}
              <span className="card-title">Wind Status</span>
              <div className="d-flex justify-content-center align-items-center gap-3 mb-3" style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                <img src={wind_speed} alt="wind_speed" width={70} />
                <span className="wind-speed-value">
                  {weatherData?.wind?.speed
                    ? `${weatherData.wind.speed} Km/h`
                    : " "}
                </span>
              </div>
              <div className="d-flex justify-content-around align-items-center" style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
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
            <div className={`card card-humidity ${isLoading ? 'loading' : ''}`}>
              {isLoading && <div className="skeleton-shimmer skeleton-loader"></div>}
              <span className="card-title">Humidity</span>
              <div className="d-flex justify-content-between align-items-center" style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                <span className="humidity-value">
                  {weatherData?.main?.humidity
                    ? `${weatherData.main.humidity} %`
                    : " "}
                </span>
                <img src={humidity} alt="humidity" width={70} />
              </div>
              <div style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                <span className="humidity-status">normal 👍</span>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className={`card card-temperature ${isLoading ? 'loading' : ''}`}>
              {isLoading && <div className="skeleton-shimmer skeleton-loader"></div>}
              <span className="card-title">Temperature</span>
              <div className="d-flex justify-content-between align-items-center" style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
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
            <div className={`card card-pressure ${isLoading ? 'loading' : ''}`}>
              {isLoading && <div className="skeleton-shimmer skeleton-loader"></div>}
              <span className="card-title">Pressure</span>
              <div className="d-flex justify-content-center align-items-center gap-3 mb-3" style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                <img src={pressure} alt="pressure" width={70} />
                <span className="pressure-value">
                  {weatherData?.main?.pressure
                    ? `${weatherData.main.pressure} hPa`
                    : " "}
                </span>
              </div>
              <div className="d-flex justify-content-around align-items-center" style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
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
            <div className={`card card-visibility ${isLoading ? 'loading' : ''}`}>
              {isLoading && <div className="skeleton-shimmer skeleton-loader"></div>}
              <span className="card-title">Visibility</span>
              <div className="d-flex justify-content-between align-items-center" style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                <span className="visibility-value">
                  {weatherData?.visibility
                    ? `${weatherData.visibility} m`
                    : " "}
                </span>
                <img src={visibility} alt="visibility" width={70} />
              </div>
              <div style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                <span className="visibility-status">Average 😀</span>
              </div>
            </div>
          </div>
        </div>
            <h2 className="todays-highlights-title forecast-title">Next 5 Days</h2>
            <div className="row g-4">
          {isLoading ? (
            // Show skeleton loaders for forecast cards
            Array.from({ length: 5 }).map((_, index) => (
              <div className="col-lg-2 col-md-6 col-sm-12" key={`skeleton-${index}`}>
                <div className={`card card-next-5days loading`}>
                  <div className="skeleton-shimmer skeleton-loader"></div>
                  <div style={{ opacity: 0.3, transition: 'opacity 0.3s' }}>
                    <span className="card-title">Day {index + 1}</span>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="skeleton-icon-large"></div>
                    </div>
                    <div className="mt-3 d-flex justify-content-center align-items-center gap-2">
                      <div className="skeleton-text" style={{ width: '60px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            forecastData?.city &&
            processForecastData(forecastData).map((day, index) => (
              <div className="col-lg-2 col-md-6 col-sm-12" key={index}>
                <div className="card card-next-5days">
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
            ))
            )}
          </div>
          </>
        ) : !isLoading && (
          <div className="content-empty-state">
            <div className="empty-state-card">
              <div className="empty-icon-large">☁️</div>
              <h2 className="empty-state-title-main">Welcome to Weather TwoDay</h2>
              <p className="empty-state-description">
                Search for a city above to view current weather conditions and forecast
              </p>
              {(favorites.length > 0 || recentSearches.length > 0) && (
                <div className="empty-state-quick-links">
                  {favorites.length > 0 && (
                    <div className="quick-links-section">
                      <h4>Your Favorites:</h4>
                      <div className="quick-links-items">
                        {favorites.map((fav, idx) => (
                          <button
                            key={idx}
                            className="quick-link-btn"
                            onClick={() => searchCity(fav.city)}
                          >
                            {fav.city}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Empty State for No Data */}
      {!isLoading && !weatherData && (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">🌤️</div>
            <h3 className="empty-state-title">No Weather Data</h3>
            <p className="empty-state-message">
              Search for a city to see weather information
            </p>
          </div>
        </div>
      )}
    </>
  );
};
