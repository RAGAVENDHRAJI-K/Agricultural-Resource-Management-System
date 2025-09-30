const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configure the PostgreSQL pool (database connection)
const pool = new Pool({
    user: 'postgres', // replace with your DB user
    host: 'localhost',
    database: 'arms_db',
    password: 'postgres', // replace with your DB password
    port: 5432,
});

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


/* Add Farmer Route
app.post('/addFarmer', async (req, res) => {
    const { farmerID, name, contact, location } = req.body;

    // Log request data
    console.log('Received data:', req.body);

    try {
        const query = `
            INSERT INTO Farmer ("farmer_id", "name", "contact_info", "farm_location")
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const result = await pool.query(query, [farmerID, name, contact, location]);
        console.log('Farmer added:', result.rows[0]);

        // Respond with the added farmer
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding farmer:', error); // Log detailed error
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Get Farmers Route
app.get('/getFarmers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Farmer');
        res.status(200).json(result.rows); // Return all farmers
    } catch (error) {
        console.error('Error fetching farmers:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});*/
app.post('/addFarmer', async (req, res) => {
    const { farmerID, name, contact, location } = req.body;

    // Log request data
    console.log('Received data:', req.body);

    try {
        const query = `
            INSERT INTO Farmer ("farmer_id", "name", "contact_info", "farm_location")
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const result = await pool.query(query, [farmerID, name, contact, location]);
        console.log('Farmer added:', result.rows[0]);

        // Respond with the added farmer
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding farmer:', error); // Log detailed error
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Get Farmers Route
app.get('/getFarmers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Farmer');
        res.status(200).json(result.rows); // Return all farmers
    } catch (error) {
        console.error('Error fetching farmers:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Update Farmer Route
app.post('/updateFarmer', async (req, res) => {
    const { farmerID, name, contact, location } = req.body;

    try {
        const query = `
            UPDATE Farmer
            SET "name" = $2, "contact_info" = $3, "farm_location" = $4
            WHERE "farmer_id" = $1
            RETURNING *;
        `;
        const result = await pool.query(query, [farmerID, name, contact, location]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Farmer not found' });
        } else {
            console.log('Farmer updated:', result.rows[0]);
            res.status(200).json(result.rows[0]); // Respond with the updated farmer
        }
    } catch (error) {
        console.error('Error updating farmer:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Delete Farmer Route
app.delete('/deleteFarmer/:farmerID', async (req, res) => {
    const { farmerID } = req.params;

    try {
        const query = `
            DELETE FROM Farmer
            WHERE "farmer_id" = $1
            RETURNING *;
        `;
        const result = await pool.query(query, [farmerID]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Farmer not found' });
        } else {
            console.log('Farmer deleted:', result.rows[0]);
            res.status(200).json({ message: 'Farmer deleted successfully', farmer: result.rows[0] });
        }
    } catch (error) {
        console.error('Error deleting farmer:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Route to add a crop
app.post('/addCrop', (req, res) => {
    const { cropID, cropName, waterRequirements, soilType, fertilizerRequirements, expectedYield } = req.body;
    const query = 'INSERT INTO crop (crop_id, crop_name, water_requirements, soil_type, fertilizer_requirements, expected_yield) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [cropID, cropName, waterRequirements, soilType, fertilizerRequirements, expectedYield];

    pool.query(query, values, (error, results) => {
        if (error) {
            console.error('Error inserting crop:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Crop added successfully' });
        }
    });
});

// Route to fetch all crops
app.get('/getCrops', (req, res) => {
    const query = 'SELECT * FROM crop';

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching crops:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json(results.rows);
        }
    });
});


// Add Weather
app.post('/addWeather', async (req, res) => {
    const { weather_id, date, temperature, precipitation, soil_conditions } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO weather (weather_id, date, temperature, precipitation, soil_conditions) VALUES ($1, $2, $3, $4, $5)',
            [weather_id, date, temperature, precipitation, soil_conditions]
        );
        res.json({ message: 'Weather data added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Weather Data
app.get('/getWeather', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM weather');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/addMarketPrice', async (req, res) => {
    const { market_price_id, crop_id, date, price } = req.body;

    console.log('Received data:', req.body); // Debugging

    // Server-side validation
    if (!market_price_id || isNaN(market_price_id)) {
        return res.status(400).json({ error: 'Market Price ID must be a valid number.' });
    }
    if (!crop_id || isNaN(crop_id)) {
        return res.status(400).json({ error: 'Crop ID must be a valid number.' });
    }
    if (!price || isNaN(price)) {
        return res.status(400).json({ error: 'Price must be a valid number.' });
    }

    try {
        const query = `
            INSERT INTO marketprice (market_price_id, crop_id, date, price)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const result = await pool.query(query, [market_price_id, crop_id, date, price]);
        console.log('Insert successful:', result.rows[0]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


// Get Market Prices
app.get('/getMarketPrices', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM marketprice');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching market prices:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Add Inventory Route
app.post('/addInventory', async (req, res) => {
    const { inventoryID, resourceID, quantity, unit } = req.body;

    // Log request data
    console.log('Received data:', req.body);

    try {
        const query = `
            INSERT INTO inventory ("inventory_id", "resource_id", "quantity", "unit")
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const result = await pool.query(query, [inventoryID, resourceID, quantity, unit]);
        console.log('Inventory added:', result.rows[0]);

        // Respond with the added inventory
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding inventory:', error); // Log detailed error
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Get Inventory Route
app.get('/getInventory', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inventory');
        res.status(200).json(result.rows); // Return all inventory records
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});
// Add Resource Route
app.post('/addResource', async (req, res) => {
    const { resourceID, resourceName, type } = req.body;

    // Log request data
    console.log('Received data:', req.body);

    try {
        const query = `
            INSERT INTO resource ("resource_id", "resource_name", "resource_type")
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const result = await pool.query(query, [resourceID, resourceName, type]);
        console.log('Resource added:', result.rows[0]);

        // Respond with the added resource
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding resource:', error); // Log detailed error
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Get Resource Route
app.get('/getResource', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM resource');
        res.status(200).json(result.rows); // Return all resource records
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.post('/addFarmerCrop', async (req, res) => {
    // Extract data from request body
    const { farmer_id, crop_id, planting_date, harvest_date, yield: crop_yield } = req.body;

    // Debugging: Log received data
    console.log('Received data:', req.body);

    // Validation: Check for missing or empty values
    if (!farmer_id || !crop_id || !planting_date || !harvest_date || !crop_yield) {
        return res.status(400).json({ error: 'All fields are required. Ensure all inputs are valid.' });
    }

    try {
        // SQL Query for Inserting Farmer Crop Data
        const query = `
            INSERT INTO farmer_crop (farmer_id, crop_id, planting_date, harvest_date, yield)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        // Execute query with provided values
        const result = await pool.query(query, [farmer_id, crop_id, planting_date, harvest_date, crop_yield]);

        // Debugging: Log the inserted data
        console.log('Farmer crop added successfully:', result.rows[0]);

        // Send a success response
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Handle foreign key constraint violation (invalid farmer_id or crop_id)
        if (error.code === '23503') {
            res.status(400).json({
                error: 'Invalid Farmer ID or Crop ID. Ensure the IDs exist in their respective tables.',
            });
        } 
        // Handle other SQL errors
        else {
            console.error('Error adding farmer crop:', error);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
});


// Get Farmer Crop Route
app.get('/getFarmerCrop', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM farmer_crop');
        res.status(200).json(result.rows); // Return all farmer crop records
    } catch (error) {
        console.error('Error fetching farmer crops:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log('Server running on http://localhost:${port}');
});