import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  async create(file: Express.Multer.File, createCategoryDto: CreateCategoryDto) {
    const result = await this.uploadImage(file);
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      image_url: result.secure_url,
      imageId: result.public_id
    })

    return this.categoryRepository.save(category)
  }

  findAll() {
    return this.categoryRepository.find()
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id: ${id} nor found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, file?: Express.Multer.File) {
    const category = await this.findOne(id);
    let newImageUrl = category.image_url;
    let newImageId = category.imageId;

    if (file) {
      if (newImageId) {
        await this.cloudinaryService.deleteFile(newImageId);
      }

      const uploaded = await this.uploadImage(file);
      newImageUrl = uploaded.secure_url;
      newImageId = uploaded.public_id;
    }

    const categoryUpdate = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
      image_url: newImageUrl,
      imageId: newImageId
    });

    if (!categoryUpdate) {
      throw new NotFoundException(`Category with id: ${id} nor found`);
    }

    return this.categoryRepository.save(categoryUpdate);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (category.imageId) {
      await this.cloudinaryService.deleteFile(category.imageId);
    }
    return this.categoryRepository.remove(category);
  }

  private async uploadImage(file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(file, 'categories')
    if (result.secure_url === undefined || result.secure_url === null) {
      throw new InternalServerErrorException('La imagen no se pudo guardar')
    }
    return result;
  }
}
