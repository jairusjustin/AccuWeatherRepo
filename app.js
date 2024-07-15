document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "afn5myjcbrXoErLt1KmsDEPdYx3UQM2P"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

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
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts) {
                    displayWeather(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fToC(fahrenheit) {
        return (fahrenheit - 32) * 5 / 9;
      }

    function displayWeather(dailyForecasts) {
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
        weatherDiv.innerHTML = weatherContent;
      }
});