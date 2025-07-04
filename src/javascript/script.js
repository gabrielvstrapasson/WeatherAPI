const apiKeyMap = "FmapiujccHKMqA2TWscP";
let marker = null;

const map = new maplibregl.Map({
  container: "map", // id do container do mapa
  style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKeyMap}`,
  center: [-46.63, -23.55], // Começa em São Paulo
  zoom: 1, // Começa com zoom distante
});

document.querySelector("#search").addEventListener("submit", async (event) => {
  event.preventDefault();

  const cityName = document.querySelector("#city_name").value;
  const country = document.querySelector("#state_code").value;

  if (!cityName) {
    document.querySelector("#weather").classList.remove("show");
    showAlert(`Por favor, insira o nome de uma cidade.            
            <img src="src/images/complete-form.svg"/> 
            `);
    return;
  }

  const apiKey = "f5b6a74dac7a33dbf132ca8ce8693fcb";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
    cityName
  )},${encodeURI(country)}&appid=${apiKey}&units=metric&lang=pt_br`;

  const results = await fetch(apiUrl);
  const json = await results.json();

  if (json.cod === 200) {
    showInfo({
      city: json.name,
      country: json.sys.country,
      temp: json.main.temp,
      tempMax: json.main.temp_max,
      tempMin: json.main.temp_min,
      description: json.weather[0].description,
      tempIcon: json.weather[0].icon,
      windSpeed: json.wind.speed,
      humidity: json.main.humidity,
    });

    const lon = json.coord.lon;
    const lat = json.coord.lat;
    updateMap(lon, lat);
  } else {
    document.querySelector("#weather").classList.remove("show");
    document.querySelector("#map").classList.remove("show");
    showAlert(`
            Não foi possível localizar...

            <img src="src/images/404.svg"/>
        `);
  }
});

function showInfo(json) {
  showAlert("");

  document.querySelector("#weather").classList.add("show");
  document.querySelector("#map").classList.add("show");

  document.querySelector("#title").innerHTML = `${json.city}, ${json.country}`;
  document.querySelector("#temp_value").innerHTML = `${json.temp
    .toFixed(1)
    .toString()
    .replace(".", ",")} <sup>C°</sup>`;
  document.querySelector("#temp_description").innerHTML = `${json.description}`;
  document
    .querySelector("#temp_img")
    .setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`
    );
  document.querySelector("#temp_max").innerHTML = `${json.tempMax
    .toFixed(1)
    .toString()
    .replace(".", ",")} <sup>C°</sup>`;
  document.querySelector("#temp_min").innerHTML = `${json.tempMin
    .toFixed(1)
    .toString()
    .replace(".", ",")} <sup>C°</sup>`;
  document.querySelector("#humidity").innerHTML = `${json.humidity}%`;
  document.querySelector("#wind").innerHTML = `${json.windSpeed.toFixed(
    1
  )}km/h`;
}
function showAlert(message) {
  document.querySelector("#alert").innerHTML = message;
}

function updateMap(lon, lat) {
  if (marker) {
    marker.remove();
  }

  map.flyTo({
    center: [lon, lat],
    zoom: 10,
  });

  marker = new maplibregl.Marker({ color: "#FF0000" })
    .setLngLat([lon, lat])
    .addTo(map);
}
