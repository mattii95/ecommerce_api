import { User } from "src/users/user.entity";
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";


@Entity({ name: 'roles' })
export class Rol {

  @PrimaryColumn()
  id: string;

  @Column('varchar', {
    length: 100,
    unique: true
  })
  name: string;

  @Column('varchar', {
    length: 255
  })
  image_url: string;

  @Column('varchar', {
    length: 255
  })
  route: string;

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP'
  })
  updated_at: Date

  // Relations
  @ManyToMany(
    () => User,
    (user) => user.roles
  )
  users: User[]
}