import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SecurityAgentService {
  private readonly logger = new Logger(SecurityAgentService.name);

  private readonly PROTECTED_TARGETS = [
    'admin@example.com', '127.0.0.1', '::1', 'localhost', 'SYSTEM', 'STORAGE_BUCKET'
  ];

  async analyzeThreat(logData: any): Promise<any> {
    return this.fallbackHeuristic(logData);
  }

  async analyzeBehaviorSequence(userId: string, history: any[]): Promise<any> {
    if (history.length < 3) {
      return { is_attack: false, attack_type: 'None', mitigation_action: 'NONE' };
    }
    return this.fallbackBehaviorHeuristic(history);
  }

  private fallbackBehaviorHeuristic(history: any[]): any {
    const recentErrors = history.slice(0, 10).filter(log => log.statusCode === 401 || log.statusCode === 403).length;
    
    if (recentErrors > 7) {
      return { is_attack: true, attack_type: 'Brute Force / Enumeration', mitigation_action: 'BLOCK_IP', confidence: 0.8 };
    }
    
    const resources = new Set(history.slice(0, 10).map(log => log.resource));
    if (resources.size > 8) {
        return { is_attack: true, attack_type: 'Crawler / Scanner', mitigation_action: 'BLOCK_IP', confidence: 0.7 };
    }

    return { is_attack: false, attack_type: 'None', mitigation_action: 'NONE', confidence: 0 };
  }

  private fallbackHeuristic(logData: any): any {
    const details = (logData.details || '').toLowerCase();
    const resource = (logData.resource || '').toLowerCase();

    if (details.includes('failed login') && logData.statusCode === 401) {
       return { is_attack: true, attack_type: 'Brute Force', mitigation_action: 'BLOCK_IP', target: logData.ip, confidence: 0.9 };
    }
    if (resource.includes('..') || details.includes('..')) {
       return { is_attack: true, attack_type: 'Path Traversal', mitigation_action: 'REVOKE_USER', target: logData.user, confidence: 0.95 };
    }
    if (details.includes('.encrypted') || details.includes('.locked')) {
       return { is_attack: true, attack_type: 'Ransomware', mitigation_action: 'FREEZE_STORAGE', target: 'STORAGE_BUCKET', confidence: 0.99 };
    }
    return { is_attack: false, attack_type: 'None', mitigation_action: 'NONE', confidence: 0 };
  }

  // In-memory state for mitigation
  private blockedIps = new Set<string>();
  private revokedUsers = new Set<string>();
  private storageFrozen = false;

  async executeMitigation(action: string, target: string) {
    if (this.PROTECTED_TARGETS.includes(target)) {
      this.logger.error(`❌ MITIGATION BLOCKED: Attempted to ${action} a protected target: ${target}`);
      return false;
    }

    const normalizedAction = action.toUpperCase().replace(/\s+/g, '');
    this.logger.warn(`[SECURITY AGENT] Initiating Mitigation: ${action} on ${target}`);

    switch (normalizedAction) {
      case 'BLOCK_IP':
        this.blockedIps.add(target);
        this.logger.log(`🚫 IP ${target} added to Blacklist.`);
        break;
      
      case 'REVOKE_USER':
        this.revokedUsers.add(target);
        this.logger.log(`👤 User Session for ${target} TERMINATED.`);
        break;

      case 'FREEZE_STORAGE':
        if (!this.storageFrozen) {
            this.storageFrozen = true;
            this.logger.error(`❄️ STORAGE CIRCUIT BREAKER TRIGGERED!`);
        }
        break;
      
      default:
        this.logger.log('No actionable mitigation identified.');
    }
    return true;
  }

  isBlocked(ip: string, user: string): boolean {
    return this.blockedIps.has(ip) || this.revokedUsers.has(user) || this.storageFrozen;
  }

  // ✅ NEW GETTER METHODS FOR THE DASHBOARD
  getBlockedIps(): string[] {
    return Array.from(this.blockedIps);
  }

  getRevokedUsers(): string[] {
    return Array.from(this.revokedUsers);
  }

  getStorageFrozen(): boolean {
    return this.storageFrozen;
  }
}