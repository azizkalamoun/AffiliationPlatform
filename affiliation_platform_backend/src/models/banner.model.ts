import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript"
import Url from "./url.model"

@Table({
  tableName: "banners",
  modelName: "Banner",
  timestamps: true
})
class Banner extends Model<Banner> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare id: string

  @Column({
    type: DataType.TEXT
  })
  declare src: string

  @ForeignKey(() => Url)
  @Column({
    type: DataType.UUID
  })
  declare urlId: string

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date

  @BelongsTo(() => Url)
  url: Url
}

export default Banner
