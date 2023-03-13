const sequelize = require('../database/connect')
const Sequelize = require('sequelize')

const products = sequelize.define('products', {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey: true 
    },
  title:{
    type: Sequelize.STRING(80),
    allowNull:false,
  },
  price:{
    type: Sequelize.DOUBLE,
    allowNull:false,
  }, 
  image:{
    type: Sequelize.STRING,
    allowNull:false,
  }, 
  description:{
    type: Sequelize.TEXT,
    allowNull:false,
  }
})
module.exports = products