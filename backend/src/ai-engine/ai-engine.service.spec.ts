import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AiEngineService } from './ai-engine.service';
import * as tf from '@tensorflow/tfjs';
import * as child_process from 'child_process';
import * as fs from 'fs';

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
}));

// 1. Mock TensorFlow.js for the Network Model
jest.mock('@tensorflow/tfjs', () => ({
  loadLayersModel: jest.fn<any>().mockResolvedValue({
    predict: jest.fn<any>().mockReturnValue({
      data: jest.fn<any>().mockResolvedValue([0.85]), // Simulate an 85% anomaly score
      dispose: jest.fn(),
    }),
  }),
  tensor2d: jest.fn<any>().mockReturnValue({
    dispose: jest.fn(),
  }),
}));

// 2. Mock Child Process for the Python Bridge
jest.mock('child_process', () => ({
  spawn: jest.fn<any>().mockReturnValue({
    stdout: {
      on: jest.fn().mockImplementation((event, cb: any) => {
        if (event === 'data') cb(Buffer.from(JSON.stringify({ status: 'MALICIOUS', score: 0.99, engine: 'Ensemble (Hybrid+SoReL)' })));
      })
    },
    stderr: { on: jest.fn() },
    on: jest.fn().mockImplementation((event, cb: any) => {
      if (event === 'close') cb(0);
    }),
  }),
}));

describe('AiEngineService', () => {
  let service: AiEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiEngineService],
    }).compile();

    service = module.get<AiEngineService>(AiEngineService);

    // Manually trigger the onModuleInit to load the mocked TFJS model
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('predictNetwork', () => {
    it('should detect network anomalies using the TFJS model', async () => {
      const mockLogData = {
        metadata: { flowDuration: 1000, totalFwdPackets: 50, idleMin: 0 }
      };

      const result = await service.predictNetwork(mockLogData);

      expect(result.isAnomaly).toBe(true);
      expect(result.confidence).toBe(0.85); // Matches our TFJS mock
    });
  });

  describe('predictFile', () => {
    it('should call the Python scanner and parse the JSON result', async () => {
      const mockFilePath = 'C:/sandbox/test-virus.exe';

      const result = await service.predictFile(mockFilePath);

      expect(result.status).toBe('MALICIOUS');
      expect(result.score).toBe(0.99);
      expect(result.engine).toBe('Ensemble (Hybrid+SoReL)');
    });
  });
});
