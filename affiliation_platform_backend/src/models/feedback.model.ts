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
import User from "./user.model"

@Table({
  tableName: "feedbacks",
  modelName: "Feedback",
  timestamps: true
})
class Feedback extends Model<Feedback> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare id: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare subject: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare object: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  declare userId: string

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  declare createdAt?: Date

  @UpdatedAt
  declare updatedAt?: Date

  @BelongsTo(() => User)
  user: User
}

export default Feedback
