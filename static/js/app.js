// Get the number of bathrooms 
function getBathValue() {
    const uiBathrooms = document.getElementById('Bathrooms');
    return parseInt(uiBathrooms.value) 
}

// Get the number of BHK 
function getBHKValue() {
    const uiBHK = document.getElementById('BHK');
    return parseInt(uiBHK.value)
}
// Get the price 
function onClickedEstimatePrice() {
    

    
    const sqft = document.getElementById("uiSqft").value;
    const bhk = getBHKValue();
    const bathrooms = getBathValue();
    const location = document.getElementById("Location").value;
    const estPrice = document.getElementById("uiEstimatedPrice");
    const url = "http://127.0.0.1:5000/predict";

    // Validate sqft 
    if (!sqft || isNaN(sqft) || parseFloat(sqft) < 500 || parseFloat(sqft) > 50000) {
        estPrice.innerHTML = `<h2 style="color: red;">Please enter a square footage between 500 and 50,000.</h2>`;
        return; // Exit the function to prevent further processing
    }

   
    const formData = new URLSearchParams({
        total_sqft: parseFloat(sqft),
        bhk: bhk,
        bath: bathrooms,
        location: location
    });

    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Error response text:', text);
                throw new Error('Unable to post');
            });
        }
        return response.json();
    })
    .then(data => {
        let estimatedPrice = data.estimated_price;
        console.log('Estimated Price:', estimatedPrice);

        // Convert price to Crores if it's above 100 Lakhs
        if (estimatedPrice > 100) {
            const priceInCrores = (estimatedPrice / 100).toFixed(2); 
            estPrice.innerHTML = `<h2>Rs. ${priceInCrores} Crores</h2>`;
        } else {
            estPrice.innerHTML = `<h2>Rs. ${estimatedPrice} Lakhs</h2>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        estPrice.innerHTML = `<h2 style="color: red;">An error occurred. Please try again.</h2>`;
    });
}

// Load locations 
function onPageLoad() {
   

    const url = "http://127.0.0.1:5000/locations";

    fetch(url)
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Error response text:', text);
                throw new Error('Unable to fetch Data');
            });
        }
        return response.json();
    })
    .then(data => {
      
        if (data && data.locations) {
            const locations = data.locations;
            const uiLocations = document.getElementById("Location");
            uiLocations.innerHTML = ''; 
            locations.forEach(location => {
                const opt = document.createElement('option');
                opt.value = location;
                opt.innerHTML = location;
                uiLocations.appendChild(opt);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const uiLocations = document.getElementById("Locations");
        uiLocations.innerHTML = '<option>Error loading locations</option>';
    });
}

window.onload = onPageLoad;
