navigator.geolocation.getCurrentPosition(
  pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    loadWeather(lat, lon);
  },
  () => alert("Location permission is required.")
);

function loadWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,cloud_cover&daily=sunrise,sunset&timezone=auto`;

  fetch(url)
    .then(res => res.json())
    .then(data => updateUI(data))
    .catch(() => alert("Failed to load weather data"));
}

function updateUI(data) {
  const temp = data.current.temperature_2m;
  const cloud = data.current.cloud_cover;

  const sunrise = new Date(data.daily.sunrise[0]);
  const sunset = new Date(data.daily.sunset[0]);

  document.getElementById("temp").innerText = `${temp} °C`;
  document.getElementById("sunrise").innerText = sunrise.toLocaleTimeString();
  document.getElementById("sunset").innerText = sunset.toLocaleTimeString();

  const daylight =
    (sunset - sunrise) / (1000 * 60 * 60);

  document.getElementById("daylight").innerText =
    daylight.toFixed(1) + " hrs";

  const statusBox = document.getElementById("statusBox");
  const healthMsg = document.getElementById("healthMsg");
  const fogMsg = document.getElementById("fogMsg");

  // Health logic
  if (daylight < 10) {
    healthMsg.innerHTML =
      "⚠️ Low daylight exposure.<br>Go outdoors between 11 AM – 2 PM.";
  } else {
    healthMsg.innerText =
      "✅ Adequate daylight. Maintain regular outdoor activity.";
  }

  // Fog / cloud logic
  if (temp <= 12 && cloud >= 80) {
    fogMsg.innerText =
      "⚠️ Elevated fog risk in morning hours. Visibility may reduce.";
    statusBox.innerText =
      "CAUTION: Low temperature and heavy cloud cover detected.";
    statusBox.style.borderLeftColor = "#facc15";
  } else {
    fogMsg.innerText =
      "✅ No fog risk detected. Visibility conditions are normal.";
    statusBox.innerText =
      "STATUS: Conditions appear safe today.";
    statusBox.style.borderLeftColor = "#22c55e";
  }
}
