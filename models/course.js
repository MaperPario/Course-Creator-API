'use strict';
//Import Model and DataTypes
const { Model, DataTypes } = require('sequelize');

// Create and Export Course Model w/ Proper Validation
module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A course title must be added.'
        },
        notEmpty: {
          msg: 'Course title cannot be empty.'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A course description must be added'
        },
        notEmpty: {
          msg: 'Course description cannot be empty'
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
    }
  }, { sequelize });
  
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  
  return Course;
};