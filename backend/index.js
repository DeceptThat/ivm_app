require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI, {
    family: 4, // Essential for Thai ISP/Hotspot stability
    serverSelectionTimeoutMS: 10000
})
.then(() => console.log("==========================================\n✅ DATABASE CONNECTED SUCCESSFULLY!\n=========================================="))
.catch(err => console.log("❌ CONNECTION ERROR:", err.message));

// 2. TEST ROUTE (Verify Write Access)
app.get('/test-db', async (req, res) => {
    try {
        const testData = { 
            message: "Connection is solid!", 
            timestamp: new Date(),
            device: "MacBook Air" 
        };
        await mongoose.connection.collection('connection_tests').insertOne(testData);
        res.json({ success: true, message: "Successfully wrote to MongoDB!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. BASE ROUTE
app.get('/', (req, res) => {
    res.send("IVM Backend is Running...");
});

// 4. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`📡 Server active on: http://localhost:${PORT}`);
});