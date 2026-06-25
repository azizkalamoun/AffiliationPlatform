import { deleteSubscription, fetchSubscriptionById, getSubscriptionsWithRelatedData } from "@/services/subscription"
import { Request, Response } from "express"

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await getSubscriptionsWithRelatedData()
    return res.status(200).json({ success: true, data: subscriptions })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const subscription = await fetchSubscriptionById(id)
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" })
    }
    return res.status(200).json({ success: true, data: subscription })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteExistingSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const success = await deleteSubscription(id)
    if (!success) {
      return res.status(404).json({ success: false, message: "Subscription not found" })
    }
    return res.status(200).json({ success: true, message: "Subscription deleted successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
