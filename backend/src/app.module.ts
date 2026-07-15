import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AppConfigModule } from './config/app-config.module.js'
import { PrismaModule } from './database/prisma.module.js'
import { AuthModule } from './modules/auth/auth.module.js'
import { AuthorizationModule } from './modules/authorization/authorization.module.js'
import { GamesModule } from './modules/games/games.module.js'
import { HealthModule } from './modules/health/health.module.js'
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module.js'

@Module({
  imports: [
    AppConfigModule,
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    AuthorizationModule,
    HealthModule,
    GamesModule,
    SubscriptionsModule
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }]
})
export class AppModule {}
