import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToMany, JoinTable } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Rol } from "src/roles/entities/rol.entity";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 100
  })
  name: string

  @Column('varchar', {
    length: 100
  })
  lastname: string

  @Column('varchar', {
    unique: true,
    length: 100
  })
  email: string

  @Column('varchar', {
    unique: true,
    length: 100
  })
  phone: string

  @Column('text', {
    nullable: true
  })
  image_url: string

  @Column('varchar', {
    length: 255
  })
  password: string

  @Column('varchar', {
    nullable: true,
    length: 255
  })
  notification_token: string

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP'
  })
  updated_at: Date

  @JoinTable({
    name: 'user_has_roles',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'rolId' }
  })
  @ManyToMany(
    () => Rol,
    (rol) => rol.users
  )
  roles: Rol[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, Number(process.env.HASH_SALT))
  }

}