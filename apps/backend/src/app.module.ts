import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth/auth.module';
import { DetailModule } from './detail/detail.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { InvoiceModule } from './invoice/invoice.module';
import { PatientModule } from './patient/patient.module';
import { StorageModule } from './storage/storage.module';
import { TreatmentModule } from './treatment/treatment.module';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [JwtModule],
  exports: [JwtModule],
})
export class GlobalModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development', '.env.production'],
      isGlobal: true,
    }),
    GlobalModule,
    UserModule,
    AuthModule,
    InvoiceModule,
    PatientModule,
    DetailModule,
    TreatmentModule,
    StorageModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply().forRoutes({ path: '*', method: RequestMethod.ALL });
  // }
}
