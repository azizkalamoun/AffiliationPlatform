import { Column, CreatedAt, DataType, HasMany, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript"

@Table({
  tableName: "earnings",
  modelName: "Earning",
  timestamps: true
})
class Earning extends Model<Earning> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare type: "subscription" | "click"

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  declare amount: number

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  declare createdAt?: Date

  @UpdatedAt
  declare updatedAt?: Date


}
export default Earning
