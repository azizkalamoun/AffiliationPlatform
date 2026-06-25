import Url from "@/models/url.model"
import User from "@/models/user.model"
import { createClick, deleteClick, fetchAllClicks, fetchClickById } from "@/services/click"
import { ClickType } from "@/types"
import { Request, Response } from "express"

export const createNewClick = async (req: Request, res: Response) => {
  try {
    const { urlId, affiliateId }: ClickType = req.body
    const affiliate = await User.findByPk(affiliateId)
    if (!affiliate) {
      return res.status(404).json({ success: false, message: "Affiliate not found" })
    }
    const url = await Url.findByPk(urlId)
    if (!url) {
      return res.status(404).json({ success: false, message: "URL not found" })
    }
    const newClick = await createClick({ urlId, affiliateId })
    return res.status(201).json({ success: true, data: newClick })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllClicks = async (req: Request, res: Response) => {
  try {
    const clicks = await fetchAllClicks()
    return res.status(200).json({ success: true, data: clicks })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getClickById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const click = await fetchClickById(id)
    if (!click) {
      return res.status(404).json({ success: false, message: "Click not found" })
    }
    return res.status(200).json({ success: true, data: click })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteExistingClick = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const success = await deleteClick(id)
    if (!success) {
      return res.status(404).json({ success: false, message: "Click not found" })
    }
    return res.status(200).json({ success: true, message: "Click deleted successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
