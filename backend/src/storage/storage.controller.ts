import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Request,
  Query,
  Res,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { StorageService } from './storage.service';
import { Response } from 'express';
import { UserRole } from '../users/user.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('storage')
@UseGuards(AuthGuard('jwt'))
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './temp_uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: any, @Request() req: any) {
    if (req.user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admins are restricted to view-only mode and cannot upload files.');
    }
    
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.storageService.uploadFile(
      null, // Buffer is null because we are using diskStorage
      file.originalname,
      file.mimetype,
      req.user.userId,
      undefined,
      file.path, // Pass the path to StorageService
    );
  }

  @Get('list')
  async listFiles(@Request() req: any, @Query('page') page: number, @Query('limit') limit: number) {
    return this.storageService.listFiles(req.user.userId, req.user.role, page, limit);
  }

  @Get('download/:id')
  async downloadFile(
    @Param('id') id: string,
    @Request() req: any,
    @Query('key') key: string,
    @Res() res: Response,
  ) {
    if (req.user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admins are restricted to view-only mode and cannot download files.');
    }
    if (!key) {
      throw new BadRequestException('Decryption key is required');
    }
    const result = await this.storageService.downloadFile(id, req.user.userId, req.user.role, key);
    
    res.set({
      'Content-Type': result.mimeType,
      'Content-Disposition': `attachment; filename="${result.fileName}"`,
    });
    
    res.send(result.buffer);
  }

  @Delete('delete/:id')
  async deleteFile(@Param('id') id: string, @Request() req: any) {
    if (req.user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admins are restricted to view-only mode and cannot delete files.');
    }
    return this.storageService.deleteFile(id, req.user.userId, req.user.role);
  }

  @Get('verify/:id')
  async verifyFile(@Param('id') id: string, @Request() req: any) {
    return this.storageService.verifyFileIntegrity(id, req.user.userId, req.user.role);
  }
}
