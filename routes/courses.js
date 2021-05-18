'use strict'

// Import Express Module
const express = require('express');

// Import User and Course models
const { Course, User } = require('../models');

// Import middleware for functionality
const asyncHandler = require('../middleware/async-handler').asyncHandler;
const authenticateUser = require('../middleware/auth-user').authenticateUser;

// Create modular, mountable route handlers
const router = express.Router();

// GET List of All Courses, including User that owns each course
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        attributes: {
          exclude: [ 'password', 'createdAt', 'updatedAt']
        }
      },
    ],
    attributes: {
      exclude: [ 'createdAt', 'updatedAt' ]
    }
  });
  res.json(courses);
}));

// GET Specific Course, Based Off Course ID
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: {
          exclude: [ 'password', 'createdAt', 'updatedAt' ]
        }
      },
    ],
    attributes: {
      exclude: [ 'createdAt', 'updatedAt' ]
    }
  });
  res.json(course);
}));

// POST Request to Create a New Course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201)
      .location(`/courses/${course.id}`)
      .end();
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw err;
    }
  }
}));

// PUT Request to Update an Existing Course, Based Off ID
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    const currentUser = req.currentUser;
		if (!course) {
			res.status(404).end();
			return;
		}

		if (course.userId === currentUser.id) {
			await course.update(req.body);
			res.status(204).end();
		} else {
			res.status(403).json("You must own the course to update it!");
		}
  } catch(err) {
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw err;
    }
  }
}));

// DELETE Request to Remove A Course, Based Off ID
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    const currentUser = req.currentUser;
		if (!course) {
			res.status(404).end();
			return;
		} 

		if (course.userId === currentUser.id) {
			await course.destroy(req.body);
			res.status(204).end();
		} else {
			res.status(403).json("You must own the course to delete it!");
		}
  } catch(err) {
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw err;
    }
  }
}));

module.exports = router;