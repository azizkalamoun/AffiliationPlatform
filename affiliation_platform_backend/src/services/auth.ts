import { UserType } from "@/types"
import jwt from "jsonwebtoken"
import * as nodemailer from "nodemailer"

export function generateAccessToken(user: UserType): string {
  return jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: 86000
  })
}

export function generateRefreshToken(user: UserType): string {
  return jwt.sign({ id: user.id, role: user.role }, process.env.REFRESH_TOKEN_SECRET as string)
}

export function verifyAccessToken(token: string): string | jwt.JwtPayload | null {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
  } catch (error) {
    return null
  }
}

export function verifyRefreshToken(token: string): string | jwt.JwtPayload | null {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string)
  } catch (error) {
    return null
  }
}

export function verifyResetToken(token: string): string | jwt.JwtPayload | null {
  try {
    return jwt.verify(token, process.env.RESET_TOKEN_SECRET as string)
  } catch (error) {
    return null
  }
}

export function generateResetToken(user: UserType): string {
  return jwt.sign({ id: user.id }, process.env.RESET_TOKEN_SECRET as string, {
    expiresIn: 86000
  })
}

export async function sendResetEmail(user: UserType, resetToken: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request",
    text:
      `Dear ${user.email},\n\n` +
      "You have requested to reset your password. Click on the following link to reset your password:\n\n" +
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}\n\n` +
      "If you did not request this, please ignore this email.\n\n" +
      "Best regards,\nYour App Team"
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Password reset email sent successfully.")
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw error
  }
}

export async function sendApprovalEmail(user: UserType) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Registration Approved",
    text: `Dear ${user.firstName},\n\nYour registration has been approved. Welcome!\n\nBest regards,\nNna ressources`
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Approval email sent successfully.")
  } catch (error) {
    console.error("Error sending approval email:", error)
    throw error
  }
}

export async function sendDenialEmail(user: UserType) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Registration Denied",
    text: `Dear ${user.firstName},\n\nWe regret to inform you that your registration has been denied.\n\nBest regards,\nNna ressources`
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Denial email sent successfully.")
  } catch (error) {
    console.error("Error sending denial email:", error)
    throw error
  }
}
