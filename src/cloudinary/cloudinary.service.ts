import { Inject, Injectable } from '@nestjs/common';
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
}
