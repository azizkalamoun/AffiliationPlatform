import Earning from "@/models/earning.model"

export const getEarningAmount = async (type: "subscription" | "click") => {
  const earning = await Earning.findOne({ where: { type } })
  return earning ? earning.amount : null
}
