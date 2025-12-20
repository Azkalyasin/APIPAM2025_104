import type { Request } from 'express';
import type { Express } from 'express';

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
