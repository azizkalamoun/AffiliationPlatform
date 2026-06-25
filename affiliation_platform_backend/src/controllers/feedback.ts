import { Request, Response } from "express"
import {
  createFeedback as createFeedbackService,
  getAllFeedbacks as getAllFeedbacksService,
  getFeedbackById as getFeedbackByIdService,
  deleteFeedback as deleteFeedbackService
} from "@/services/feedback"

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { subject, object, userId } = req.body
    const feedback = await createFeedbackService(subject, object, userId)
    res.status(201).json(feedback)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getAllFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await getAllFeedbacksService()
    res.status(200).json(feedbacks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const feedback = await getFeedbackByIdService(id)
    if (feedback) {
      res.status(200).json(feedback)
    } else {
      res.status(404).json({ error: "Feedback not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const success = await deleteFeedbackService(id)
    if (success) {
      res.status(200).json({ message: "Feedback deleted successfully" })
    } else {
      res.status(404).json({ error: "Feedback not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
