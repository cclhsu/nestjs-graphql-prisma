import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../../../stakeholders/user/factory/graphql/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from '../../auth.service';
import { JwtAuthStrategy } from '../../strategies/jwt-auth.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    // GraphQLModule,
    UserModule, // Add the UsersModule or your user-related module
  ],
  providers: [AuthService, JwtAuthStrategy, AuthResolver],
  exports: [AuthService, JwtModule, JwtAuthStrategy],
})
export class AuthModule {}
