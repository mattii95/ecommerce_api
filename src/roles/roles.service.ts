import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol.dto';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Rol)
    private readonly rolesRepository: Repository<Rol>
  ) { }

  create(createRolDto: CreateRolDto) {
    const newRol = this.rolesRepository.create(createRolDto);
    return this.rolesRepository.save(newRol);
  }

}
