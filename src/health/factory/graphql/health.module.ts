// Path: src/health/health.module.ts
// DESC: health module
'use strict';
import { Module } from '@nestjs/common';
// import { GraphQLModule } from '@nestjs/graphql';
import { HealthResolver } from './health.resolver';
import { HealthService } from '../../health.service';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  providers: [HealthService, HealthResolver],
  exports: [HealthService],
})
export class HealthModule {}
