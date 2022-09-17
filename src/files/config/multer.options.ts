import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

export const multerOptions: MulterOptions = {
  fileFilter: (req, { mimetype, size, fieldname }, callback) => {
    const _bookMimeTypes: string[] = [
      'application/pdf',
      'application/msword',
      'application/epub+zip',
      'application/fb2',
      'text/plain',
    ];
    const _posterMimeTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];
    if (fieldname === 'book' && !_bookMimeTypes.includes(mimetype)) {
      callback(new BadRequestException(`Only the following file types are accepted for book: ${_bookMimeTypes}`), null);
    }
    if (fieldname === 'poster' && !_posterMimeTypes.includes(mimetype)) {
      callback(
        new BadRequestException(`Only the following file types are accepted for poster: ${_posterMimeTypes}`),
        null,
      );
    }
    if (size > 5e6) {
      callback(
        new BadRequestException(`The maximum file size has been exceeded. Please select a file smaller than 5MB`),
        null,
      );
    }
    callback(null, true);
  },
};
