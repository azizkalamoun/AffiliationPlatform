import AffiliateUrl from "@/models/affiliateUrl.model"
import { AffiliateUrlStatusUpdate, AffiliateUrlType } from "@/types"

export const createAffiliateUrl = async (affiliateUrlData: AffiliateUrlType): Promise<AffiliateUrl> => {
  const newAffiliateUrl = await AffiliateUrl.create({
    affiliate_id: affiliateUrlData.affiliateId,
    url_id: affiliateUrlData.urlId,
    status: affiliateUrlData.status
  })
  return newAffiliateUrl
}

export const fetchAllAffiliateUrls = async (): Promise<AffiliateUrl[]> => {
  const affiliateUrls = await AffiliateUrl.findAll()
  return affiliateUrls
}

export const fetchUrlsOfAnAffiliate = async (affiliate_id: string): Promise<AffiliateUrl[] | null> => {
  const affiliateUrl = await AffiliateUrl.findAll({
    where: { affiliate_id }
  })
  return affiliateUrl
}
export const fetchAffiliateUrlByIds = async (affiliate_id: string, url_id: string): Promise<AffiliateUrl | null> => {
  const affiliateUrl = await AffiliateUrl.findOne({
    where: { affiliate_id, url_id }
  })
  return affiliateUrl
}

export const deleteAffiliateUrl = async (affiliate_id: string, url_id: string): Promise<boolean> => {
  const deletedRowsCount = await AffiliateUrl.destroy({ where: { affiliate_id, url_id } })
  return deletedRowsCount > 0
}

export const approveAffiliateUrls = async (
  urls: AffiliateUrlStatusUpdate[]
): Promise<{ success: boolean; message: string }[]> => {
  const results: { success: boolean; message: string }[] = []

  for (const { affiliate_id, url_id } of urls) {
    console.log(affiliate_id, url_id)
    const affiliateUrl = await AffiliateUrl.findOne({ where: { affiliate_id, url_id } })
    console.log("findOne", affiliateUrl)
    if (affiliateUrl) {
      affiliateUrl.status = "approved"
      await affiliateUrl.save()
      results.push({ success: true, message: `Affiliate URL ${url_id} approved.` })
    } else {
      results.push({ success: false, message: `Affiliate URL ${url_id} not found.` })
    }
  }

  return results
}

export const denyAffiliateUrls = async (
  urls: AffiliateUrlStatusUpdate[]
): Promise<{ success: boolean; message: string }[]> => {
  const results: { success: boolean; message: string }[] = []

  for (const { affiliate_id, url_id } of urls) {
    const affiliateUrl = await AffiliateUrl.findOne({ where: { affiliate_id, url_id } })
    if (affiliateUrl) {
      affiliateUrl.status = "denied"
      await affiliateUrl.save()
      results.push({ success: true, message: `Affiliate URL ${url_id} denied.` })
    } else {
      results.push({ success: false, message: ` Affiliate URL ${url_id} not found.` })
    }
  }

  return results
}
