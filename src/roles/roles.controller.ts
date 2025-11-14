import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRol } from 'src/auth/interfaces/jwt-rol.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/guards/jwt-roles.guard';

@HasRoles(JwtRol.ADMIN)
@UseGuards(JwtAuthGuard, JwtRolesGuard)
@Controller('roles')
export class RolesController {

  constructor(
    private readonly rolesService: RolesService
  ) { }

  @Post()
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolesService.create(createRolDto);
  }

}
