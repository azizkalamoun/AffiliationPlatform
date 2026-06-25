import Click from "@/models/click.model"
import { createClick } from "@/services/click"
import { fetchUrlIdByBase } from "@/services/url"
import { ClickType } from "@/types"
import { NextFunction, Request, Response } from "express"

export const createClickMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const affiliateId = req.query.ref as string
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl
    const urlObj = new URL(fullUrl)
    const baseUrl = urlObj.hostname
    const urlId = await fetchUrlIdByBase(baseUrl)
    const ipAddress = req.ip

    if (affiliateId && urlId) {
      const existingClick = await Click.findOne({ where: { urlId, affiliateId, ipAddress } })

      if (!existingClick) {
        const clickData: ClickType = {
          urlId: urlId,
          affiliateId: affiliateId,
          ipAddress: ipAddress
        }
        await createClick(clickData)
        console.log(clickData)
      } else {
        console.log("Click from this IP address already exists:", ipAddress)
      }
    }
  } catch (error) {
    console.error("Error creating click:", error)
  } finally {
    next()
  }
}
