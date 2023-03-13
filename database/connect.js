const Sequelize = require('sequelize')

const sequelize = new Sequelize('e_commerce', 'root', 'ifeoluwa98', {
    host:'localhost',
    dialect: 'mysql'
})

module.exports = sequelize