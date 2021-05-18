'use strict';

// Import Modules and Models
const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const { sequelize } = require('./models');

// Import Routes
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Initialize Express Application
const app = express();

// Enable All CORS Requests
app.use(cors({
  exposedHeaders: 'Location'
}));

// Setup HTTP Request Logging and Retrieval Using Morgan
app.use(morgan('dev'));

// Parse Body to JSON
app.use(express.json());

// Add Routes
app.use('/api', courseRoutes, userRoutes);

// Asynchronous Function to Test Connection/Sync to Database
(async () => {
  try {
    await sequelize.sync()
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// GET Root Path and Provide Friendly Message
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// 404 Handler For Non-Route
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Global Handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// Set Port to 5000
app.set('port', process.env.PORT || 5000);

// Begin Listening on Port 5000
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
