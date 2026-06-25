import { Request, Response } from "express"
import {
  createBanner as createBannerService,
  getAllBanners as getAllBannersService,
  deleteBanner as deleteBannerService,
  getBannerById as getBannerByIdService,
  fetchBannersByUrlId as getBannersByUrlId
} from "../services/banner"

export const createBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { src, urlId } = req.body
    const banner = await createBannerService(src, urlId)
    res.status(201).json(banner)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getAllBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const banners = await getAllBannersService()
    res.status(200).json(banners)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getBannerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const banner = await getBannerByIdService(id)
    if (banner) {
      res.status(200).json(banner)
    } else {
      res.status(404).json({ error: "Banner not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}

export const deleteBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const deletedCount = await deleteBannerService(id)
    if (deletedCount) {
      res.status(204).end()
    } else {
      res.status(404).json({ error: "Banner not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}

export const fetchBannersByUrlId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { urlId } = req.params
    if (typeof urlId === "string") {
      const banners = await getBannersByUrlId(urlId)
      res.json(banners)
    } else {
      throw new Error("Invalid URL ID")
    }
  } catch (error) {
    console.error("Error fetching banners by URL ID:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
