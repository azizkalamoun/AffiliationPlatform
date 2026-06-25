import { createUrl, deleteUrl, fetchAllUrls, fetchUrlById, updateUrl } from "@/services/url"
import { UrlType } from "@/types"
import { Request, Response } from "express"

export const createNewUrl = async (req: Request, res: Response) => {
  try {
    const urlData: UrlType = req.body
    const newUrl = await createUrl(urlData)
    return res.status(201).json({ success: true, data: newUrl })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllUrls = async (req: Request, res: Response) => {
  try {
    const urls = await fetchAllUrls()
    return res.status(200).json({ success: true, data: urls })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getUrlById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const url = await fetchUrlById(id)
    if (!url) {
      return res.status(404).json({ success: false, message: "URL not found" })
    }
    return res.status(200).json({ success: true, data: url })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const updateExistingUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const urlData: UrlType = req.body
    const success = await updateUrl(id, urlData)
    if (!success) {
      return res.status(404).json({ success: false, message: "URL not found" })
    }
    return res.status(200).json({ success: true, message: "URL updated successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteExistingUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const success = await deleteUrl(id)
    if (!success) {
      return res.status(404).json({ success: false, message: "URL not found" })
    }
    return res.status(200).json({ success: true, message: "URL deleted successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}