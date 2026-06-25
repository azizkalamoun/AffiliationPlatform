import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "@/services/auth"
import { UserType } from "@/types"
import { NextFunction, Request, Response } from "express"
import { JwtPayload } from "jsonwebtoken"

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"]
    // console.log("authHeader", authHeader)
    const accessToken = authHeader && authHeader.split(" ")[1]

    if (!accessToken) {
      return res.status(401).json({ message: "Access token is missing" })
    }

    const decodedToken = verifyAccessToken(accessToken)
    if (!decodedToken) {
      return res.status(403).json({ message: "Invalid access token" })
    }
    return next()
  } catch (error) {
    // console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export async function refreshToken(req: Request, res: Response): Promise<Response> {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) {
      // console.log("Refresh token is missing")
      return res.status(400).json({ message: "Refresh token is missing" })
    }
    const decodedToken = verifyRefreshToken(token)
    // console.log("Decoded refresh token:", decodedToken)
    if (typeof decodedToken === "string" || !decodedToken) {
      // console.log("Invalid refresh token")
      return res.status(403).json({ message: "Invalid refresh token" })
    }
    const accessToken = generateAccessToken(decodedToken as UserType)
    return res.status(200).json({ success: true, accessToken })
  } catch (error) {
    // console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export function permission(requiredRole: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "Access token is missing" })
    }

    try {
      const decodedToken = verifyAccessToken(token)
      const userRole = (decodedToken as JwtPayload).role

      if (requiredRole.indexOf(userRole) === -1) {
        return res.status(403).json({ message: "Unauthorized access" })
      }
      next()
    } catch (error) {
      // console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    }
    return null
  }
}
