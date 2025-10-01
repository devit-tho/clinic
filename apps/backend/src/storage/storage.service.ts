import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  async uploadPhoto(photo: Express.Multer.File) {
    console.log('Photo', photo);
  }
}
