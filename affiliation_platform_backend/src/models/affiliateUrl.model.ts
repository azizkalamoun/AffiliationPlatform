import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript"
import Url from "./url.model"
import User from "./user.model"

@Table({
  tableName: "affiliate_url",
  modelName: "AffiliateUrl",
  timestamps: true
})
class AffiliateUrl extends Model<AffiliateUrl> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID
  })
  declare affiliate_id: string

  @PrimaryKey
  @ForeignKey(() => Url)
  @Column({
    type: DataType.UUID
  })
  declare url_id: string

  @Column({
    type: DataType.UUID,
    defaultValue: "pending"
  })
  declare status: string
}

export default AffiliateUrl
