import { createBanner, getAllBanners, getBannerById, deleteBanner, fetchBannersByUrlId } from "@/controllers/banner"
import { authenticateToken, permission } from "@/middleware/authMiddleware"
import express from "express"

const router = express.Router()

router.post("/banners/new", authenticateToken, permission(["admin", "secretary"]), createBanner)
router.get("/banners", authenticateToken, permission(["admin", "secretary", "affiliate"]), getAllBanners)
router.get("/banners/:id", authenticateToken, permission(["admin", "secretary", "affiliate"]), getBannerById)
router.get("/banners/url/:urlId", authenticateToken, permission(["affiliate"]), fetchBannersByUrlId)
router.delete("/banners/:id/delete", authenticateToken, permission(["admin", "secretary"]), deleteBanner)

export default router
