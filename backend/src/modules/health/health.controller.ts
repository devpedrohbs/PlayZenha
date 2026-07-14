import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger'
import { HealthService } from './health.service.js'

class HealthResponseDto {
  @ApiProperty({ enum: ['ok'] })
  status!: 'ok'

  @ApiProperty({ example: 'playzenha-api' })
  service!: string

  @ApiProperty({ format: 'date-time' })
  timestamp!: string
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({ type: HealthResponseDto })
  getStatus() {
    return this.healthService.getStatus()
  }
}
