import { User } from "src/users/user.entity";

export interface Payload {
  id: User['id'];
  name: User['name'];
  roles: string[]
}