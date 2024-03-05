import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Employee extends Model<Employee> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  names: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  surnames: string;

  @Column({
    type: DataType.ENUM,
    values: ['CEDULA', 'NIT', 'T-IDENTIDAD', 'T-EXTRANJERA', 'DNIT', 'N/A'],
    allowNull: false,
  })
  typeDocument: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  document: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  age: string;
}
