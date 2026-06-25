import { createNewClick, deleteExistingClick, getAllClicks, getClickById } from "@/controllers/click"
import { authenticateToken } from "@/middleware/authMiddleware"
import express from "express"

const router = express.Router()

router.get("/clicks", authenticateToken, getAllClicks)
router.post("/clicks/new", authenticateToken, createNewClick)
router.get("/clicks/:id", authenticateToken, getClickById)
router.delete("/clicks/:id/delete", authenticateToken, deleteExistingClick)

export default router

/**
 * @swagger
 * tags:
 *   name: Clicks
 *   description: Clicks management
 * paths:
 *   /clicks:
 *     get:
 *       summary: Get all clicks
 *       tags: [Clicks]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: List of all clicks
 *         '401':
 *           description: Unauthorized
 *   /clicks/new:
 *     post:
 *       summary: Create a new click
 *       tags: [Clicks]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Click created successfully
 *         '401':
 *           description: Unauthorized
 *   /clicks/{id}:
 *     get:
 *       summary: Get a click by ID
 *       tags: [Clicks]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the click
 *       responses:
 *         '200':
 *           description: The click details
 *         '401':
 *           description: Unauthorized
 *         '404':
 *           description: Not found
 *   /clicks/{id}/delete:
 *     delete:
 *       summary: Delete a click by ID
 *       tags: [Clicks]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the click
 *       responses:
 *         '200':
 *           description: The click was deleted
 *         '401':
 *           description: Unauthorized
 *         '404':
 *           description: Not found
 */
