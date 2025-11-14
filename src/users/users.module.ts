import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CloudinaryModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule]
})
export class UsersModule { }
