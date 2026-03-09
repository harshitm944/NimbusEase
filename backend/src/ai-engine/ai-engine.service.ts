import { Injectable, OnModuleInit, Logger, InternalServerErrorException } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import * as path from 'path';
import * as fs from 'fs';
import { OnEvent } from '@nestjs/event-emitter';
import { spawn } from 'child_process';

@Injectable()
export class AiEngineService implements OnModuleInit {
  private networkModel!: tf.LayersModel;
  private readonly logger = new Logger(AiEngineService.name);

  // 📂 Paths
  private readonly netModelDir = path.join(process.cwd(), 'models/security-model-tfjs');
  private readonly pythonScannerPath = path.resolve(process.cwd(), '..', 'ai', 'scanner.py');
  private readonly pythonCommand = 'py -3.11';

  async onModuleInit() {
    await this.initNetworkModel();
  }

  private async initNetworkModel() {
    try {
      if (fs.existsSync(path.join(this.netModelDir, 'model.json'))) {
        this.networkModel = await tf.loadLayersModel(`file://${path.join(this.netModelDir, 'model.json')}`);
        this.logger.log('✅ Network Security Engine (57 Features) Online.');
      }
    } catch (e: any) {
      this.logger.error(`❌ Network Model Load Error: ${e.message}`);
    }
  }

  /**
   * 🌐 NETWORK PREDICTION (Existing 57 Features)
   * Kept in NestJS/TFJS for real-time speed on network logs.
   */
  async predictNetwork(logData: any) {
    if (!this.networkModel) return { isAnomaly: false, confidence: 0 };
    const features = this.extractNetworkFeatures(logData);
    const input = tf.tensor2d([features]);
    const prediction = this.networkModel.predict(input) as tf.Tensor;
    const score = (await prediction.data())[0];
    input.dispose();
    return { isAnomaly: score > 0.5, confidence: score };
  }

  /**
   * 🛡️ FILE PREDICTION (Master AI Ensemble)
   * Calls Python to use SoReL (.pt), Dike (.h5), and PDF (.h5).
   */
  async predictFile(filePath: string): Promise<any> {
    this.logger.log(`🔍 AI Master Engine: Starting deep scan for ${filePath}`);

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(this.pythonCommand.split(' ')[0], [
        this.pythonCommand.split(' ')[1],
        this.pythonScannerPath,
        filePath
      ]);

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        const msg = data.toString();
        if (!msg.includes('tensorflow')) {
          stderr += msg;
        }
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          this.logger.error(`❌ AI Master Engine Failure (Code ${code}): ${stderr}`);
          return reject(new InternalServerErrorException('Deep scan failed'));
        }

        try {
          resolve(JSON.parse(stdout.trim()));
        } catch (e) {
          this.logger.error(`❌ AI Engine Output Parse Error: ${e.message}`);
          reject(new InternalServerErrorException('Failed to parse AI engine output'));
        }
      });

      pythonProcess.on('error', (err) => {
        this.logger.error(`❌ AI Process Spawn Error: ${err.message}`);
        reject(new InternalServerErrorException('Failed to start AI engine'));
      });
    });
  }

  /**
    * 🟢 YOUR 57 FEATURES (DO NOT DELETE)
    * Optimized feature set for CIC-IDS-2017/2018 Network Anomaly Detection
    */
  private extractNetworkFeatures(d: any): number[] {
    const sanitizeNum = (val: any) => {
      const num = parseFloat(val);
      return (isNaN(num) || !isFinite(num)) ? 0 : num;
    };

    return [
      sanitizeNum(d.metadata?.flowDuration),              // 1
      sanitizeNum(d.metadata?.totalFwdPackets),           // 2
      sanitizeNum(d.metadata?.totalBackwardPackets),      // 3
      sanitizeNum(d.metadata?.totalLengthOfFwdPackets),   // 4
      sanitizeNum(d.metadata?.totalLengthOfBwdPackets),   // 5
      sanitizeNum(d.metadata?.fwdPacketLengthMax),        // 6
      sanitizeNum(d.metadata?.fwdPacketLengthMin),        // 7
      sanitizeNum(d.metadata?.fwdPacketLengthMean),       // 8
      sanitizeNum(d.metadata?.fwdPacketLengthStd),        // 9
      sanitizeNum(d.metadata?.bwdPacketLengthMax),        // 10

      sanitizeNum(d.metadata?.bwdPacketLengthMin),        // 11
      sanitizeNum(d.metadata?.bwdPacketLengthMean),       // 12
      sanitizeNum(d.metadata?.bwdPacketLengthStd),        // 13
      sanitizeNum(d.metadata?.flowBytesPerSec),           // 14
      sanitizeNum(d.metadata?.flowPacketsPerSec),         // 15
      sanitizeNum(d.metadata?.flowIatMean),               // 16
      sanitizeNum(d.metadata?.flowIatStd),                // 17
      sanitizeNum(d.metadata?.flowIatMax),                // 18
      sanitizeNum(d.metadata?.flowIatMin),                // 19
      sanitizeNum(d.metadata?.fwdIatTotal),               // 20

      sanitizeNum(d.metadata?.fwdIatMean),                // 21
      sanitizeNum(d.metadata?.fwdIatStd),                 // 22
      sanitizeNum(d.metadata?.fwdIatMax),                 // 23
      sanitizeNum(d.metadata?.fwdIatMin),                 // 24
      sanitizeNum(d.metadata?.bwdIatTotal),               // 25
      sanitizeNum(d.metadata?.bwdIatMean),                // 26
      sanitizeNum(d.metadata?.bwdIatStd),                 // 27
      sanitizeNum(d.metadata?.bwdIatMax),                 // 28
      sanitizeNum(d.metadata?.bwdIatMin),                 // 29
      sanitizeNum(d.metadata?.fwdPshFlags),               // 30

      sanitizeNum(d.metadata?.fwdHeaderLength),           // 31
      sanitizeNum(d.metadata?.bwdHeaderLength),           // 32
      sanitizeNum(d.metadata?.fwdPacketsPerSec),          // 33
      sanitizeNum(d.metadata?.bwdPacketsPerSec),          // 34
      sanitizeNum(d.metadata?.minPacketLength),           // 35
      sanitizeNum(d.metadata?.maxPacketLength),           // 36
      sanitizeNum(d.metadata?.packetLengthMean),          // 37
      sanitizeNum(d.metadata?.packetLengthStd),           // 38
      sanitizeNum(d.metadata?.packetLengthVariance),      // 39
      sanitizeNum(d.metadata?.finFlagCount),              // 40

      sanitizeNum(d.metadata?.synFlagCount),              // 41
      sanitizeNum(d.metadata?.rstFlagCount),              // 42
      sanitizeNum(d.metadata?.pshFlagCount),              // 43
      sanitizeNum(d.metadata?.ackFlagCount),              // 44
      sanitizeNum(d.metadata?.urgFlagCount),              // 45
      sanitizeNum(d.metadata?.downUpRatio),               // 46
      sanitizeNum(d.metadata?.averagePacketSize),         // 47
      sanitizeNum(d.metadata?.avgFwdSegmentSize),         // 48
      sanitizeNum(d.metadata?.avgBwdSegmentSize),         // 49
      sanitizeNum(d.metadata?.subflowFwdPackets),         // 50

      sanitizeNum(d.metadata?.subflowFwdBytes),           // 51
      sanitizeNum(d.metadata?.initWinBytesForward),       // 52
      sanitizeNum(d.metadata?.initWinBytesBackward),      // 53
      sanitizeNum(d.metadata?.actDataPktFwd),             // 54
      sanitizeNum(d.metadata?.minSegSizeForward),         // 55
      sanitizeNum(d.metadata?.activeMean),                // 56
      sanitizeNum(d.metadata?.idleMin)                    // 57
    ];
  }

  @OnEvent('audit.log.created')
  async handleAuditLog(log: any) {
    const prediction = await this.predictNetwork(log);
    if (prediction.isAnomaly) {
      this.logger.warn(`🚨 Network Anomaly: ${(prediction.confidence * 100).toFixed(2)}%`);
    }
  }
}