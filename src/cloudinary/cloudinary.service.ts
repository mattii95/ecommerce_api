import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {

  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinaryClient: typeof cloudinary
  ) { }

  async uploadFile(file: Express.Multer.File, folder: string) {
    return new Promise<UploadApiResponse>((res, rej) => {
      const uploadStream = this.cloudinaryClient.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return rej(error);
          res(result as UploadApiResponse);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream)
    })
  }

  async deleteFile(imageId: string) {
    try {
      const result = await this.cloudinaryClient.uploader.destroy(imageId);
      return result;
    } catch (error) {
      console.log('Error deleting image', error);
      throw new InternalServerErrorException('Cloudinary deletion failed')
    }
  }

  private extractPublicId(imageUrl: string): string {
    const parts = imageUrl.split('/');
    const fileName = parts.pop();
    const folder = parts.splice(parts.indexOf('upload') + 1).join('/');
    const publicId = (folder ? `${folder}/` : '') + fileName?.split('.')[0]
    return publicId;
  }
}
