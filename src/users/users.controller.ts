import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRolesGuard } from 'src/auth/guards/jwt-roles.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRol } from 'src/auth/interfaces/jwt-rol.interface';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) { }

  @HasRoles(JwtRol.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @HasRoles(JwtRol.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @HasRoles(JwtRol.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @HasRoles(JwtRol.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async updateWithImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    ) file: Express.Multer.File
  ) {
    return this.usersService.updateWithImage(id, updateUserDto, file);
  }

}
