import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRol } from 'src/auth/interfaces/jwt-rol.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/guards/jwt-roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @HasRoles(JwtRol.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile(
      // TODO!: Pasar a un archivo de configuracion
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    ) file: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    return this.categoriesService.create(file, createCategoryDto);
  }

  @HasRoles(JwtRol.ADMIN, JwtRol.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @HasRoles(JwtRol.ADMIN, JwtRol.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @HasRoles(JwtRol.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @UploadedFile(
      // TODO!: Pasar a un archivo de configuracion
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    ) file: Express.Multer.File | undefined,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto, file);
  }

  @HasRoles(JwtRol.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
