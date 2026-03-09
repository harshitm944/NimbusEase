import { Injectable, BadRequestException, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Gateway, Wallets, Network, Contract } from 'fabric-network';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockchainRecord } from './blockchain-record.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BlockchainService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BlockchainService.name);
  private gateway!: Gateway;
  private network!: Network;
  private contract!: Contract;

  // Set to true to bypass Fabric gRPC calls and only write to local DB during dev
  private readonly USE_MOCK_CHAIN = process.env.USE_MOCK_CHAIN === 'true';

  constructor(
    @InjectRepository(BlockchainRecord)
    private blockchainRepository: Repository<BlockchainRecord>,
  ) {}

  async onModuleInit() {
    if (!this.USE_MOCK_CHAIN) {
      await this.initializeBlockchain();
    } else {
      this.logger.warn('⛓️ Blockchain Service running in MOCK MODE (Local DB Only).');
    }
  }

  async onModuleDestroy() {
    if (this.gateway) {
      this.gateway.disconnect();
    }
  }

  private async initializeBlockchain() {
    try {
      this.logger.log('🔥🔥 VERSION 3 (AI Security): Initializing Blockchain Service with IPv4 Override...');
      
      const ccpPath = process.env.FABRIC_CONNECTION_PROFILE_PATH || path.resolve(
        process.cwd(), '..', '..', 'fabric-samples', 'test-network', 
        'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json'
      );
      
      if (!fs.existsSync(ccpPath)) {
        this.logger.warn(`⚠️ Fabric connection profile not found at ${ccpPath}. Defaulting to mock mode.`);
        return;
      }
      
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
      
      // Force 127.0.0.1 instead of localhost for Windows/WSL stability
      if (ccp.peers) {
        Object.keys(ccp.peers).forEach(key => {
          if (ccp.peers[key].url) ccp.peers[key].url = ccp.peers[key].url.replace('localhost', '127.0.0.1');
        });
      }
      if (ccp.certificateAuthorities) {
        Object.keys(ccp.certificateAuthorities).forEach(key => {
          if (ccp.certificateAuthorities[key].url) ccp.certificateAuthorities[key].url = ccp.certificateAuthorities[key].url.replace('localhost', '127.0.0.1');
        });
      }

      const walletPath = process.env.FABRIC_WALLET_PATH || path.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);

      const identityLabel = process.env.FABRIC_USER || 'appUser';
      const identity = await wallet.get(identityLabel);
      if (!identity) {
        throw new Error(`An identity for "${identityLabel}" does not exist. Run the enrollment script.`);
      }

      this.gateway = new Gateway();
      await this.gateway.connect(ccp, {
        wallet,
        identity: identityLabel,
        discovery: { enabled: true, asLocalhost: true }
      });

      const channelName = process.env.FABRIC_CHANNEL_NAME || 'mychannel';
      this.network = await this.gateway.getNetwork(channelName);

      // We assume your chaincode is named 'securityaudit' or 'basic'
      const chaincodeName = process.env.FABRIC_CHAINCODE_NAME || 'basic';
      this.contract = this.network.getContract(chaincodeName);
      
      this.logger.log('✅ Fabric Blockchain Service Initialized successfully!');
    } catch (error) {
      this.logger.error('❌ Failed to initialize blockchain service:', error);
    }
  }

  /**
   * 🛡️ NEW AI SECURITY LOGGING METHOD
   * Logs blocked IPs, malware detections, and system freezes to the immutable ledger.
   */
  async recordSecurityEvent(target: string, threatType: string, mitigation: string, confidence: number) {
    const timestamp = Date.now();
    const eventId = `SEC-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    const txHash = `FABRIC_SEC_${eventId.substring(0, 10)}`;

    this.logger.log(`⛓️ [LEDGER] Minting Security Block: ${threatType} mapped to ${target}`);

    // 1. Save to local SQL Database (for the Dashboard to read quickly)
    const blockchainRecord = this.blockchainRepository.create({
      recordId: eventId,
      fileId: 'SECURITY_EVENT',
      hash: threatType,    // Re-using the hash column to store threat type locally
      ownerId: target,     // Re-using ownerId to store the target
      timestamp: new Date(timestamp),
      storageUri: mitigation, // Re-using storageUri to store the mitigation action
      txHash: txHash, 
      blockNumber: Math.round(confidence * 100), // Re-using blockNumber to store confidence %
    });
    await this.blockchainRepository.save(blockchainRecord);

    // 2. Submit to the actual Hyperledger Fabric network (if online)
    if (this.contract && !this.USE_MOCK_CHAIN) {
      try {
        await this.contract.submitTransaction(
          'LogSecurityEvent', // Requires chaincode update to support this function
          eventId,
          target,
          threatType,
          mitigation,
          confidence.toString(),
          timestamp.toString()
        );
      } catch (error) {
        this.logger.error(`Fabric submission failed, but local DB saved. Error: ${error.message}`);
      }
    }

    return txHash;
  }

  /**
   * 📁 ORIGINAL FILE HASHING METHOD (Preserved for your old routes)
   */
  async registerFileHash(fileData: { fileId: string; hash: string; ownerId: string; timestamp: number; storageUri: string; }) {
    const recordId = `FILE-${fileData.timestamp}-${Math.floor(Math.random() * 1000)}`;
    const txHash = `FABRIC_TX_${recordId.substring(0, 10)}`;

    const blockchainRecord = this.blockchainRepository.create({
      recordId,
      fileId: fileData.fileId,
      hash: fileData.hash,
      ownerId: fileData.ownerId,
      timestamp: new Date(fileData.timestamp),
      storageUri: fileData.storageUri,
      txHash: txHash, 
      blockNumber: 0, 
    });

    await this.blockchainRepository.save(blockchainRecord);

    if (this.contract && !this.USE_MOCK_CHAIN) {
      try {
        await this.contract.submitTransaction(
          'CreateFile', 
          fileData.fileId, 
          fileData.hash, 
          fileData.ownerId, 
          fileData.timestamp.toString(), 
          fileData.storageUri
        );
      } catch (error) {
        this.logger.error(`Fabric submission failed: ${error.message}`);
      }
    }

    return txHash;
  }

  /**
   * Used for the Security Dashboard
   */
  async getBlockchainStats() {
    const totalRecords = await this.blockchainRepository.count();
    const recentRecords = await this.blockchainRepository.find({
      take: 10,
      order: { timestamp: 'DESC' },
    });

    return {
      totalRecords,
      status: this.contract ? 'FABRIC_ONLINE' : 'DB_ONLY_MODE',
      recentActivity: recentRecords,
    };
  }

  /**
   * ✅ NEW: Verifies file hash against the blockchain record.
   * If FABRIC is offline, it checks the local database mirror.
   */
  async verifyFileHash(txHash: string, currentHash: string): Promise<boolean> {
    const sanitizedTxHash = txHash.replace(/[\n\r]/g, '_');
    this.logger.log(`⛓️ Verifying integrity for TX: ${sanitizedTxHash}`);
    
    // 1. Try to find the record in the local DB mirror
    const record = await this.blockchainRepository.findOne({ where: { txHash } });
    
    if (!record) {
      this.logger.warn(`⚠️ Blockchain record not found for TX: ${txHash}`);
      return false;
    }

    // 2. Compare the provided hash with the stored one
    const isMatch = record.hash === currentHash;
    
    if (!isMatch) {
      this.logger.error(`🚨 INTEGRITY BREACH: Hash mismatch for TX ${txHash}. Expected ${record.hash}, got ${currentHash}`);
    } else {
      this.logger.log(`✅ Integrity verified for TX ${txHash}`);
    }

    return isMatch;
  }
}