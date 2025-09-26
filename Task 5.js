const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");

// Event listener for search button
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
  else alert("Please enter a city name.");
});

// Automatically fetch weather based on user location
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      getWeatherByCoords(latitude, longitude);
    }, () => {
      weatherInfo.innerHTML = "<p>Enter a city to see weather info.</p>";
    });
  } else {
    weatherInfo.innerHTML = "<p>Enter a city to see weather info.</p>";
  }
});

// Fetch weather by city
async function getWeather(city) {
  weatherInfo.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(`https://wttr.in/${city}?format=j1`);
    const data = await res.json();
    displayWeather(data, city);
  } catch (err) {
    weatherInfo.innerHTML = "<p>Unable to fetch weather data.</p>";
    console.error(err);
  }
}

// Fetch weather by coordinates
async function getWeatherByCoords(lat, lon) {
  weatherInfo.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(`https://wttr.in/${lat},${lon}?format=j1`);
    const data = await res.json();
    displayWeather(data, "Your Location");
  } catch (err) {
    weatherInfo.innerHTML = "<p>Unable to fetch weather data.</p>";
    console.error(err);
  }
}

// Map weather description to icon class
function getWeatherIcon(desc) {
  desc = desc.toLowerCase();
  if (desc.includes("sun") || desc.includes("clear")) return "wi-day-sunny";
  if (desc.includes("cloud")) return "wi-cloudy";
  if (desc.includes("rain") || desc.includes("shower")) return "wi-rain";
  if (desc.includes("snow")) return "wi-snow";
  if (desc.includes("storm") || desc.includes("thunder")) return "wi-thunderstorm";
  if (desc.includes("fog") || desc.includes("mist")) return "wi-fog";
  return "wi-na";
}

// Display weather data
function displayWeather(data, locationName) {
  const current = data.current_condition[0];
  const iconClass = getWeatherIcon(current.weatherDesc[0].value);
  weatherInfo.innerHTML = `
    <h2>${locationName}</h2>
    <i class="weather-icon wi ${iconClass}"></i>
    <p><strong>Temperature:</strong> ${current.temp_C}°C / ${current.temp_F}°F</p>
    <p><strong>Weather:</strong> ${current.weatherDesc[0].value}</p>
    <p><strong>Humidity:</strong> ${current.humidity}%</p>
    <p><strong>Wind:</strong> ${current.windspeedKmph} km/h</p>
  `;
}
