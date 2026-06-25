import Feedback from "@/models/feedback.model"
import User from "@/models/user.model"

export const createFeedback = async (subject: string, object: string, userId: string) => {
  const feedback = await Feedback.create({ subject, object, userId })
  return feedback
}

export const getAllFeedbacks = async () => {
  return await Feedback.findAll({ include: [{ model: User }] })
}

export const getFeedbackById = async (id: string) => {
  return await Feedback.findByPk(id, { include: [{ model: User }] })
}

export const deleteFeedback = async (id: string) => {
  const feedback = await Feedback.findByPk(id)
  if (feedback) {
    await feedback.destroy()
    return true
  }
  return false
}
