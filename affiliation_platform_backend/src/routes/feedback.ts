import { createFeedback, getAllFeedbacks, getFeedbackById, deleteFeedback } from "@/controllers/feedback"
import { authenticateToken, permission } from "@/middleware/authMiddleware"
import { Router } from "express"

const router = Router()

router.post("/feedbacks/new", authenticateToken, permission(["affiliate"]), createFeedback)
router.get("/feedbacks", authenticateToken, permission(["admin", "secretary"]), getAllFeedbacks)
router.get("/feedbacks/:id", authenticateToken, permission(["admin", "secretary"]), getFeedbackById)
router.delete("/feedbacks/:id/delete", authenticateToken, permission(["admin", "secretary"]), deleteFeedback)

export default router
/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Feedback management
 * paths:
 *   /feedbacks/new:
 *     post:
 *       summary: Create a new feedback
 *       tags: [Feedback]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       responses:
 *         201:
 *           description: Feedback created successfully
 *         500:
 *           description: Internal server error
 *   /feedbacks:
 *     get:
 *       summary: Get all feedbacks
 *       tags: [Feedback]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: List of all feedbacks
 *         500:
 *           description: Internal server error
 *   /feedbacks/{id}:
 *     get:
 *       summary: Get feedback by ID
 *       tags: [Feedback]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: Feedback ID
 *       responses:
 *         200:
 *           description: Feedback data
 *         404:
 *           description: Feedback not found
 *         500:
 *           description: Internal server error
 *   /feedbacks/{id}/delete:
 *     delete:
 *       summary: Delete feedback by ID
 *       tags: [Feedback]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: Feedback ID
 *       responses:
 *         204:
 *           description: Feedback deleted successfully
 *         404:
 *           description: Feedback not found
 *         500:
 *           description: Internal server error
 */
