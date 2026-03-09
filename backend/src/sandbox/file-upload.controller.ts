import { 
  Controller, Post, UseInterceptors, UploadedFile, 
  BadRequestException, Logger 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express'; // 👈 Explicitly imports the Express types
import * as fs from 'fs';
import * as path from 'path';
import { AiEngineService } from '../ai-engine/ai-engine.service';
import { DynamicSandboxService } from './dynamic-sandbox.service';

// Define secure isolated directories
const QUARANTINE_DIR = path.join(process.cwd(), 'sandbox_quarantine');
const SECURE_VAULT_DIR = path.join(process.cwd(), 'secure_storage');

// Create them if they don't exist
if (!fs.existsSync(QUARANTINE_DIR)) fs.mkdirSync(QUARANTINE_DIR, { recursive: true });
if (!fs.existsSync(SECURE_VAULT_DIR)) fs.mkdirSync(SECURE_VAULT_DIR, { recursive: true });

@Controller('sandbox')
export class FileUploadController {
  private readonly logger = new Logger(FileUploadController.name);

  constructor(
    private readonly aiEngine: AiEngineService,
    private readonly dynamicSandbox: DynamicSandboxService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: QUARANTINE_DIR,
      filename: (req, file, cb) => {
        // Sanitize filename to prevent path traversal attacks
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${safeName}`);
      },
    }),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  }))
  async processFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded.');
    const sanitizedFilename = file.filename.replace(/[\n\r]/g, '_');
    this.logger.log(`📦 File entered Quarantine: ${sanitizedFilename}`);
    
    try {
      // ==========================================
      // STAGE 1: STATIC DNA ANALYSIS (Python AI)
      // ==========================================
      this.logger.log(`🧬 Initiating Stage 1: Static DNA Analysis...`);
      const staticVerdict = await this.aiEngine.predictFile(file.path);

      if (staticVerdict.status === 'MALICIOUS' && staticVerdict.score > 0.85) {
        this.logger.error(`🚨 STAGE 1 CATCH: High-confidence malware (${staticVerdict.engine}).`);
        this.destroyFile(file.path);
        return { 
          success: false, 
          message: 'Blocked by Static AI.', 
          score: staticVerdict.score 
        };
      }

      // ==========================================
      // STAGE 2: DYNAMIC BEHAVIORAL SANDBOXING
      // ==========================================
      this.logger.warn(`🧪 Static passed. Initiating Stage 2: Dynamic Detonation...`);
      const dynamicVerdict = await this.dynamicSandbox.detonate(file.path, file.originalname);

      if (dynamicVerdict.isMalicious) {
        this.logger.error(`🚨 STAGE 2 CATCH: Behavioral threat detected!`);
        this.destroyFile(file.path);
        return { 
          success: false, 
          message: 'Blocked by Dynamic Sandbox.',
          behaviors: dynamicVerdict.behaviors 
        };
      }

      // ==========================================
      // STAGE 3: SECURE CLEARANCE
      // ==========================================
      this.logger.log(`✅ File cleared all checks. Moving to Secure Vault.`);
      const securePath = path.join(SECURE_VAULT_DIR, file.filename);
      fs.renameSync(file.path, securePath);

      return {
        success: true,
        message: 'File secured and cleared.',
        filename: file.filename
      };

    } catch (error) {
      this.logger.error(`❌ Scan pipeline failed: ${error.message}`);
      // Fail-secure: Destroy the file if the pipeline crashes
      this.destroyFile(file.path);
      throw new BadRequestException('Security pipeline failure. File destroyed.');
    }
  }

  private destroyFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      try { 
        fs.unlinkSync(filePath); 
        this.logger.log(`🗑️ File destroyed securely.`);
      } catch (err) { 
        this.logger.error(`Failed to delete file: ${filePath}`, err); 
      }
    }
  }
}