import { deleteExistingSubscription, getAllSubscriptions, getSubscriptionById } from "@/controllers/subscription"
import { authenticateToken } from "@/middleware/authMiddleware"
import express from "express"

const router = express.Router()

router.get("/subscriptions", authenticateToken, getAllSubscriptions)
router.get("/subscriptions/:id", authenticateToken, getSubscriptionById)
router.delete("/subscriptions/:id", authenticateToken, deleteExistingSubscription)

export default router
/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscription management
 * paths:
 *   /subscriptions:
 *     get:
 *       summary: Get all subscriptions
 *       tags: [Subscriptions]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: List of all subscriptions
 *         '401':
 *           description: Unauthorized
 *   /subscriptions/new:
 *     post:
 *       summary: Create a new subscription
 *       tags: [Subscriptions]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Subscription created successfully
 *         '401':
 *           description: Unauthorized
 *   /subscriptions/{id}:
 *     get:
 *       summary: Get a subscription by ID
 *       tags: [Subscriptions]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the subscription
 *       responses:
 *         '200':
 *           description: The subscription details
 *         '401':
 *           description: Unauthorized
 *         '404':
 *           description: Not found
 *   /subscriptions/{id}/delete:
 *     delete:
 *       summary: Delete a subscription by ID
 *       tags: [Subscriptions]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the subscription
 *       responses:
 *         '200':
 *           description: The subscription was deleted
 *         '401':
 *           description: Unauthorized
 *         '404':
 *           description: Not found
 */
