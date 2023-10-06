// Path: src/app-factory/graphql/graphql.module.ts
// DESC: This is the main entry point for the graphql application.
'use strict';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';
import type { RedisClientOptions } from 'redis';
import { AuthModule } from '../../auth/factory/graphql/auth.module';
import { HealthModule } from '../../health/factory/graphql/health.module';
import { HelloModule } from '../../hello/factory/graphql/hello.module';
import { TeamModule } from '../../stakeholders/team/factory/graphql/team.module';
import { UserModule } from '../../stakeholders/user/factory/graphql/user.module';
import { CsvModule } from '../../utils/csv/csv.module';
import { GraphQLModule } from '@nestjs/graphql';
import { JsonModule } from '../../utils/json/json.module';
import { MarkdownModule } from '../../utils/markdown/markdown.module';
import { RequestLoggerMiddleware } from '../../utils/middleware/request-logger.middleware';
import { YamlModule } from '../../utils/yaml/yaml.module';
// import { MetricsMiddleware } from 'src/utils/middleware/metrics.middleware';

// import { JwtAuthStrategy as AuthStrategy } from '../../auth/strategies/jwt-auth.strategy';
// import { LocalAuthStrategy as AuthStrategy } from '../../auth/strategies/local-auth.strategy';
// import { validate } from '../../validation/env.validation';

@Module({
  imports: [
    JsonModule,
    YamlModule,
    CsvModule,
    MarkdownModule,
    // ConfigModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    // CacheModule.register(),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: configService.get('REDIS_TTL') | 60,
      }),
      inject: [ConfigService],
    }),
    TerminusModule,
    // // GraphQL: Code First
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'api/graphql/schema/schema.gql'),
    //   sortSchema: true,
    // }),
    // GraphQL: Schema First
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['api/graphql/schema/**/*.graphql'],
    }),
    HelloModule,
    HealthModule,
    AuthModule,
    UserModule,
    TeamModule,
  ],
  controllers: [],
  providers: [
    /*AuthStrategy*/
  ],
})
export class MyGraphQLModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    // consumer.apply(MetricsMiddleware).forRoutes({ path: 'metrics', method: RequestMethod.GET });
  }
}
