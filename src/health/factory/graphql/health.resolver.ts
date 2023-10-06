import { Args, Query, Resolver } from '@nestjs/graphql';
import HealthRequestDTO from '../../dto/health-request.dto';
import HealthResponseDTO from '../../dto/health-response.dto';
import {
  HealthRequestInput,
  HealthResponse,
  IQuery,
} from '../../../../generated/graphql/health/health.graphql';
import { HealthService } from '../../health.service';

@Resolver('health')
export class HealthResolver implements IQuery {
  constructor(private readonly healthService: HealthService) {}

  // curl -s -X POST -H "Content-Type: application/json" http://0.0.0.0:3001/graphql -d '{"query": "{ HealthCheck(request: { service: \"all\" }) { service, status, message } }" }' | jq
  // curl 'http://0.0.0.0:3001/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://0.0.0.0:3001' --data-binary '{"query":"# Write your query or mutation here\n{\n  HealthCheck(request: { service: \"all\" }) {\n    service\n    status\n    message\n  }\n}\n"}' --compressed
  @Query(() => HealthResponse, { name: 'HealthCheck' })
  async HealthCheck(@Args('request') request: HealthRequestInput): Promise<HealthResponse> {
    // Ensure that 'request' is defined before accessing its properties
    if (!request || typeof request.service !== 'string') {
      throw new Error('Invalid request.');
    }

    // Call your health service and return the result
    const result: HealthResponseDTO = await this.healthService.isHealthy(
      new HealthRequestDTO(request.service),
    );

    // Create and return the HealthResponseDTO here
    const healthResponse: HealthResponse = {
      service: request.service,
      status: result.status,
      message: result.message,
    };

    return healthResponse;
  }
}
