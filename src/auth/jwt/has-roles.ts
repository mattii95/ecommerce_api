import { SetMetadata } from "@nestjs/common";
import { JwtRol } from "../interfaces/jwt-rol.interface";


export const HasRoles = (...roles: JwtRol[]) => SetMetadata('roles', roles);