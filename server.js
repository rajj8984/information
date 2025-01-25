const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('./'));

// Function to save data to CSV file
function saveToCSV(data) {
    const csvLine = `${data.name},${data.personalNumber},${data.topic},${data.email},${new Date().toLocaleString()}\n`;
    const filePath = path.join(__dirname, 'submissions.csv');
    
    // Create headers if file doesn't exist
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'Name,Personal Number,Topic,Email,Timestamp\n');
    }
    
    // Append data to file
    fs.appendFileSync(filePath, csvLine);
}

// Route to handle form submissions
app.post('/submit', (req, res) => {
    try {
        const submission = req.body;
        saveToCSV(submission);
        res.json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
