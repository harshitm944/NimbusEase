import { Module } from '@nestjs/common';
import { AiEngineService } from './ai-engine.service';
import { SecurityAgentService } from './security-agent.service';
import { DataSimulatorService } from './data-simulator.service';
import { SecurityDashboardService } from './security-dashboard.service';
import { SecurityController } from './security.controller';
import { RedisMockService } from './redis-mock.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBehaviorProfile } from './entities/user-behavior-profile.entity';
import { AnomalyDetection } from './entities/anomaly-detection.entity';
import { AuditModule } from '../audit/audit.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserBehaviorProfile, AnomalyDetection,]),
    AuditModule,
  ],
  controllers: [SecurityController],
  providers: [
    AiEngineService, 
    SecurityAgentService, 
    DataSimulatorService, 
    SecurityDashboardService, 
    RedisMockService,
  ],
  exports: [AiEngineService, SecurityAgentService, DataSimulatorService, SecurityDashboardService, RedisMockService],
})
export class AiEngineModule {}