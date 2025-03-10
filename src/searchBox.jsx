import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { useState } from 'react';

export default function WeatherApp() {
  let [city, setCity] = useState('');
  let [state_code, setState_code] = useState('');
  let [country_code, setCountry_code] = useState('');
  let [weather, setWeather] = useState(null);
  let [forecast, setForecast] = useState([]);
  let [locationDetails, setLocationDetails] = useState(null);

  const API = "https://api.openweathermap.org";
  const API_key = "57607abf0cbb08da97aef7ce637bd5bf";

  const handleInput = (evnt) => {
    const { name, value } = evnt.target;
    if (name === "city") setCity(value);
    else if (name === "state_code") setState_code(value);
    else if (name === "country_code") setCountry_code(value);
  };

  const handleSubmit = async (evnt) => {
    evnt.preventDefault();
    const location = await getLocation();
    if (location) {
      setLocationDetails(location);
      await getWeather(location.lat, location.lon);
      await getForecast(location.lat, location.lon);
    }
    setCity('');
    setState_code('');
    setCountry_code('');
  };

  const getLocation = async () => {
    try {
      const response = await fetch(
        `${API}/geo/1.0/direct?q=${city},${state_code},${country_code}&appid=${API_key}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0];
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const getWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `${API}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const getForecast = async (lat, lon) => {
    try {
      const response = await fetch(
        `${API}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
      );
      const data = await response.json();
      const uniqueDates = new Set();
      const filteredForecast = data.list.filter((day) => {
        const date = new Date(day.dt_txt).toLocaleDateString();
        if (!uniqueDates.has(date)) {
          uniqueDates.add(date);
          return true; // Keep this forecast entry
        }
        return false; // Skip this entry if it's for a date we've already seen
      });
      setForecast(filteredForecast.slice(0, 5)); // First 5 unique days
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  };
  
  return (
    <div className="weather-container">
      {/* Today's Weather Section */}
      <div className='today-search'>
      {weather && locationDetails && (
        <div className="today-weather">
          <h3>Today's Weather</h3>
          <div className="weather-info">
            <h4>
              Weather in {weather.name}, {locationDetails.state}, {locationDetails.country}
            </h4>
            <p>Temperature: {weather.main.temp}°C (Feels like: {weather.main.feels_like}°C)</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Pressure: {weather.main.pressure} hPa</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
            <p>Visibility: {weather.visibility / 1000} km</p>
            <p>Weather: {weather.weather[0].description}</p>
          </div>
        </div>
      )}

      {/* Search Box Section */}
      <div className="searchbox-elements">
        <h3 className="weather-heading">Search Weather</h3>
        <form onSubmit={handleSubmit}>
          <TextField
            name="city"
            label="Enter City"
            variant="outlined"
            required
            value={city}
            onChange={handleInput}
          /> <br /><br />
          <TextField
            name="state_code"
            label="Enter State Code"
            variant="outlined"
            value={state_code}
            onChange={handleInput}
          /> <br /><br />
          <TextField
            name="country_code"
            label="Enter Country Code"
            variant="outlined"
            value={country_code}
            onChange={handleInput}
          /> <br /><br />
          <Button variant="contained" type="submit" endIcon={<SendIcon />}>
            Get Weather
          </Button>
        </form>
      </div>

      </div>
      
      {/* Weather and Forecast Output Section */}
      <div className="weather-output">
        {forecast.length > 0 && (
          <div className="forecast-info">
            <h4>5-Day Forecast</h4>
            {forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>Date: {new Date(day.dt_txt).toLocaleDateString()}</p>
                <p>Temperature: {day.main.temp}°C</p>
                <p>Weather: {day.weather[0].description}</p>
                <p>Wind Speed: {day.wind.speed} m/s</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
