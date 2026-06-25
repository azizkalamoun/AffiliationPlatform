import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript"
import AffiliateUrl from "./affiliateUrl.model"
import Click from "./click.model"
import Subscription from "./subscription.model"
import Url from "./url.model"
import Feedback from "./feedback.model"

@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true
})
class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare id: string

  @Column({
    type: DataType.STRING
  })
  declare email: string

  @Column({
    type: DataType.STRING
  })
  declare password: string

  @Column({
    type: DataType.STRING
  })
  declare firstName: string

  @Column({
    type: DataType.STRING
  })
  declare lastName: string

  @Column({
    type: DataType.STRING
  })
  declare country: string

  @Column({
    type: DataType.STRING
  })
  declare role: string

  @Column({
    type: DataType.STRING
  })
  declare occupation: string

  @Column({
    type: DataType.INTEGER
  })
  declare age: number

  @Column({
    type: DataType.STRING
  })
  declare gender: string

  @Column({
    type: DataType.STRING,
    defaultValue: "affiliate"
  })
  declare phoneNumber: string

  @Column({
    type: DataType.STRING,
    defaultValue: "waiting list"
  })
  declare status: string

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  declare createdAt?: Date

  @UpdatedAt
  declare updatedAt?: Date

  @HasMany(() => Click)
  clicks: Click[]

  @HasMany(() => Feedback)
  feedbacks: Feedback[]

  @HasMany(() => Subscription)
  subscriptions: Subscription[]

  @BelongsToMany(() => Url, () => AffiliateUrl)
  urls: Url[]
}
export default User
