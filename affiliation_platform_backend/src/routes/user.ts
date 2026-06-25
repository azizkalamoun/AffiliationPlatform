import {
  approveRegistration,
  updateUser,
  deleteUser,
  denyRegistration,
  fetchAllUsers,
  forgotPassword,
  login,
  register,
  registerUserByRole,
  resetPassword,
  getUserbyId
} from "@/controllers/user"
import { authenticateToken, permission } from "@/middleware/authMiddleware"
import { createClickMiddleware } from "@/middleware/createClickMiddleware"
import express from "express"
const router = express.Router()

// affiliates
router.get("/register", createClickMiddleware)
router.post("/register", register)

// all users
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.put("/reset-password", resetPassword)

// super users
router.get("/users", authenticateToken, permission(["secretary", "admin"]), fetchAllUsers)
router.get("/users/:id", authenticateToken, getUserbyId)
router.put("/users/:id/edit", authenticateToken, updateUser)
router.delete("/users/:id/delete", authenticateToken, permission(["secretary", "admin"]), deleteUser)
router.post("/register-me", registerUserByRole)
router.post("/users/approve-registration", authenticateToken, permission(["secretary", "admin"]), approveRegistration)
router.post("/users/deny-registration", authenticateToken, permission(["secretary", "admin"]), denyRegistration)

export default router

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 * paths:
 *   /register:
 *     post:
 *       summary: Register as an affiliate
 *       tags: [Users]
 *       responses:
 *         '200':
 *           description: User registered as an affiliate successfully
 *         '401':
 *           description: Unauthorized
 *   /login:
 *     post:
 *       summary: Log in
 *       tags: [Users]
 *       responses:
 *         '200':
 *           description: User logged in successfully
 *         '401':
 *           description: Unauthorized
 *   /forgot-password:
 *     post:
 *       summary: Request to reset password
 *       tags: [Users]
 *       responses:
 *         '200':
 *           description: Password reset request sent successfully
 *         '401':
 *           description: Unauthorized
 *   /reset-password:
 *     put:
 *       summary: Reset password
 *       tags: [Users]
 *       responses:
 *         '200':
 *           description: Password reset successfully
 *         '401':
 *           description: Unauthorized
 *   /users:
 *     get:
 *       summary: Get all users
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: List of all users
 *         '401':
 *           description: Unauthorized
 *   /users/{id}/edit:
 *     put:
 *       summary: Update a user by ID
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the user
 *       responses:
 *         '200':
 *           description: The user was updated successfully
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbidden
 *         '404':
 *           description: Not found
 *   /users/{id}/delete:
 *     delete:
 *       summary: Delete a user by ID
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the user
 *       responses:
 *         '200':
 *           description: The user was deleted successfully
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbidden
 *         '404':
 *           description: Not found
 *   /users/approve-registration:
 *     post:
 *       summary: Approve user registration
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: User registration approved successfully
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbidden
 *   /users/deny-registration:
 *     post:
 *       summary: Deny user registration
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: User registration denied successfully
 *         '401':
 *           description: Unauthorized
 *         '403':
 *           description: Forbidden
 */
