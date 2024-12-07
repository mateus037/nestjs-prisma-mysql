import { APP_GUARD } from "@nestjs/core";
import { forwardRef, Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import { FileModule } from './file/file.module';
import { MailerModule } from "@nestjs-modules/mailer";
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]), forwardRef(() => UserModule), forwardRef(() => AuthModule), FileModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'elwin.howell27@ethereal.email',
          pass: 'edZkjSXah3GhqDhjnz'
        }
      },
      defaults: {
        from: '"Hcode" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD, useClass: ThrottlerGuard
  }],
})
export class AppModule { }
