import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Express } from "express"
const options = {
  swaggerDefinition: {
    restapi: "1.0.0",
    info: {
      title: "Affiliation Platform API",
      version: "1.0.0",
      description:
        "API documentation for the Affiliation Platform, allowing management of affiliate URLs, clicks, subscriptions, and user-related operations."
    },
    servers: [
      {
        url: "http://localhost:3307",
        description: "Development server"
      }
    ]
  },
  apis: [__dirname + "/routes/*.ts"]
}
const specs = swaggerJsdoc(options)

const swaggerDocs = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }))
}
export default swaggerDocs
