import { Controller, Get, Post, Param, UseGuards, Logger } from '@nestjs/common';
import { SecurityDashboardService } from './security-dashboard.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../users/user.entity';
import { spawn } from 'child_process';
import * as path from 'path';

@Controller('security')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class SecurityController {
  private readonly logger = new Logger(SecurityController.name);

  constructor(private dashboardService: SecurityDashboardService) {}

  @Get('dashboard')
  async getDashboard() {
    return await this.dashboardService.getSystemHealth();
  }

  @Post('simulate/:type')
  async runSimulation(@Param('type') type: string) {
    this.logger.log(`🚀 Starting Security Simulation: ${type}`);
    
    let scriptPath = '';
    switch (type) {
      case 'threats': scriptPath = 'simulate-threats.ts'; break;
      case 'advanced': scriptPath = 'simulate-advanced-threats.ts'; break;
      case 'futuristic': scriptPath = 'simulate-futuristic-threats.ts'; break;
      case 'all': scriptPath = 'simulate-all-threats.ts'; break;
      default: return { message: 'Invalid simulation type' };
    }

    const fullPath = path.join(process.cwd(), 'src/scripts', scriptPath);
    
    // Run as background process so we don't block the UI
    const child = spawn('npx', ['ts-node', fullPath], {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();

    return { 
      message: `Simulation ${type} initiated in background.`,
      timestamp: new Date().toISOString()
    };
  }
}
