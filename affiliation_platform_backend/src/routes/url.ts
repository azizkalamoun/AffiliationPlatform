import { createNewUrl, deleteExistingUrl, getAllUrls, getUrlById, updateExistingUrl } from "@/controllers/url"
import { authenticateToken, permission } from "@/middleware/authMiddleware"
import express from "express"

const router = express.Router()

router.get("/urls", authenticateToken, getAllUrls)
router.post("/urls/new", authenticateToken, permission(["admin", "secretary"]), createNewUrl)
router.get("/urls/:id", authenticateToken, getUrlById)
router.put("/urls/:id/edit", authenticateToken, permission(["admin", "secretary"]), updateExistingUrl)
router.delete("/urls/:id/delete", authenticateToken, permission(["admin", "secretary"]), deleteExistingUrl)

export default router

/**
 * @swagger
 * tags:
 *   name: URLs
 *   description: URL management
 * paths:
 *   /urls:
 *     get:
 *       summary: Get all URLs
 *       tags: [URLs]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: List of all URLs
 *         '401':
 *           description: Unauthorized
 *   /urls/new:
 *     post:
 *       summary: Create a new URL
 *       tags: [URLs]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: URL created successfully
 *         '401':
 *           description: Unauthorized
 *   /urls/{id}:
 *     get:
 *       summary: Get a URL by ID
 *       tags: [URLs]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the URL
 *       responses:
 *         '200':
 *           description: The URL details
 *         '401':
 *           description: Unauthorized
 *         '404':
 *           description: Not found
 *   /urls/{id}/edit:
 *     put:
 *       summary: Update an existing URL by ID
 *       tags: [URLs]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the URL
 *       responses:
 *         '200':
 *           description: The URL was updated successfully
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbidden
 *         '404':
 *           description: Not found
 *   /urls/{id}/delete:
 *     delete:
 *       summary: Delete a URL by ID
 *       tags: [URLs]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the URL
 *       responses:
 *         '200':
 *           description: The URL was deleted
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbidden
 *         '404':
 *           description: Not found
 */
