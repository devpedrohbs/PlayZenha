import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { configureApp } from './app.setup.js'
import { AppConfigService } from './config/app-config.service.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  const config = app.get(AppConfigService)

  app.useLogger([...config.loggerLevels])
  configureApp(app)
  app.enableShutdownHooks()

  await app.listen(config.port)
}

await bootstrap()
