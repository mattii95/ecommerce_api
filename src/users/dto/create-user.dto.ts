
export class CreateUserDto {

  name: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  image_url?: string;
  notification_token?: string;
  
}