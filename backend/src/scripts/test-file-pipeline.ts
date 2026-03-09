
import { AiEngineService } from '../ai-engine/ai-engine.service';
import { DynamicSandboxService } from '../sandbox/dynamic-sandbox.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlockchainRecord } from '../blockchain/blockchain-record.entity';
import * as fs from 'fs';
import * as path from 'path';

async function testFilePipeline() {
  const logger = new Logger('FilePipeline-Test');
  
  // Create a mock repository for BlockchainRecord
  const mockBlockchainRepository = {
    create: (data: any) => data,
    save: async (data: any) => {
      logger.log(`💾 [MOCK DB] Saved record: ${JSON.stringify(data)}`);
      return data;
    },
    findOne: async (options: any) => {
      logger.log(`🔍 [MOCK DB] Finding record for: ${JSON.stringify(options)}`);
      return { 
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        txHash: options.where.txHash 
      };
    },
    count: async () => 0,
    find: async () => [],
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AiEngineService,
      DynamicSandboxService,
      BlockchainService,
      {
        provide: getRepositoryToken(BlockchainRecord),
        useValue: mockBlockchainRepository,
      },
    ],
  }).compile();

  const aiEngine = module.get<AiEngineService>(AiEngineService);
  const sandbox = module.get<DynamicSandboxService>(DynamicSandboxService);
  const blockchain = module.get<BlockchainService>(BlockchainService);

  // Fix AI scanner path for this test
  (aiEngine as any).pythonScannerPath = path.resolve(process.cwd(), '..', 'ai', 'scanner.py');
  (aiEngine as any).pythonCommand = 'python -u'; // Use -u for unbuffered output to avoid splitting issues

  // Set to mock mode
  (blockchain as any).USE_MOCK_CHAIN = true;

  // 1. Create a dummy test file
  const testFilePath = path.join(process.cwd(), 'test-file.txt');
  fs.writeFileSync(testFilePath, 'This is a test file for the AI security pipeline.');
  logger.log(`📝 Created test file: ${testFilePath}`);

  try {
    // 2. Test AI Scan
    logger.log('🧬 [STEP 1] Running Static DNA Analysis (Python AI)...');
    try {
      const staticVerdict = await aiEngine.predictFile(testFilePath);
      logger.log(`✅ Static Verdict: ${JSON.stringify(staticVerdict)}`);
    } catch (e: any) {
      logger.warn(`⚠️ Static scan skipped or failed: ${e.message} (Is Python AI master_scanner.py ready?)`);
    }

    // 3. Test Sandbox (Note: This will likely fail or timeout without a real VT_API_KEY)
    logger.log('🧪 [STEP 2] Running Dynamic Behavioral Sandboxing (VirusTotal)...');
    const dynamicVerdict = await sandbox.detonate(testFilePath, 'test-file.txt');
    logger.log(`✅ Dynamic Verdict: ${JSON.stringify(dynamicVerdict)}`);

    // 4. Test Blockchain Registration
    logger.log('⛓️ [STEP 3] Registering File Hash on Blockchain (Mock Mode)...');
    const txHash = await blockchain.registerFileHash({
      fileId: 'test-file-id-123',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // SHA256 of empty/dummy
      ownerId: 'test-user-001',
      timestamp: Date.now(),
      storageUri: 'test-user-001/test-file.txt',
    });
    logger.log(`✅ Blockchain Transaction Hash: ${txHash}`);

    // 5. Verify Hash
    logger.log('🔍 [STEP 4] Verifying File Hash against Ledger...');
    const isValid = await blockchain.verifyFileHash(txHash, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    logger.log(`✅ Integrity Verification Result: ${isValid ? 'VALID' : 'INVALID'}`);

  } catch (err: any) {
    logger.error(`❌ Pipeline test failed: ${err.message}`);
  } finally {
    if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
  }
}

testFilePipeline().catch(console.error);
