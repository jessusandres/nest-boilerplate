/* External */
import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

/* Project */
import { ICountry } from './interfaces';

@Table({
  tableName: 'countries',
  underscored: true,
  timestamps: false,
})
export class CountryEntity extends Model implements ICountry {
  @PrimaryKey
  @AutoIncrement
  @Column({ field: 'id' })
  declare id: number;

  @PrimaryKey
  @Column({ field: 'name' })
  declare name: string;
}
