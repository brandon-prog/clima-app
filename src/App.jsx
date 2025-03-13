import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";


const API_KEY = "83a52145baa3c77315f8db6557a6fb23";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";

function App() {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });
        },
        () => console.log("Permission denied")
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (coords) {
      axios
        .get(`${BASE_URL}lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric&lang=es`)
        .then((res) => setWeather(res.data))
        .catch((err) => console.log("Error fetching weather:", err));
    }
  }, [coords]);

  const convertTemperature = () => {
    setIsCelsius(!isCelsius);
  };

  const temperature = weather
    ? isCelsius
      ? weather.main.temp
      : (weather.main.temp * 9) / 5 + 32
    : null;

  return (
    
    <div className="container">
      <div className="video-container">
      <video autoPlay loop muted className="background-video">
        <source src="/Fondo.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>
    </div>
      {weather && (
        <div className="card">
  <h1 className="title">Clima</h1>
  <h2 className="location">
    {weather.name}, {weather.sys.country}
  </h2>
  <p className="description">"{weather.weather[0].description}"</p>
  <img
    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
    alt="Ícono del clima"
    className="weather-icon"
  />
  <div className="details">
    <p>
      <strong>Velocidad del viento:</strong> {weather.wind.speed}m/s
    </p>
    <p>
      <strong>Nubosidad:</strong> {weather.clouds.all}%
    </p>
    <p>
      <strong>Presión:</strong> {weather.main.pressure}hPa
    </p>
  </div>
  <h2 className="temperature">
    {temperature.toFixed(1)}°{isCelsius ? "C" : "F"}
  </h2>
  <button onClick={convertTemperature} className="toggle-btn">
    Cambiar a {isCelsius ? "°F" : "°C"}
  </button>
</div>
)}
    </div>
    
  );
}

export default App;
