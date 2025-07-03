document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if (!cityName) {
        document.querySelector('#weather').classList.remove('show');
        showAlert('Por favor, insira o nome de uma cidade.');
        return;
    }
    
    const apiKey = 'f5b6a74dac7a33dbf132ca8ce8693fcb';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    const results = await fetch(apiUrl);
    const json = await results.json();

    if (json.cod !== 200) {
        document.querySelector('#weather').classList.remove('show');
        showAlert(`Cidade não encontrada...
            <img src="src/images/404.svg"/> 
            `);

    } else {
        showInfo({
            city: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            temp_min: json.main.temp_min,
            temp_max: json.main.temp_max,
            description: json.weather[0].description,
            tempIcon: json.weather[0].icon,
            wind_speed: json.wind.speed,
            humidity: json.main.humidity,
        });
    }

    
});

function showInfo(json){
    showAlert('');

    document.querySelector('#weather').classList.add('show');
    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;
    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')}<sup>°</sup>C`;
    document.querySelector('#temp_description').innerHTML = json.description.charAt(0).toUpperCase() + json.description.slice(1);
    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);

    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')}<sup>°</sup>C`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')}<sup>°</sup>C`;
    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind_speed').innerHTML = `${json.wind_speed.toFixed(1)} km/h`;
}

function showAlert(message) {
    document.querySelector('#alert').innerHTML = message;
}