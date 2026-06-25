import User from "@/models/user.model"
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  sendApprovalEmail,
  sendDenialEmail,
  sendResetEmail,
  verifyResetToken
} from "@/services/auth"
import { createSubscription } from "@/services/subscription"
import { fetchUrlIdByBase } from "@/services/url"
import {
  createUser,
  deleteUser as deleteUserService,
  fetchUserByEmail,
  fetchUserById,
  updatePassword,
  updateUser as updateUserService,
  updateUserStatus
} from "@/services/user"
import bcrypt from "bcrypt"
import { Request, Response } from "express"

// all users
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json("email and password are required")
    }
    const user = await fetchUserByEmail(email)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: "wrong credentials" })
    }
    if (user.role === "affiliate") {
      if (user.status === "waiting list") {
        return res.status(403).json({ message: "You are still in the waiting list" })
      }
      if (user.status === "denied") {
        return res
          .status(403)
          .json({ message: "Your request has been denied. Please contact the administrator for more information." })
      }
    }
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    return res
      .status(200)
      .json({ success: true, message: "Login successful", accessToken, refreshToken, role: user.role })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body
    console.log("Received email:", email)
    if (!email) {
      console.log("Email is required")
      return res.status(400).json({ success: false, message: "Email is required" })
    }
    const user = await fetchUserByEmail(email)
    if (!user) {
      console.log("User not found")
      return res.status(404).json({ success: false, message: "User not found" })
    }
    const resetToken = generateResetToken(user)
    await sendResetEmail(user, resetToken)
    return res.status(200).json({ success: true, message: "Password reset instructions sent to your email" })
  } catch (error) {
    console.error("Error during password reset:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { resetToken, newPassword } = req.body
    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Reset token and new password are required" })
    }
    const decodedToken = verifyResetToken(resetToken)
    if (typeof decodedToken === "string" || !decodedToken) {
      return res.status(403).json({ message: "Invalid reset token" })
    }
    await updatePassword(decodedToken.id, newPassword)
    return res.status(200).json({ success: true, message: "Password reset successful" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

// super users
export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll()
    return res.status(200).send({ success: true, data: users })
  } catch (error) {
    return res.status(500).send({
      message: error.message || "Some error occurred while retrieving users."
    })
  }
}

export const getUserbyId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const user = await fetchUserById(userId)
    if (user) {
      res.json({ data: user })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export async function updateUser(req: Request, res: Response): Promise<Response> {
  try {
    const userId = req.params.id
    const { email, password, role } = req.body
    if (!userId) {
      return res.status(400).json({ message: "userId is required" })
    }

    const existingUser = await fetchUserById(userId)
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" })
    }
    let hashedPassword
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }
    const userData: {
      firstName?: string
      lastName?: string
      phoneNumber?: string
      country?: string
      email?: string
      password?: string
      role?: string
      occupation?: string
      age?: number
      gender?: string
    } = { ...req.body }
    if (email) userData.email = email
    if (hashedPassword) userData.password = hashedPassword
    if (role) userData.role = role
    await updateUserService(userId, userData)
    return res.status(200).json({ success: true, message: "User updated successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

export async function deleteUser(req: Request, res: Response): Promise<Response> {
  try {
    const userId = req.params.id
    console.log("userId", userId)

    if (!userId) {
      return res.status(400).json({ message: "userId is required" })
    } else {
      const existingUser = await User.findByPk(userId)
      if (!existingUser) {
        return res.status(404).json("User not found")
      }
      await deleteUserService(userId)
      return res.status(200).json({ success: true, message: "User deleted successfully" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

export async function registerUserByRole(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName, country, phoneNumber, role, occupation, age, gender } = req.body
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !country ||
      !phoneNumber ||
      !role ||
      !occupation ||
      !age ||
      !gender
    ) {
      return res.status(400).json({ message: "Missing credentials" })
    }
    const existingUser = await fetchUserByEmail(email)
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      country,
      phoneNumber,
      role,
      occupation,
      age,
      gender
    })
    return res.status(201).json({ success: true, message: "You have been registered as a " + role + " successfully." })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

export async function approveRegistration(req: Request, res: Response) {
  try {
    const { affiliatesIds }: { affiliatesIds: string[] } = req.body
    if (!affiliatesIds || !Array.isArray(affiliatesIds)) {
      return res.status(400).json("affiliatesIds must be provided as an array")
    }

    const users = await Promise.all(
      affiliatesIds.map(async (userId) => {
        await updateUserStatus([userId], "approved")
        return fetchUserById(userId)
      })
    )

    await Promise.all(users.map((user) => sendApprovalEmail(user)))

    return res.status(200).json({ success: true, message: "Affiliates approved successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

export async function denyRegistration(req: Request, res: Response) {
  try {
    const { affiliatesIds }: { affiliatesIds: string[] } = req.body
    if (!affiliatesIds || !Array.isArray(affiliatesIds)) {
      return res.status(400).json("affiliatesIds must be provided as an array")
    }

    const users = await Promise.all(
      affiliatesIds.map(async (userId) => {
        await updateUserStatus([userId], "denied")
        return fetchUserById(userId)
      })
    )

    await Promise.all(users.map((user) => sendDenialEmail(user)))

    return res.status(200).json({ success: true, message: "Affiliates denied successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}
/*export async function approveRegistration(req: Request, res: Response) {
  try {
    const { affiliatesIds }: { affiliatesIds: string[] } = req.body
    if (!affiliatesIds || !Array.isArray(affiliatesIds)) {
      return res.status(400).json("affiliatesIds must be provided as an array")
    }
    await Promise.all(affiliatesIds.map((userId) => updateUserStatus([userId], "approved")))
    return res.status(200).json({ success: true, message: "Affiliates approved successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}
export async function denyRegistration(req: Request, res: Response) {
  try {
    const { affiliatesIds }: { affiliatesIds: string[] } = req.body
    if (!affiliatesIds || !Array.isArray(affiliatesIds)) {
      return res.status(400).json("affiliatesIds must be provided as an array")
    }
    await Promise.all(affiliatesIds.map((userId) => updateUserStatus([userId], "denied")))
    return res.status(200).json({ success: true, message: "Affiliates denied successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}*/
// affiliates
export async function register(req: Request, res: Response) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      country,
      role,
      status,
      occupation,
      age,
      gender,
      baseUrl
    } = req.body
    const affiliateId = req.query.ref as string

    if (!email || !password || !firstName || !lastName || !country || !phoneNumber || !occupation || !age || !gender) {
      return res.status(400).json({ message: "All fields are required" })
    }
    const existingUser = await fetchUserByEmail(email)
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" })
    }
    const userRole = role || "affiliate"
    const userStatus = status || "waiting list"
    const registrationMessage =
      status !== "waiting list"
        ? "You have been registered successfully."
        : "You have been registered successfully. You are now on the waiting list."

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      country,
      role: userRole,
      status: userStatus,
      occupation,
      age,
      gender
    })
    if (affiliateId) {
      const existingUser = await User.findByPk(affiliateId)
      console.log("existingUser", existingUser)
      const urlId = await fetchUrlIdByBase(baseUrl)
      console.log("url", urlId)

      if (existingUser && urlId) {
        const sub = await createSubscription({
          subId: newUser.id,
          affiliateId,
          urlId: urlId
        })
        console.log("sub", sub)
      }
    }
    return res.status(201).json({ success: true, message: registrationMessage })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}
