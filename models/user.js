'use strict'
//Import Model, Datatypes and bcrypt
const {Model, DataTypes} = require('sequelize');
const bcrypt = require('bcryptjs');

// Create and Export User Model w/ Proper Validation
module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a first name.'
        },
        notEmpty: {
          msg: 'The field for "First Name" cannot be empty.'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a last name.'
        },
        notEmpty: {
          msg: 'The field for "Last Name" cannot be empty.'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'This email aleady exists in the database. Please use another.'
      },
      validate: {
        notNull: {
          msg: 'Please provide a valid email.'
        },
        notEmpty: {
          msg: 'The field for "E-Mail" cannot be empty.'
        },
        isEmail: {
          msg: 'Sorry, that e-mail is invalid. Please provide a valid e-mail.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if (!val) {
          return val;
        }
        
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      },
      validate: {
        notNull: {
          msg: 'Please provide a valid password.'
        },
        notEmpty: {
           msg: 'The field for "Password" cannot be empty.'
          }
        }
      }
    }, { sequelize });

    // Set one-to-many association
    User.associate = (models) => {
      User.hasMany(models.Course, {
        foreignKey: 'userId'
      });
    };
    
    return User;
};