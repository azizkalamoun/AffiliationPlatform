import connection from "@/models"
import router from "@/routes"
import swagger from "@/swagger"
import cors from "cors"
import dotenv from "dotenv"
import express, { Express } from "express"
dotenv.config()
const app: Express = express()
const port = process.env.PORT || 3001
console.log("port", port)
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use("/api", router)
swagger(app)
;(async () => {
  try {
    await connection.sync({ force: false, alter: true })
    console.log("database connected")
  } catch (error) {
    console.log(error?.message)
  }
})()
app
  .listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
  .on("error", (err) => {
    console.error("server error", err)
  })
