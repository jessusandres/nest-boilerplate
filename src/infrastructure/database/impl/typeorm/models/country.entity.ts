import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'countries',
})
export class CountryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
