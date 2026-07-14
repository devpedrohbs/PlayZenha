import { Injectable } from '@nestjs/common'

@Injectable()
export class HealthService {
  getStatus() {
    return {
      status: 'ok' as const,
      service: 'playzenha-api',
      timestamp: new Date().toISOString()
    }
  }
}
