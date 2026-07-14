import { Module } from '@nestjs/common'
import { AppConfigModule } from './config/app-config.module.js'
import { PrismaModule } from './database/prisma.module.js'
import { GamesModule } from './modules/games/games.module.js'
import { HealthModule } from './modules/health/health.module.js'
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module.js'

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    HealthModule,
    GamesModule,
    SubscriptionsModule
  ]
})
export class AppModule {}
