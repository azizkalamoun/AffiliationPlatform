import User from "@/models/user.model"
import { UserType } from "@/types"
import bcrypt from "bcrypt"

export const createUser = async (userData: UserType) => {
  const newUser = await User.create(userData)
  return newUser
}

export const fetchAllUsers = async () => {
  const users = await User.findAll()
  return users
}

export const updatePassword = async (id: number, newPassword: string) => {
  try {
    console.log(id)
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const result = await User.update({ password: hashedPassword }, { where: { id } })
    if (result[0] === 1) {
      console.log("Password updated successfully !")
      return true
    } else {
      console.log("No user found with the provided ID !")
      return false
    }
  } catch (error) {
    console.error("Error updating password in the database: " + error.message)
    throw error
  }
}

export const fetchUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await User.findOne({
      where: { email }
    })
    return user ? user : null
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const fetchUserById = async (userId: string): Promise<User | null> => {
  try {
    const user = await User.findByPk(userId)
    return user || null
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateUser = async (userId: string, userData: unknown): Promise<User | null> => {
  try {
    const [updatedRowsCount, updatedUser] = await User.update(userData, {
      where: { id: userId },
      returning: true // Return the updated user data
    })
    if (updatedRowsCount === 0) {
      return null // User not found or not updated
    }
    return updatedUser[0] // Return the updated user
  } catch (error) {
    console.error("Error updating user in the database:", error)
    throw error
  }
}

// Delete user from the database
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const deletedRowsCount = await User.destroy({
      where: { id: userId }
    })
    return deletedRowsCount > 0
  } catch (error) {
    console.error("Error deleting user from the database:", error)
    throw error
  }
}

export const updateUserStatus = async (userIds: string[], status: string) => {
  try {
    const results = await Promise.all(userIds.map((userId) => User.update({ status }, { where: { id: userId } })))
    return results.map((result) => result[0] > 0)
  } catch (error) {
    console.error("Error updating user status in the database:", error)
    throw error
  }
}
