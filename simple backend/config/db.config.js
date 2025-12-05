import sequelize from "sequelize"
import "dotenv/config"

const db = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    pool: {
        max: 10,
        min: 0,
        idle: 10000,
        acquire: 30000
    },
    logging: false
})


const testConnection = async () => {
    await db.authenticate()
    console.log('connection has been established successfully')

    db.sync({ alter: true })
}

testConnection()

export default db
