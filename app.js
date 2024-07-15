document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "afn5myjcbrXoErLt1KmsDEPdYx3UQM2P"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const currentWeatherDiv = document.getElementById("current-weather");
    const dailyForecastDiv = document.getElementById("daily-forecast");
    const hourlyForecastDiv = document.getElementById("hourly-forecast");
  
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      const city = document.getElementById("cityInput").value;
      getWeather(city);
    });
  
    function getWeather(city) {
      const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const locationKey = data[0].Key;
            fetchWeatherData(locationKey);
            fetchDailyData(locationKey);
            fetchHourlyData(locationKey);
          } else {
            currentWeatherDiv.innerHTML = `<p>City not found.</p>`;
            dailyForecastDiv.innerHTML = `<p>City not found.</p>`;
            hourlyForecastDiv.innerHTML = `<p>City not found.</p>`;
          }
        })
        .catch(error => {
          console.error("Error fetching location data:", error);
          currentWeatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
          dailyForecastDiv.innerHTML = `<p>Error fetching location data.</p>`;
          hourlyForecastDiv.innerHTML = `<p>Error fetching location data.</p>`;
        });
    }
  
    function fetchWeatherData(locationKey) {
      const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            displayCurrentWeather(data[0]);
          } else {
            currentWeatherDiv.innerHTML = `<p>No weather data available.</p>`;
          }
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
          currentWeatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
        });
    }
  
    function displayCurrentWeather(data) {
      const temperature = data.Temperature.Metric.Value;
      const weather = data.WeatherText;
      const weatherContent = `
        <h2>Current Weather</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Weather: ${weather}</p>
        <hr>
      `;
      currentWeatherDiv.innerHTML = weatherContent;
    }
  
    function fetchDailyData(locationKey) {
      const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data && data.DailyForecasts) {
            displayDailyForecast(data.DailyForecasts);
          } else {
            dailyForecastDiv.innerHTML = `<p>No weather data available.</p>`;
          }
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
          dailyForecastDiv.innerHTML = `<p>Error fetching weather data.</p>`;
        });
    }

    function fetchHourlyData(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;
    
        fetch(url)
          .then(response => response.json())
          .then(data => {
            if (data && data.length > 0) {
              displayHourlyForecast(data);
            } else {
              hourlyForecastDiv.innerHTML = `<p>No weather data available.</p>`;
            }
          })
          .catch(error => {
            console.error("Error fetching weather data:", error);
            hourlyForecastDiv.innerHTML = `<p>Error fetching weather data.</p>`;
          });
    }
    
      

    function fToC(fahrenheit) {
      return (fahrenheit - 32) * 5 / 9;
    }
  
    function displayDailyForecast(dailyForecasts) {
      let weatherContent = `<h2>5-Day Weather Forecast</h2>`;
      dailyForecasts.forEach((forecast, index) => {
        const date = new Date(forecast.Date).toLocaleDateString();
        const temperatureFahrenheit = forecast.Temperature.Maximum.Value;
        const temperatureCelsius = fToC(temperatureFahrenheit).toFixed(2);
        const weather = forecast.Day.IconPhrase;
        weatherContent += `
          <h3>Day ${index + 1} - ${date}</h3>
          <p>Temperature: ${temperatureCelsius}°C</p>
          <p>Weather: ${weather}</p>
          <hr>
        `;
      });
      dailyForecastDiv.innerHTML = weatherContent;
    }
    function displayHourlyForecast(hourlyForecasts) {
        let weatherContent = `<h2>Hourly Weather Forecast</h2>`;
      
        hourlyForecasts.forEach((data) => {
          const time = new Date(data.DateTime).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true});
          const temperature = data.Temperature.Value;
          weatherContent += `
            <p>${time} : ${temperature}°C</p>
            <hr>
          `;
        });
      
        hourlyForecastDiv.innerHTML = weatherContent; 
    }
  });