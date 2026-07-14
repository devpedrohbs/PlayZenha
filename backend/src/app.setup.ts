import { ValidationPipe } from '@nestjs/common'
import type { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppConfigService } from './config/app-config.service.js'

export function configureApp(app: INestApplication) {
  const config = app.get(AppConfigService)

  app.use(helmet())
  app.enableCors({
    origin: config.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  if (config.swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('PlayZenha API')
      .setDescription(
        'HTTP API for the PlayZenha game catalog and subscriptions.'
      )
      .setVersion('0.1.0')
      .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('docs', app, document, {
      jsonDocumentUrl: 'docs-json'
    })
  }
}
