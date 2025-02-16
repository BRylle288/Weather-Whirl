const weatherIcons = {
    "01d": "clear-day",
    "01n": "clear-night",
    "02d": "cloudy",
    "02n": "cloudy",
    "03d": "cloudy",
    "03n": "cloudy",
    "04d": "cloudy",
    "04n": "cloudy",
    "09d": "rain",
    "09n": "rain",
    "10d": "rain",
    "10n": "rain",
    "11d": "thunderstorm",
    "11n": "thunderstorm",
    "13d": "snow",
    "13n": "snow",
    "50d": "mist",
    "50n": "mist"
  };
  
  const apiKey = "afba3d92210173a2ab2c525c547729d5"; // Replace with your valid OpenWeatherMap API key
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
  
  async function getWeather() {
    const locationInput = document.getElementById("locationInput").value.trim();
    if (locationInput === "") {
      alert("Please enter a location");
      return;
    }
  
    try {
      let locationQuery = encodeURIComponent(locationInput);
      const response = await fetch(`${apiUrl}${locationQuery}&appid=${apiKey}`);
  
      // Check if response is successful
      if (!response.ok) {
        console.error(`HTTP Error: ${response.status} - ${response.statusText}`);
        switch (response.status) {
          case 401:
            alert("Invalid API key. Please check your OpenWeatherMap API key.");
            break;
          case 404:
            alert("City not found! Please enter a valid location.");
            document.getElementById("city").textContent = "City not found";
            document.getElementById("temperature").textContent = "--";
            document.getElementById("condition").textContent = "--";
            document.getElementById("humidity").textContent = "--";
            document.getElementById("windSpeed").textContent = "--";
            document.getElementById("weatherIcon").src = "";
            return;
          case 429:
            alert("Rate limit exceeded. Try again later.");
            break;
          default:
            alert("Failed to fetch weather data. Please check your internet connection.");
        }
        return;
      }
  
      const data = await response.json();
  
      // If OpenWeatherMap returns an error, show alert
      if (data.cod !== 200) {
        alert(`Error: ${data.message}`);
        return;
      }
  
      // Update UI with weather data
      document.getElementById("city").textContent = `${data.name}, ${data.sys.country}`;
      document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
      document.getElementById("condition").textContent = data.weather[0].description;
      document.getElementById("humidity").textContent = `${data.main.humidity}%`;
      document.getElementById("windSpeed").textContent = `${data.wind.speed} Km/h`;
  
      // Update weather icon from OpenWeatherMap API
      const iconCode = data.weather[0].icon;
      document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}.png`;
  
      // Hide all custom weather icons (if any exist)
      document.querySelectorAll(".weather-img").forEach(img => img.classList.add("hidden"));
  
      // Show custom weather icon based on icon code (if available)
      const customIconId = weatherIcons[iconCode];
      if (customIconId) {
        const customIconEl = document.getElementById(customIconId);
        if (customIconEl) {
          customIconEl.classList.remove("hidden");
        }
      }
  
      // Update the "Last Updated" timestamp safely
      let now = new Date();
      const updatedTimeEl = document.getElementById("updatedTime");
      if (updatedTimeEl) {
        updatedTimeEl.textContent = `Last updated: ${now.toLocaleString()}`;
      } else {
        console.warn('Element with id "updatedTime" not found.');
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }
  
  // Trigger search when pressing 'Enter'
  document.getElementById("locationInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      getWeather();
    }
  });
  