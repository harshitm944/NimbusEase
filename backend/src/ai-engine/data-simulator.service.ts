import { Injectable } from '@nestjs/common';

@Injectable()
export class DataSimulatorService {
  private calculateEntropy(text: string): number {
    if (!text) return 0;
    const charCounts: Record<string, number> = {};
    for (const char of text) {
      charCounts[char] = (charCounts[char] || 0) + 1;
    }
    const probs = (Object.values(charCounts) as number[]).map((count: number) => count / text.length);
    return -probs.reduce((sum, p) => sum + p * Math.log2(p), 0);
  }

  generateLogs(nSamples = 1000, anomalyRatio = 0.05) {
    const data = [];
    const users = ['user_1', 'user_2', 'user_3', 'admin', 'service_account'];
    const ips = ['192.168.1.1', '10.0.0.5', '45.23.12.88', '172.16.0.10'];

    for (let i = 0; i < nSamples; i++) {
      const isAnomaly = Math.random() < anomalyRatio;
      let log: any;

      if (!isAnomaly) {
        log = {
          user: users[Math.floor(Math.random() * users.length)],
          ip: ips[Math.floor(Math.random() * ips.length)],
          action: 'READ',
          resource: '/api/products',
          details: 'Standard access',
          statusCode: 200,
          timestamp: new Date().toISOString(),
          isAnomaly: 0,
          metadata: { flowDuration: 150, totalFwdPackets: 4, idleMin: 50 } // Normal traffic
        };
      } else {
        const attackTypeRoll = Math.random();
        
        if (attackTypeRoll < 0.25) {
          log = {
            user: 'unknown',
            ip: '45.23.12.' + Math.floor(Math.random() * 255),
            action: 'QUERY',
            resource: 'users_table',
            details: "SELECT * FROM users WHERE id='1' OR '1'='1'",
            statusCode: 200,
            timestamp: new Date().toISOString(),
            isAnomaly: 1,
            attackType: 'sql_injection',
            metadata: { flowDuration: 500, totalFwdPackets: 15, idleMin: 0 }
          };
        } else if (attackTypeRoll < 0.5) {
          log = {
            user: 'unknown',
            ip: '192.168.1.105',
            action: 'LOGIN',
            resource: '/api/auth/login',
            details: 'Failed login attempt',
            statusCode: 401,
            timestamp: new Date().toISOString(),
            isAnomaly: 1,
            attackType: 'brute_force',
            metadata: { flowDuration: 999999, totalFwdPackets: 8000, idleMin: 0 } // High packets trigger TFJS
          };
        } else if (attackTypeRoll < 0.75) {
          log = {
            user: 'user_2',
            ip: '10.0.0.5',
            action: 'READ',
            resource: 'storage/../../etc/passwd',
            details: 'File access attempt',
            statusCode: 403,
            timestamp: new Date().toISOString(),
            isAnomaly: 1,
            attackType: 'path_traversal',
            metadata: { flowDuration: 300, totalFwdPackets: 8, idleMin: 20 }
          };
        } else {
          log = {
            user: 'admin',
            ip: '172.16.0.20',
            action: 'DELETE',
            resource: `/storage/files/doc_${Math.floor(Math.random() * 100)}.pdf`,
            details: 'Renaming to .encrypted',
            statusCode: 200,
            timestamp: new Date().toISOString(),
            isAnomaly: 1,
            attackType: 'ransomware',
            metadata: { flowDuration: 8000, totalFwdPackets: 500, idleMin: 0 }
          };
        }
      }

      log.text_content = `${log.action} ${log.resource} ${log.details}`;
      log.entropy = this.calculateEntropy(log.text_content);
      
      data.push(log);
    }
    return data;
  }
}