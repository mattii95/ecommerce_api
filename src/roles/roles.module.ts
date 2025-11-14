import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  providers: [RolesService, JwtStrategy],
  controllers: [RolesController],
  exports: [TypeOrmModule]
})
export class RolesModule { }
