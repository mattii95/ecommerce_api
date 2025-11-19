import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find({ relations: ['roles'] });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({id, ...updateUserDto})

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    return this.userRepository.save(user);
  }

  async updateWithImage(id: number, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(file, 'users');
    if (result.secure_url === undefined || result.secure_url === null) {
      throw new InternalServerErrorException('La imagen no se pudo guardar')
    }

    return this.update(id, { image_url: result.secure_url, ...updateUserDto });
  }

  private async findUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    return user;
  }
}
