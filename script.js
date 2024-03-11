document.getElementById('car-price-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Basic validation
    const manufacturer = document.getElementById('manufacturer').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const category = document.getElementById('category').value;
    const interior = document.getElementById('interior').value;
    const fuelType = document.getElementById('fuel-type').value;
    const engineVolume = document.getElementById('engine-volume').value;
    const gearBox = document.getElementById('gear-box').value;
    const driveWheels = document.getElementById('drive-wheels').value;
    const doors = document.getElementById('doors').value;
    const color = document.getElementById('color').value;
    const mileage = document.getElementById('mileage').value;

    if (!manufacturer || !model || !year || !category || !interior || !fuelType || !engineVolume || !gearBox || !driveWheels || !doors || !color || !mileage) {
        alert('Please fill in all fields.');
        return;
    }

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Make a POST request to the Flask API
    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        // Open a new window or tab with the prediction result
        const predictionWindow = window.open("", "_blank");
        predictionWindow.document.write(`
            <html>
            <head>
                <title>Car Price Prediction</title>
            </head>
            <body>
                <h1>Car Price Prediction</h1>
                <p>The predicted price for your car is: <strong>${data.prediction}</strong></p>
                <button onclick="window.history.back();">Go Back</button>
            </body>
            </html>
        `);
        predictionWindow.document.close();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
