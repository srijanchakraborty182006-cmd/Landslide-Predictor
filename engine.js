document.getElementById('landslide').addEventListener('submit', async function(event) {
    event.preventDefault();
    let temperature = parseFloat(document.getElementById('temp').value);
    let humidity = parseFloat(document.getElementById('humid').value);
    let precipitation = parseFloat(document.getElementById('percip').value);
    let moisture = parseFloat(document.getElementById('moist').value);
    let elevation = parseFloat(document.getElementById('elev').value);
    let input = [temperature, humidity, precipitation, moisture, elevation];
    console.log(input);
    
    try
    {
        const response = await fetch('https://landslide-predictor-1-rge0.onrender.com', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({features: input})
        });
        const data = await response.json()
        if (data.status == 'success')
        {
            let risk = data.risk_percentage;
            let result_element = document.getElementById('score');
            result_element.innerText = `Predicted landslide risk is ${risk} %`;
            result_element.style.color = risk > 50 ? 'red' : 'green';
            document.getElementById('landslide').style.display = 'none';
            document.getElementById('result').style.display = 'flex';
            document.getElementById('result').style.flexDirection = 'column';
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
});
