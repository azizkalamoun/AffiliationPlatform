import Click from "@/models/click.model"
import Subscription from "@/models/subscription.model"
import Url from "@/models/url.model"
import User from "@/models/user.model"
import { fetchAdvertisedUrls } from "@/services/url"
import { Request, Response } from "express"
import moment from "moment"
import { Op } from "sequelize"

export const getAffiliatesCount = async (req: Request, res: Response) => {
  try {
    const affiliates = await User.findAndCountAll({
      where: { role: "affiliate" }
    })
    const previousMonthCount = await getPreviousMonthUserCount("affiliate")

    const percentageChange = calculatePercentageChange(previousMonthCount, affiliates.count)

    res.status(200).json({ percentageChange, affiliates })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getPreviousMonthCount = async (Model: any, role?: string, affiliateId?: string, urlId?: string) => {
  const currentMonthYear = moment().startOf("month").format("YYYY-MM")
  const previousMonthYear = moment().subtract(1, "month").startOf("month").format("YYYY-MM")

  try {
    const whereClause: any = {
      createdAt: {
        [Op.gte]: previousMonthYear,
        [Op.lt]: currentMonthYear
      }
    }

    if (affiliateId) {
      whereClause.id = affiliateId
    }
    if (urlId) {
      whereClause.urlId = urlId
    }
    if (role) {
      whereClause.role = role
    }
    const count = await Model.count({
      where: whereClause
    })

    return count
  } catch (error) {
    throw new Error(`Error counting elements within date range: ${error.message}`)
  }
}

export const getPreviousMonthUserCount = async (role: string) => {
  return await getPreviousMonthCount(User, role)
}

export const getPreviousMonthSubscriptionCount = async () => {
  return await getPreviousMonthCount(Subscription)
}

export const getPreviousMonthClickCount = async () => {
  return await getPreviousMonthCount(Click)
}

export const getPreviousMonthUrlCount = async () => {
  return await getPreviousMonthCount(Url)
}

const calculatePercentageChange = (previousCount: number, currentCount: number) => {
  if (!previousCount) {
    return "No previous data"
  }
  const change = ((currentCount - previousCount) / previousCount) * 100
  return `+${change.toFixed(1)}% from last month`
}

export const getLatestUsers = async (req: Request, res: Response) => {
  try {
    const latestUsers = await User.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      where: {
        status: "approved",
        role: "affiliate"
      }
    })

    res.status(200).json({ success: true, data: latestUsers })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch latest users", error })
  }
}

export const getLatestSubscriptions = async (req: Request, res: Response) => {
  try {
    const { affiliateId, urlId } = req.query

    const whereClause: any = {}
    if (affiliateId) {
      whereClause.affiliateId = affiliateId
    }
    if (urlId) {
      whereClause.urlId = urlId
    }

    const latestSubscriptions = await Subscription.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Url, as: "url" },
        { model: User, as: "affiliate" },
        { model: User, as: "sub" }
      ],
      where: whereClause
    })

    res.status(200).json({ success: true, data: latestSubscriptions })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch latest subscriptions", error })
  }
}

export const getAffiliateClicksByUrl = async (req: Request, res: Response) => {
  const { affiliateId } = req.query

  try {
    const whereClause: any = {}
    if (affiliateId) {
      whereClause.affiliateId = affiliateId
    }

    const currentMonthCount = await Click.count({
      where: whereClause
    })

    res.status(200).json({ success: true, count: currentMonthCount })
  } catch (error) {
    console.log("error in getAffiliateClicksByUrl:::", error)

    res.status(500).json({ success: false, message: "Failed to fetch clicks", error })
  }
}

export const getAffiliateSubscriptionsByUrl = async (req: Request, res: Response) => {
  const { affiliateId } = req.query

  try {
    const whereClause: any = {}
    if (affiliateId) {
      whereClause.affiliateId = affiliateId
    }
    const currentMonthCount = await Subscription.count({
      where: whereClause
    })

    res.status(200).json({ success: true, count: currentMonthCount })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch subscriptions", error })
  }
}

export const getAffilateAdvertisedUrls = async (req: Request, res: Response) => {
  const { affiliateId } = req.query

  try {
    if (affiliateId) {
      const { urls, count } = await fetchAdvertisedUrls(affiliateId as string)
      res.status(200).json({ success: true, data: urls, count })
    } else {
      const { urls, count } = await fetchAdvertisedUrls()
      res.status(200).json({ success: true, data: urls, count })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
