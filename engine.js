let map = L.map('map').setView([27.0366, 88.2627], 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: ''
}).addTo(map);

let current_marker = L.marker([27.0366, 88.2627]).addTo(map);

map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    if (current_marker) map.removeLayer(current_marker);
    current_marker = L.marker([lat, lon]).addTo(map);
    fetch_data(lat, lon);
});

const checkbox = document.getElementById('check');
const inputIds = ['temp', 'humid', 'precip', 'soil', 'elev'];
checkbox.addEventListener('change', function() {
    const is_manual = this.checked;
    inputIds.forEach(id => {
        document.getElementById(id).disabled = !is_manual;
    });
});

async function fetch_data(lat, lon)
{
    const weather_Url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,soil_moisture_0_to_1cm`;
    const elevation_Url = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`;
    const [weather_res, elevation_res] = await Promise.all([
        fetch(weather_Url),
        fetch(elevation_Url)
    ]);
    const weather_data = await weather_res.json();
    const elevation_data = await elevation_res.json();
    const current = weather_data.current;
    const temp = current.temperature_2m;
    const humid = current.relative_humidity_2m;
    const precip = current.precipitation;
    const soil_moisture = (current.soil_moisture_0_to_1cm * 100).toFixed(1); 
    const elevation = elevation_data.elevation[0];
    document.getElementById('temp').disabled = false;
    document.getElementById('temp').value = temp;
    document.getElementById('humid').disabled = false;
    document.getElementById('humid').value = humid;
    document.getElementById('precip').disabled = false;
    document.getElementById('precip').value = precip;
    document.getElementById('soil').disabled = false;
    document.getElementById('soil').value = soil_moisture;
    document.getElementById('elev').disabled = false;
    document.getElementById('elev').value = elevation;
}

document.getElementById('search').addEventListener('click', async function search_place(event)
{
    event.preventDefault();
    const inp = document.getElementById('search-inp');
    const val = inp.value.trim();
    if(!val){
        alert("Please enter the name of the place!");
        return;
    }
    try
    {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(val)}&count=1&language=en&format=json`);
        const data = await response.json();
        if(data.results && data.results.length > 0)
        {
            const result = data.results[0];
            const lat = result.latitude;
            const lon = result.longitude;
            const display_name = result.name;
            map.setView([lat, lon], 11);
            const current_marker = L.marker([lat, lon]).addTo(map);
            fetch_data(lat, lon);
        }
    }
    catch
    {
        alert("Could not find such a location!");
    }
});

document.getElementById('sub').addEventListener('click', async function predict(event)
{
    event.preventDefault();
    let temperature = parseFloat(document.getElementById('temp').value);
    let humidity = parseFloat(document.getElementById('humid').value);
    let precipitation = parseFloat(document.getElementById('precip').value);
    let moisture = parseFloat(document.getElementById('soil').value);
    let elevation = parseFloat(document.getElementById('elev').value);
    let input = [temperature, humidity, precipitation, moisture, elevation];
    try
    {
        const response = await fetch('https://landslide-predictor-2.onrender.com/', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({features: input})
        });
        const data = await response.json()
        if (data.status == 'success')
        {
            let risk = data.risk_percentage;
            let result_element = document.getElementById('score');
            result_element.innerText = `Predicted landslide risk: ${risk} %`;
            result_element.style.color = risk > 50 ? 'red' : 'green';
            document.getElementById('landslide').style.display = "none";
            document.getElementById('check').style.display = "none";
            document.getElementById('disp').style.display = "none";
            document.getElementById('status-box').style.display = 'flex';
            document.getElementById('status-box').style.flexDirection = 'column';
        }
        else
        {
            alert("Prediction error:" + data.message);
        }
    }
    catch (error) {
        console.error('API Error:', error);
        alert('Could not connect to Python Flask server. Ensure app.py is running!');
    }
})
