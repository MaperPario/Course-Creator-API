'use strict'

//Import Express Module
const express = require('express');

// Import User Model
const User = require('../models').User;

// Import Middleware
const asyncHandler = require('../middleware/async-handler').asyncHandler;
const authenticateUser = require('../middleware/auth-user').authenticateUser;

// Create Modular, Mountable Route Handlers
const router = express.Router();

// Route to GET Currently Authenicated User
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
  const user = req.currentUser;

  res.json({
    id: user.id,
    email: user.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName
  });
}));

// POST Create User and Set Location Header to '/'
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).location('/').end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

module.exports = router;