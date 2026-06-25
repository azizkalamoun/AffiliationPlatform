import dotenv from "dotenv"
import { Sequelize } from "sequelize-typescript"
import Earning from "./earning.model"

dotenv.config()

const sequelize = new Sequelize({
  host: process.env.HOST,
  username: process.env.DB_USER,
  password: process.env.PASSWORD || "",
  database: process.env.DB,
  dialect: "mysql",
  models: [__dirname + "/*.model.ts"],
  logging: false
})

const seedEarnings = async () => {
  await Earning.upsert({ type: "subscription", amount: 2.0 }) // Replace with your actual value
  await Earning.upsert({ type: "click", amount: 0.5 }) // Replace with your actual value
}

seedEarnings()
  .then(() => {
    console.log("Earnings table seeded successfully")
  })
  .catch((error) => {
    console.error("Error seeding earnings table:", error)
  })

export default sequelize
