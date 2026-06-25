// src/services/click.ts
import Click from "@/models/click.model"
import { ClickType } from "@/types"

export const createClick = async (clickData: ClickType): Promise<Click> => {
  const newClick = await Click.create(clickData)
  return newClick
}

export const fetchAllClicks = async (): Promise<Click[]> => {
  const clicks = await Click.findAll()
  return clicks
}

export const fetchClickById = async (clickId: string): Promise<Click | null> => {
  const click = await Click.findByPk(clickId)
  return click
}

export const deleteClick = async (clickId: string): Promise<boolean> => {
  const deletedRowsCount = await Click.destroy({
    where: { id: clickId }
  })
  return deletedRowsCount > 0
}
