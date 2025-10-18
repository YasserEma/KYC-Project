import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import appConfig from './config/app.config';
import { validateEnv } from './config/validation.schema';

const shouldInitDb = process.env.SKIP_DB !== 'true';
const typeOrmImports = shouldInitDb
  ? [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          validateEnv();
          return getDatabaseConfig(configService);
        },
      }),
    ]
  : [];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    ...typeOrmImports,
  ],
})
export class AppModule {}