import { Injectable } from '@nestjs/common';
import { SecurityAgentService } from './security-agent.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class SecurityDashboardService {
  constructor(
    private securityAgent: SecurityAgentService,
    private auditService: AuditService,
  ) {}

  async getSystemHealth() {
    // Cleanly fetch state using our new getter methods
    const blockedIps = this.securityAgent.getBlockedIps();
    const revokedUsers = this.securityAgent.getRevokedUsers();
    const storageFrozen = this.securityAgent.getStorageFrozen();

    const recentActivities = await this.auditService.getRecentLogs(20);
    const securityThreats = await this.auditService.getSecurityThreats(50);

    // Extract vulnerable files from malicious upload attempts
    const vulnerableFiles = securityThreats
      .filter(log => log.action === 'MALICIOUS_FILE_UPLOAD')
      .map(log => ({
        fileName: log.metadata?.fileName,
        malwareType: log.metadata?.malwareType,
        engine: log.metadata?.engine,
        detectedAt: log.createdAt,
        userId: log.userId,
        ip: log.metadata?.ip,
      }));

    return {
      status: storageFrozen ? 'CRITICAL' : 'OPERATIONAL',
      active_threats: blockedIps.length + revokedUsers.length,
      threat_count: securityThreats.length,
      mitigations: {
        blocked_ips: blockedIps,
        revoked_users: revokedUsers,
        storage_frozen: storageFrozen
      },
      recent_activities: recentActivities.map(log => ({
        id: log.id.toString(),
        userId: log.userId,
        action: log.action,
        severity: log.severity,
        createdAt: log.createdAt,
        metadata: log.metadata
      })),
      security_threats: securityThreats.map(log => ({
        id: log.id.toString(),
        userId: log.userId,
        action: log.action,
        severity: log.severity,
        attackType: log.metadata?.attackType || log.metadata?.malwareType || 'Unknown',
        createdAt: log.createdAt,
        metadata: log.metadata
      })),
      vulnerable_files: vulnerableFiles,
      last_updated: new Date().toISOString()
    };
  }
}
