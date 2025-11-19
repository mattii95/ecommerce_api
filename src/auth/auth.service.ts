import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { Rol } from 'src/roles/entities/rol.entity';
import { JwtRol } from './interfaces/jwt-rol.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private jwtService: JwtService
  ) { }

  async register(registerAuthDto: RegisterAuthDto) {
    const emailExist = await this.userRepository.findOne({ where: { email: registerAuthDto.email } });
    if (emailExist) {
      throw new ConflictException('El email ya se encuentra registrado');
    }

    const phoneExist = await this.userRepository.findOne({ where: { phone: registerAuthDto.phone } });
    if (phoneExist) {
      throw new ConflictException('El telefono ya se encuentra registrado');
    }

    const newUser = this.userRepository.create(registerAuthDto);

    const clientRol = await this.rolRepository.findOne({ where: { id: JwtRol.CLIENT } })
    if (!clientRol) {
      throw new BadRequestException('El rol no existe');
    }

    newUser.roles = [clientRol];

    const userSaved = await this.userRepository.save(newUser);

    const { password: _, ...restUser } = userSaved;
    const rolesIds = userSaved.roles.map(rol => rol.id);
    const payload = { id: restUser.id, name: restUser.name, roles: rolesIds };
    const token = this.jwtService.sign(payload);

    return {
      user: restUser,
      token
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles']
    });

    if (!user) {
      throw new ForbiddenException('Credenciales invalidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Credenciales invalidas');
    }

    const { password: _, ...restUser } = user;
    const rolesIds = restUser.roles.map(rol => rol.id);
    const payload = { id: restUser.id, name: restUser.name, roles: rolesIds };
    const token = this.jwtService.sign(payload);

    return {
      user: restUser,
      token
    };
  }

}
