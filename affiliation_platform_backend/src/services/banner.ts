import Banner from "@/models/banner.model"

export const createBanner = async (src: string, urlId: string): Promise<Banner> => {
  return await Banner.create({ src, urlId })
}

export const getAllBanners = async (): Promise<Banner[]> => {
  return await Banner.findAll()
}

export const getBannerById = async (id: string): Promise<Banner | null> => {
  return await Banner.findByPk(id)
}

export const deleteBanner = async (id: string): Promise<number> => {
  return await Banner.destroy({ where: { id } })
}

export const fetchBannersByUrlId = async (urlId: string): Promise<Banner[]> => {
  try {
    const banners = await Banner.findAll({ where: { urlId } });
    return banners;
  } catch (error) {
    throw new Error("Error fetching banners by URL ID");
  }
};