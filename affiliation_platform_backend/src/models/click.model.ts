import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript"
import Url from "./url.model"
import User from "./user.model"

@Table({
  tableName: "clicks",
  modelName: "Click",
  timestamps: false
})
class Click extends Model<Click> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare id?: string

  @ForeignKey(() => Url)
  @Column({
    type: DataType.UUID
  })
  declare urlId: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID
  })
  declare affiliateId: string

  @Column({
    type: DataType.STRING
  })
  declare ipAddress: string

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  declare createdAt?: Date

  @BelongsTo(() => Url)
  url: Url

  @BelongsTo(() => User)
  affiliate: User
}

export default Click
