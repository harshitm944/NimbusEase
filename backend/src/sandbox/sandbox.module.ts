import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { DynamicSandboxService } from './dynamic-sandbox.service';
import { AiEngineService } from '../ai-engine/ai-engine.service';
import { StorageService } from '../storage/storage.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [FileUploadController],
  providers: [DynamicSandboxService, AiEngineService, StorageService, BlockchainService, AuthService],
  exports: [DynamicSandboxService]
})
export class SandboxModule { }