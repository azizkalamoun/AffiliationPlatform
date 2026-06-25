import Url from "@/models/url.model"
import User from "@/models/user.model"
import {
  approveAffiliateUrls as approveService,
  createAffiliateUrl,
  deleteAffiliateUrl,
  denyAffiliateUrls as denyService,
  fetchAffiliateUrlByIds,
  fetchAllAffiliateUrls,
  fetchUrlsOfAnAffiliate
} from "@/services/affiliateUrl"
import { verifyAccessToken } from "@/services/auth"
import { fetchUrlById } from "@/services/url"
import { fetchUserById } from "@/services/user"
import { AffiliateUrlStatusUpdate, UserType } from "@/types"
import { Request, Response } from "express"

export const createNewAffiliateUrl = async (req: Request, res: Response) => {
  try {
    const { affiliateId, urlId, status } = req.body
    const affiliate = await User.findByPk(affiliateId)
    if (!affiliate) {
      return res.status(404).json({ success: false, message: "Affiliate not found" })
    }
    const url = await Url.findByPk(urlId)
    if (!url) {
      return res.status(404).json({ success: false, message: "URL not found" })
    }
    const requestStatus = status || "pending"
    const newAffiliateUrl = await createAffiliateUrl({ affiliateId, urlId, status: requestStatus })
    return res.status(201).json({ success: true, data: newAffiliateUrl })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllAffiliateUrls = async (req: Request, res: Response) => {
  try {
    const affiliateUrls = await fetchAllAffiliateUrls()
    const list = []
    for (const affiliateUrl of affiliateUrls) {
      const url = await fetchUrlById(affiliateUrl.url_id)
      const user: UserType = await fetchUserById(affiliateUrl.affiliate_id)
      if (affiliateUrl.status === "pending") {
        list.push({
          firstName: user.firstName,
          lastName: user.lastName,
          occupation: user.occupation,
          affiliate_id: affiliateUrl.affiliate_id,
          url_id: affiliateUrl.url_id,
          status: affiliateUrl.status,
          url: url.url,
          CompanyName: url.CompanyName,
          Description: url.Description,
          createdAt: url.createdAt,
          updatedAt: url.updatedAt
        })
      }
    }
    return res.status(200).json({ success: true, data: list })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getUrlsOfAnAffiliate = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"]
    const accessToken = authHeader && authHeader.split(" ")[1]
    if (!accessToken) {
      return res.status(401).json({ message: "Access token is missing" })
    }
    const decodedToken = verifyAccessToken(accessToken)
    if (!decodedToken) {
      return res.status(403).json({ message: "Invalid access token" })
    }
    const affiliateId = (decodedToken as UserType).id
    const affiliate = await User.findByPk(affiliateId)
    if (!affiliate) {
      return res.status(404).json({ success: false, message: "Affiliate not found" })
    }

    const affiliateUrls = await fetchUrlsOfAnAffiliate(affiliateId)
    const list = []

    for (const affiliateUrl of affiliateUrls) {
      const url = await fetchUrlById(affiliateUrl.url_id)
      if (affiliateUrl.status === "approved") {
        list.push({
          affiliate_id: affiliateUrl.affiliate_id,
          url_id: affiliateUrl.url_id,
          status: affiliateUrl.status,
          url: url.url,
          CompanyName: url.CompanyName,
          Description: url.Description,
          createdAt: url.createdAt,
          updatedAt: url.updatedAt
        })
      }
    }

    return res.status(200).json({ success: true, data: list })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getAffiliateUrlByIds = async (req: Request, res: Response) => {
  try {
    const { affiliate_id, url_id } = req.params
    const affiliateUrl = await fetchAffiliateUrlByIds(affiliate_id, url_id)
    if (!affiliateUrl) {
      return res.status(404).json({ success: false, message: "AffiliateUrl not found" })
    }
    return res.status(200).json({ success: true, data: affiliateUrl })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteExistingAffiliateUrl = async (req: Request, res: Response) => {
  try {
    const { affiliate_id, url_id } = req.params
    const success = await deleteAffiliateUrl(affiliate_id, url_id)
    if (!success) {
      return res.status(404).json({ success: false, message: "AffiliateUrl not found" })
    }
    return res.status(200).json({ success: true, message: "AffiliateUrl deleted successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const approveAffiliateUrls = async (req: Request, res: Response) => {
  const urls: AffiliateUrlStatusUpdate[] = req.body.urls
  try {
    const results = await approveService(urls)
    return res.status(200).json(results)
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error })
  }
}

// Deny multiple affiliate URLs
export const denyAffiliateUrls = async (req: Request, res: Response) => {
  const urls: AffiliateUrlStatusUpdate[] = req.body.urls
  try {
    const results = await denyService(urls)
    return res.status(200).json(results)
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error })
  }
}
