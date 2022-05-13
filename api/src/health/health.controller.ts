import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@ApiTags('Service Health')
@Controller('system/health')
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}
  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Get health status of service',
  })
  check() {
    return this.healthService.check([]);
  }
}
