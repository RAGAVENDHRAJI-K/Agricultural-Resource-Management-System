// Handle form submission to add a farmer
/*document.getElementById('farmerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const farmerID = document.getElementById('farmerID').value;
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const location = document.getElementById('location').value;

    // Send the data to the server to add the farmer
    fetch('http://localhost:3000/addFarmer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ farmerID, name, contact, location }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Farmer added successfully!');
        document.getElementById('farmerForm').reset();
        fetchFarmers();
    })
    .catch(error => {
        console.error('Error adding farmer:', error);
    });
});*/
document.getElementById('farmerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const hiddenFarmerID = document.getElementById('hiddenFarmerID').value; // Check for hidden ID to differentiate between add/update
    const farmerID = document.getElementById('farmerID').value;
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const location = document.getElementById('location').value;

    const endpoint = hiddenFarmerID ? 'updateFarmer' : 'addFarmer'; // Determine whether to update or add

    // Send the data to the server
    fetch(`http://localhost:3000/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ farmerID, name, contact, location }),
    })
        .then((response) => response.json())
        .then((data) => {
            alert(hiddenFarmerID ? 'Farmer updated successfully!' : 'Farmer added successfully!');
            document.getElementById('farmerForm').reset();
            document.getElementById('hiddenFarmerID').value = ''; // Clear the hidden ID
            fetchFarmers();
        })
        .catch((error) => {
            console.error(`Error ${hiddenFarmerID ? 'updating' : 'adding'} farmer:`, error);
        });
});

// Function to fetch and display all farmers
function fetchFarmers() {
    fetch('http://localhost:3000/getFarmers')
        .then((response) => response.json())
        .then((farmers) => {
            const tableBody = document.querySelector('#farmerTable tbody');
            tableBody.innerHTML = '';

            farmers.forEach((farmer) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${farmer["farmer_id"]}</td>
                    <td>${farmer["name"]}</td>
                    <td>${farmer["contact_info"]}</td>
                    <td>${farmer["farm_location"]}</td>
                    <td>
                        <button class="editBtn" data-id="${farmer["farmer_id"]}" data-name="${farmer["name"]}" data-contact="${farmer["contact_info"]}" data-location="${farmer["farm_location"]}">Edit</button>
                        <button class="deleteBtn" data-id="${farmer["farmer_id"]}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Attach event listeners to the edit and delete buttons
            document.querySelectorAll('.editBtn').forEach((button) => {
                button.addEventListener('click', handleEdit);
            });

            document.querySelectorAll('.deleteBtn').forEach((button) => {
                button.addEventListener('click', handleDelete);
            });
        })
        .catch((error) => {
            console.error('Error fetching farmers:', error);
        });
}

// Function to handle edit
function handleEdit(event) {
    const button = event.target;
    const farmerID = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const contact = button.getAttribute('data-contact');
    const location = button.getAttribute('data-location');

    // Populate the form with the farmer's details
    document.getElementById('hiddenFarmerID').value = farmerID;
    document.getElementById('farmerID').value = farmerID;
    document.getElementById('name').value = name;
    document.getElementById('contact').value = contact;
    document.getElementById('location').value = location;

    // Disable the Farmer ID field to prevent edits
    document.getElementById('farmerID').disabled = true;
}

// Function to handle delete
function handleDelete(event) {
    const farmerID = event.target.getAttribute('data-id');

    if (confirm(`Are you sure you want to delete Farmer ID ${farmerID}?`)) {
        fetch(`http://localhost:3000/deleteFarmer/${farmerID}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                alert('Farmer deleted successfully!');
                fetchFarmers();
            })
            .catch((error) => {
                console.error('Error deleting farmer:', error);
            });
    }
}

// Initial fetch to populate the table
fetchFarmers();


// Handle form submission to add a crop
document.getElementById('cropForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cropID = document.getElementById('cropID').value;
    const cropName = document.getElementById('cropName').value;
    const waterRequirements = document.getElementById('waterRequirements').value;
    const soilType = document.getElementById('soilType').value;
    const fertilizerRequirements = document.getElementById('fertilizerRequirements').value;
    const expectedYield = document.getElementById('expectedYield').value;

    // Send the data to the server to add the crop
    fetch('http://localhost:3000/addCrop', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cropID, cropName, waterRequirements, soilType, fertilizerRequirements, expectedYield }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Crop added successfully!');
        document.getElementById('cropForm').reset();
        fetchCrops();
    })
    .catch(error => {
        console.error('Error adding crop:', error);
    });
});

/* Function to fetch and display all farmers
function fetchFarmers() {
    fetch('http://localhost:3000/getFarmers')
    .then(response => response.json())
    .then(farmers => {
        const tableBody = document.querySelector('#farmerTable tbody');
        tableBody.innerHTML = '';

        farmers.forEach(farmer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${farmer["farmer_id"]}</td>
                <td>${farmer["name"]}</td>
                <td>${farmer["contact_info"]}</td>
                <td>${farmer["farm_location"]}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching farmers:', error);
    });
}*/

// Function to fetch and display all crops
function fetchCrops() {
    fetch('http://localhost:3000/getCrops')
    .then(response => response.json())
    .then(crops => {
        const tableBody = document.querySelector('#cropTable tbody');
        tableBody.innerHTML = '';

        crops.forEach(crop => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${crop["crop_id"]}</td>
                <td>${crop["crop_name"]}</td>
                <td>${crop["water_requirements"]}</td>
                <td>${crop["soil_type"]}</td>
                <td>${crop["fertilizer_requirements"]}</td>
                <td>${crop["expected_yield"]}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching crops:', error);
    });
}

// Toggle the visibility of the farmers' table and header
document.getElementById('toggleViewBtn').addEventListener('click', function() {
    const table = document.getElementById('farmerTable');
    const header = document.getElementById('farmersHeader');

    if (table.style.display === 'none') {
        table.style.display = 'table';
        header.style.display = 'block';
        fetchFarmers();
    } else {
        table.style.display = 'none';
        header.style.display = 'none';
    }
});

// Toggle the visibility of the crops' table and header
document.getElementById('toggleCropViewBtn').addEventListener('click', function() {
    const table = document.getElementById('cropTable');
    const header = document.getElementById('cropsHeader');

    if (table.style.display === 'none') {
        table.style.display = 'table';
        header.style.display = 'block';
        fetchCrops();
    } else {
        table.style.display = 'none';
        header.style.display = 'none';
    }
});
// Add Weather Data
document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const weatherID = document.getElementById('weatherID').value;
    const date = document.getElementById('date').value;
    const temperature = document.getElementById('temperature').value;
    const precipitation = document.getElementById('precipitation').value;
    const soilConditions = document.getElementById('soilConditions').value;

    fetch('http://localhost:3000/addWeather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ weather_id: weatherID, date, temperature, precipitation, soil_conditions: soilConditions }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Weather data added!');
        document.getElementById('weatherForm').reset();
        fetchWeatherData();
    })
    .catch(error => {
        console.error('Error adding weather data:', error);
    });
});

// Fetch Weather Data
function fetchWeatherData() {
    fetch('http://localhost:3000/getWeather')
    .then(response => response.json())
    .then(weatherData => {
        const tableBody = document.querySelector('#weatherTable tbody');
        tableBody.innerHTML = '';

        weatherData.forEach(weather => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${weather["weather_id"]}</td>
                <td>${weather["date"]}</td>
                <td>${weather["temperature"]}</td>
                <td>${weather["precipitation"]}</td>
                <td>${weather["soil_conditions"]}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
    });
}

// Toggle Weather Table
document.getElementById('toggleWeatherViewBtn').addEventListener('click', function() {
    const table = document.getElementById('weatherTable');
    const header = document.getElementById('weatherHeader');

    if (table.style.display === 'none') {
        table.style.display = 'table';
        header.style.display = 'block';
        fetchWeatherData();
    } else {
        table.style.display = 'none';
        header.style.display = 'none';
    }
});


document.getElementById('marketPriceForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const marketPriceID = document.getElementById('marketPriceID').value;
    const cropID = document.getElementById('cropID').value;
    const marketDate = document.getElementById('marketDate').value;
    const price = document.getElementById('price').value.trim();

       console.log('Captured Values:', { marketPriceID, cropID, marketDate, price }); // Debug

    // Validation
    if (!cropID || isNaN(cropID)) {
        alert('Crop ID is required and must be a valid number.');
        return;
    }

    // Send data
    fetch('http://localhost:3000/addMarketPrice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            marketPriceID,
            cropID, 
             marketDate,
            price
        }),
    })
        .then((response) => response.json())
        .then(data => {
                        alert('Market Price data added successfully!');
            document.getElementById('marketPriceForm').reset();
           fetchMarketPriceData();
        })
        .catch(error => {console.error('Error adding crop:', error)});
});

// Fetch Market Price Data
function fetchMarketPriceData() {
    fetch('http://localhost:3000/getMarketPrices')
        .then(response => response.json())
        .then(marketPriceData => {
            const tableBody = document.querySelector('#marketPriceTable tbody');
            tableBody.innerHTML = '';

            marketPriceData.forEach(marketPrice => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${marketPrice["market_price_id"]}</td>
                    <td>${marketPrice["crop_id"]}</td>
                    <td>${marketPrice["date"]}</td>
                    <td>${marketPrice["price"]}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching market price data:', error));
}

// Toggle Market Price Table
document.getElementById('toggleMarketPriceViewBtn').addEventListener('click', function () {
    const table = document.getElementById('marketPriceTable');
    const header = document.getElementById('marketPriceHeader');

    if (table.style.display === 'none') {
        table.style.display = 'table';
        header.style.display = 'block';
        fetchMarketPriceData(); // Correct function call
    } else {
        table.style.display = 'none';
        header.style.display = 'none';
    }
});


// Add Inventory
document.getElementById('inventoryForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const inventoryID = document.getElementById('inventoryID').value;
    const resourceID = document.getElementById('resourceID').value;
    const quantity = document.getElementById('quantity').value;
    const unit = document.getElementById('unit').value;

    fetch('http://localhost:3000/addInventory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inventory_id: inventoryID,
            resource_id: resourceID,
            quantity,
            unit,
        }),
    })
    .then(response => response.json())
    .then(() => {
        alert('Inventory added successfully!');
        document.getElementById('inventoryForm').reset();
        fetchInventory();
    })
    .catch(error => console.error('Error adding inventory:', error));
});

// Fetch Inventory
function fetchInventory() {
    fetch('http://localhost:3000/getInventory')
    .then(response => response.json())
    .then(inventory => {
        const tableBody = document.querySelector('#inventoryTable tbody');
        tableBody.innerHTML = '';

        inventory.forEach(inventory => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${inventory.inventory_id}</td>
                <td>${inventory.resource_id}</td>
                <td>${inventory.quantity}</td>
                <td>${inventory.unit}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching inventory:', error));
}

// Toggle Inventory Table
document.getElementById('toggleInventoryViewBtn').addEventListener('click', function() {
    const table = document.getElementById('inventoryTable');
    const header = document.getElementById('inventoryHeader');

    if (table.style.display === 'none') {
        table.style.display = 'table';
        header.style.display = 'block';
        fetchInventory();
    } else {
        table.style.display = 'none';
        header.style.display = 'none';
    }
});
// Add Resource
document.getElementById('resourceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const resourceID = document.getElementById('resourceID').value;
    const resourceName = document.getElementById('resourceName').value;
    const resourceType = document.getElementById('type').value;

    fetch('http://localhost:3000/addResource', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            resource_id: resourceID,
            resource_name: resourceName,
            type: resourceType,
        }),
    })
    .then(response => response.json())
    .then(() => {
        alert('Resource added successfully!');
        document.getElementById('resourceForm').reset();
        fetchResources();
    })
    .catch(error => console.error('Error adding resource:', error));
});

// Fetch Resources
function fetchResources() {
    fetch('http://localhost:3000/getResource')
    .then(response => response.json())
    .then(resources => {
        const tableBody = document.querySelector('#resourceTable tbody');
        tableBody.innerHTML = '';

        resources.forEach(resource => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${resource.resource_id}</td>
                <td>${resource.resource_name}</td>
                <td>${resource.resource_type}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching resources:', error));
}

// Toggle Resource Table
document.getElementById('toggleResourceViewBtn').addEventListener('click', function() {
    const table = document.getElementById('resourceTable');
    const header = document.getElementById('resourceHeader');

    if (table.style.display === 'none') {
        table.style.display = 'table';
        header.style.display = 'block';
        fetchResources();
    } else {
        table.style.display = 'none';
        header.style.display = 'none';
    }
});
// Add Farmer Crop
document.getElementById('farmerCropForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const farmerID = document.getElementById('farmerID').value.trim();
    const cropID = document.getElementById('cropID').value.trim();
    const plantingDate = document.getElementById('plantingDate').value.trim();
    const harvestDate = document.getElementById('harvestDate').value.trim();
    const yieldValue = document.getElementById('yield').value.trim();

    console.log('Sending data:', {
        farmer_id: farmerID,
        crop_id: cropID,
        planting_date: plantingDate,
        harvest_date: harvestDate,
        yield: yieldValue,
    });
});
    
// Fetch Farmer Crops
function fetchFarmerCrops() {
    fetch('http://localhost:3000/getFarmerCrop')
    .then(response => response.json())
    .then(farmerCrops => {
        const tableBody = document.querySelector('#farmerCropTable tbody');
        tableBody.innerHTML = '';

        farmerCrops.forEach(farmer_crop => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${farmer_crop.farmer_id}</td>
                <td>${farmer_crop.crop_id}</td>
                <td>${farmer_crop.planting_date}</td>
                <td>${farmer_crop.harvest_date}</td>
                <td>${farmer_crop.yield}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching farmer crop data:', error));
    
}
// Toggle Farmer Crop Table
document.getElementById('toggleFarmerCropViewBtn').addEventListener('click', function() {
    const table = document.getElementById('farmerCropTable');
    const header = document.getElementById('farmerCropHeader');

    if (table.style.display === 'none') {
        table.style.display = 'table';
        header.style.display = 'block';
        fetchFarmerCrops();
    } else {
        table.style.display = 'none';
        header.style.display = 'none';
    }
});
//to run node server.js