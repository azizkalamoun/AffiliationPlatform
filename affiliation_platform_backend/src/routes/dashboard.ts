import express from "express"
import {
  getAffiliatesCount,
  getLatestSubscriptions,
  getLatestUsers,
  getAffiliateClicksByUrl,
  getAffiliateSubscriptionsByUrl,
  getAffilateAdvertisedUrls
} from "@/controllers/dashboard"
import { authenticateToken, permission } from "@/middleware/authMiddleware"

const router = express.Router()

router.get("/dashboard/affiliate-count", authenticateToken, permission(["admin", "secretary"]), getAffiliatesCount)
router.get("/dashboard/latest-users", authenticateToken, permission(["admin", "secretary"]), getLatestUsers)
router.get("/dashboard/latest-subscriptions", authenticateToken, getLatestSubscriptions)

router.get("/dashboard/affiliate-clicks-by-url", authenticateToken, getAffiliateClicksByUrl)
router.get("/dashboard/affiliate-subscriptions-by-url", authenticateToken, getAffiliateSubscriptionsByUrl)
router.get("/dashboard/affiliate-advertised-urls", authenticateToken, getAffilateAdvertisedUrls)

export default router
