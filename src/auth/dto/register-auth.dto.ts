import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Rol } from "src/roles/entities/rol.entity";

export class RegisterAuthDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener minimo 6 caracteres' })
  password: string;

  // @IsArray()
  // @ArrayMinSize(1)
  // @IsString({ each: true })
  // rolesIds: string[]
}