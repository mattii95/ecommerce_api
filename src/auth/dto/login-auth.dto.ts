import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class LoginAuthDto {

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

}