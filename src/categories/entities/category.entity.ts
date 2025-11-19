import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'categories'})
export class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 150,
    unique: true
  })
  name: string;

  @Column('text')
  description: string;

  @Column('varchar', {
    length: 255
  })
  image_url: string;

  @Column('varchar', {
    length: 150
  })
  imageId: string;

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date;

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;

}
